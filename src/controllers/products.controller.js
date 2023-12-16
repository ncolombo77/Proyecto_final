import { ProductsServices } from "../services/products.services.js";
import { UsersServices } from "../services/users.services.js";
import { CustomError } from "../services/error/customError.services.js";
import { EError } from "../enums/EError.js";
import { invalidLimitErrorMsg } from "../services/error/customErrorMessages.services.js";
import { addLogger } from "../helpers/logger.js";
import { deletedProductEmail } from "../helpers/gmail.js";

const logger = addLogger();


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
            productInfo.owner = req.user._id;
            productInfo.image = req.file.filename;
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
    
            const productUpdated = await ProductsServices.updateProduct(productInfo._id, productInfo);
    
            res.json({ status: "success", data: productUpdated, message: "Producto actualizado." });
        }
        catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };


    static deleteProduct = async (req, res) => {
        try {
            const productId = req.params.pid;

            const product = await ProductsServices.getById(productId);

            // Se verifica que si el usuario es premium, sea el owner del producto.
            if (req.user.role === "premium" && product.owner.toString() === req.user._id.toString() || req.user.role === "admin") {

                // En caso de que el owner del producto sea un usuario premium, se le envía
                // un correo electrónico informándole de la baja del producto.
                const productOwner = await UsersServices.getUserById(product.owner.toString());
                if (productOwner.role === "premium") {
                    await deletedProductEmail(productOwner.email, product);
                }

                const productDeleted = await ProductsServices.deleteProduct(productId);
    
                res.json({ status: "success", data: productDeleted });

            }
            else
            {
                return res.json({ status: "error", message: "El usuario no tiene permisos para eliminar el producto." });
            }

        }
        catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };

}