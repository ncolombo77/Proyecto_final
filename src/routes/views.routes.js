import { Router } from "express";
import { checkUserAuthenticated, showLoginView, checkRole } from "../middlewares/auth.js";
import { ViewsController } from "../controllers/views.controlller.js";

const router = Router();


router.get("/", ViewsController.renderHome);

router.get("/register", showLoginView, ViewsController.renderSignUp);

router.get("/login", showLoginView, ViewsController.renderLogin);

router.get("/profile", checkUserAuthenticated, ViewsController.renderProfile);

router.get("/products", ViewsController.renderProducts);

router.get("/cart", ViewsController.renderCart);

router.get("/ticket", ViewsController.renderTicket);

router.get("/realtimeproducts", ViewsController.renderRTProducts);

router.get("/chat", ViewsController.renderChat);

router.get("/forgot-password", ViewsController.renderForgotPassword);

router.get("/reset-password", ViewsController.renderResetPassword);

router.get("/users", checkRole(["admin"]), ViewsController.renderUsers);

export { router as viewsRouter };