import passport from "passport";
import LocalStrategy from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import gitHubStrategy from "passport-github2";
import { config } from "./config.js";
import { UsersServices } from "../services/users.services.js";

export const initializePassport = () => {

    passport.use("signupStrategy", new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, age } = req.body;
                const user = await UsersServices.getUserByEmail(username);
                if (user) {
                    return done(null, false);
                }

                let role = "user";
                if (username.endsWith("@coder.com")) {
                    role = "admin";
                }

                const newUser =  {
                    first_name,
                    last_name,
                    age,
                    email: username,
                    password: createHash(password),
                    role: role
                };
                const userCreated = await UsersServices.saveUser(newUser);

                // Se completa el proceso de forma satisfactoria.
                return done(null, userCreated);
            }
            catch (error) {
                return done(error);
            }
        }
    ));


    passport.use("loginStrategy", new LocalStrategy(
        {
            usernameField: "email"
        },
        async (username, password, done) => {
            try {
                // Verificamos que el usuario esté registrado previamente.
                const user = await UsersServices.getUserByEmail(username);

                if (!user) {
                    return done(null, false);
                }

                // Si el usuario existe, se valida la password.
                if (isValidPassword(user, password)) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            }
            catch (error) {
                return done(error);
            }
        }
    ));


    passport.use("githubLoginStrategy", new gitHubStrategy(
        {
            clientID: config.github.clientId,
            clientSecret: config.github.clientSecret,
            callbackUrl: config.github.callbackUrl
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("profile", profile);
                const user = await UsersServices.getUserByEmail(profile.username);
                if (!user) {

                    let role = "user";
                    if (profile.username.endsWith("@coder.com")) {
                        role = "admin";
                    }

                    const newUser = {
                        first_name: profile.username,
                        last_name: profile.username,
                        email: profile.username,
                        password: createHash(profile.id),
                        role: role
                    };
                    const userCreated = await UsersServices.saveUser(newUser);
                    return done(null, userCreated);
                }
                else {
                    return done(null, user);
                }
            }
            catch (error) {
                return done(error);
            }
        }
    ));


    // Serialización y deserialización
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });


    passport.deserializeUser(async (id, done) => {
        const user = await UsersServices.getUserById(id);
        done(null, user); // Se crea el req.user
    });

};