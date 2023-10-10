import { Router } from "express";
import { SessionsController } from "../controllers/sessions.controller.js";


//import { userDao } from "../dao/index.js"
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router()


router.post("/signup", passport.authenticate("signupStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), SessionsController.redirectLogin);

router.get("/fail-signup", SessionsController.failedSignup);

router.post("/login", passport.authenticate("loginStrategy", {
    failureRedirect: "/api/sessions/fail-login"
}), SessionsController.redirectProducts);

router.get("/fail-login", SessionsController.failedLogin);

router.get("/loginGithub", passport.authenticate("githubLoginStrategy"));

router.get("/github-callback", passport.authenticate("githubLoginStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), SessionsController.redirectProfile);

router.get("/logout", SessionsController.logOut)


export { router as sessionsRouter }