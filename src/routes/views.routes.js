import { Router } from "express";
import { checkUserAuthenticated, showLoginView } from "../middlewares/auth.js";
import { ViewsController } from "../controllers/views.controlller.js";

const router = Router();


router.get("/", ViewsController.renderHome);

router.get("/register", showLoginView, ViewsController.renderSignUp);

router.get("/login", showLoginView, ViewsController.renderLogin);

router.get("/profile", checkUserAuthenticated, ViewsController.renderProfile);

router.get("/products", ViewsController.renderProducts);

router.get("/realtimeproducts", ViewsController.renderRTProducts);

router.get("/chat", ViewsController.renderChat);


export { router as viewsRouter };