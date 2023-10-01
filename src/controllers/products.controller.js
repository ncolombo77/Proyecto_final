import { ProductsServices } from "../services/products.services.js";

export class ProductsController {

    static getProducts = async (req, res) => {
        try {
            const limit = req.query.limit;
    
            const products = await ProductsServices.getProducts();
    
            if (limit) {
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