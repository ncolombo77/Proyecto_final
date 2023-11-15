import { UsersServices } from "../services/users.services.js";
import { generateEmailWithToken, recoveryEmail } from "../helpers/gmail.js";
import { validateToken, createHash } from "../utils.js";

export class SessionsController {

    static failedSignup = (req, res) => {
        res.render("signup", { error: "No se pudo registrar el usuario." });
    };


    static failedLogin = (req, res) => {
        res.render("login", {error: "Credenciales incorrectas."})
    };


    static redirectLogin = (req, res) => {
        res.render("login", { message:"Te has registrado exitosamente, para continuar inicia sesión." });
    };


    static redirectProducts = (req, res) => {
        res.redirect(303, "/products");
    };


    static currentUser = (req, res) => {
        if (req.user)
            res.json({status: "success", data: req.user});
        else
            res.json({status: "error", message: "No hay usuario logueado."});
    };


    static redirectProfile = (req, res) => {
        res.redirect(303, "/profile");
    };


    static logOut = (req, res) => {
        req.logOut(error => {
            if(error) {
                return res.status(500).render("profile", {user: req.user, error: "No se pudo cerrar la sesión."});
            }
            else {
                // Elimina la sesión de la base de datos.
                req.session.destroy( error => {
                    if (error) {
                        return res.status(500).render("profile", {user: req.session.userInfo, error: "No se pudo cerrar la sesión."});
                    }
                });
            }
        });
    
        res.redirect(303, "/login");
    };


    static forgotPassword = async (req, res) => {
        try {

            const { email } = req.body;

            const user = await UsersServices.getUserByEmail(email);

            if (!user) {
                return res.json({status: "error", message: "No es posible reestablecer la constraseña. No hay usuarios vinculados a ese e-mail."});
            }

            const token = generateEmailWithToken(email, 3 * 60);

            await recoveryEmail(req, email, token);

            res.render("tokenSent");

        } catch (error) {
            res.json({status: "error", message: "No es posible reestablecer la constraseña: " + error.message});
        }
    };


    static resetPassword = async (req, res) => {
        try {
            const token = req.query.token;
            const { newPassword } = req.body;
            const validEmail = validateToken(token);
            if (validEmail) {
                const user = await UsersServices.getUserByEmail(validEmail);
                if (user) {
                    user.password = createHash(newPassword);
                    await UsersServices.updateUser(user._id, user);
                    res.render("login", { message:"Contraseña actualizada, para continuar inicia sesión." });
                }
            }
            else {
                res.render("login", {error: "El enlace ha caducado, intentar nuevamente."})
            }
        } catch (error) {
            return res.send("No se pudo reestablecer la contraseña.")
        }


    };


}