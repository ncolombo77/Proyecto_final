import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";


const validateFields = (req, res, next) => {
    const productInfo = req.body;

    if (!productInfo.title || !productInfo.description || !productInfo.price ||
        !productInfo.code || !productInfo.status || !productInfo.stock || !productInfo.category) {
            return res.json({status: "error", message: "Falta información del producto."});
        }
    else {
        next();
    }
}


const router = Router();


router.get("/", ProductsController.getProducts);

router.get("/:pid", ProductsController.getProduct);

router.post("/", validateFields, ProductsController.createProduct);

router.put("/:pid", validateFields, ProductsController.updateProduct);

router.delete("/:pid", ProductsController.deleteProduct);


export { router as productsRouter };