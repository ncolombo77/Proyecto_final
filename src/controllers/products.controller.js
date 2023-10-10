import { ProductsServices } from "../services/products.services.js";
import { CustomError } from "../services/error/customError.services.js";
import { EError } from "../enums/EError.js";
import { invalidLimitErrorMsg } from "../services/error/customErrorMessages.services.js";

export class ProductsController {

    static getProducts = async (req, res) => {
        try {
            const strLimit = req.query.limit;

            const products = await ProductsServices.getProducts();

            if (strLimit) {

                const limit = parseInt(strLimit);

                if (Number.isNaN(limit)) {
                    CustomError.createError({
                        name: "getProducts error",
                        cause: invalidLimitErrorMsg(strLimit),
                        message: "Error al devolver los productos.",
                        errorCode: EError.INVALID_PARAM
                    });
                };

                res.send(products.slice(0, limit));
            }
            else {
                res.json({ status: "success", data: products });
            }

        }
        catch (error) {
            res.json({ status:"error", message: error.message });
        }
    };


    static getProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
    
            const product = await ProductsServices.getById(productId);
    
            res.json({ status: "success", data: product });
        }
        catch (error) {
            res.json({ status:"error", message: error.message });
        }
    };


    static createProduct = async (req, res) => {
        try {
            const productInfo = req.body;
            const productCreated = await ProductsServices.createProduct(productInfo);
            res.json({ status: "success", data: productCreated, message: "Producto creado." });
        }
        catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };


    static updateProduct = async (req, res) => {
        try {
            const productInfo = req.body;
    
            const productUpdated = await ProductsServices.updateProduct(productInfo);
    
            res.json({ status: "success", data: productUpdated, message: "Producto actualizado." });
        }
        catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };


    static deleteProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
    
            const productDeleted = await ProductsServices.delete(productId);
    
            res.json({ status: "success", data: productDeleted });
        }
        catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };

}