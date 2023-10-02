import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { checkRole } from "../middlewares/auth.js";
import { TicketsController } from "../controllers/tickets.controller.js";


const router = Router();


router.post("/", CartsController.createCart);

router.get("/", CartsController.getAll);

router.get("/:cid", CartsController.getCart);

router.post("/:cid/product/:pid", checkRole(["user"]), CartsController.addProductToCart);

router.delete("/:cid/products/:pid", CartsController.removeProductFromCart);

router.put("/:cid", CartsController.updateCart);

router.post("/:cid/purchase", TicketsController.createTicket);

export { router as cartsRouter };