import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";


const router = Router();


router.post("/", CartsController.createCart);

router.get("/:cid", CartsController.getCart);

router.post("/:cid/product/:pid", CartsController.addProductToCart);

router.delete("/:cid/products/:pid", CartsController.removeProductFromCart);

router.put("/:cid", CartsController.updateCart);

export { router as cartsRouter };