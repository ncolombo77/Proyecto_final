import { CartsServices } from "../services/carts.services.js";
import { ProductsServices } from "../services/products.services.js";

export class CartsController {

    static createCart = async (req, res) => {
        try {
            const cartCreated = await CartsServices.saveCart();
            res.json({ status: "success", data: cartCreated, message: "Carrito creado." });
        }
        catch (error) {
            res.json({ status:"error", message: error.message });
        }
    };


    static getAll = async (req, res) => {
        try {
            const carts = await CartsServices.getCarts();
            res.json({status: "success", data: carts});
        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    };


    static getCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
    
            const cart = await CartsServices.getCart(cartId);
    
            res.json({ status: "success", data: cart });
        }
        catch (error) {
            res.json({ status:"error", message: error.message });
        }
    };


    static addProductToCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
    
            const cart = await CartsServices.getCart(cartId);
            if (cart) {
                const product = await ProductsServices.getById(productId);

                if (req.user.role !== "premium" && product.owner.toString() !== req.user._id.toString()) {
                    let prod = cart.products.find(p => p.productId == productId );

                    if (prod != undefined) {
                        prod.quantity++;
                    }
                    else {
                        const newProd = {
                            productId: productId,
                            quantity: 1
                        };
                        cart.products.push(newProd);
                    }
        
                    const cartUpdated = await CartsServices.updateCart(cartId, cart);
        
                    res.json({ status: "success", data: cartUpdated });
                }
                else {
                    res.json({ status: "error", message: `El usuario tiene rol premium, no puede comprar productos creados por él.`});
                }


            }
            else {
                res.status(400).json({ status: "error", message: `El carrito ${ cid } no existe.`});
            }
    
        }
        catch (error) {
            res.json({ status:"error", message: error.message });
        }
    };


    static removeProductFromCart = async (req, res) => {
        try {

            const cartId = req.params.cid;
            const productId = req.params.pid;        
    
            const cart = await CartsServices.getCart(cartId);
            if (cart)
            {
                let product = cart.products.find((p) => { return p.productId.toString() === productId.toString() });
    
                if (product)
                {
                    let indice = cart.products.findIndex(prod => prod.productId.toString() === productId.toString());

                    if (indice > -1) {
                        cart.products.splice(indice, 1);
                        const cartUpdated = CartsServices.updateCart(cartId, cart);
                        res.json({ status: "success", data: cartUpdated });
                    }
                    else {
                        res.json({ status:"error", message: error.message });
                    }

                }
                else
                {
                    res.status(400).json({ status: "error", message: `El producto ${ pid } no existe en el carrito ${ cid }.`});
                }
            }
            else
            {
                res.status(400).json({ status: "error", message: `El carrito ${ cid } no existe.`});
            }
    
        }
        catch (error) {
            res.json({ status:"error", message: error.message });
        }
    };


    static updateCart = async (req, res) => {
        try {

            const cartId = req.params.cid;
    
            const cart = await CartsServices.getCart(cartId);
    
            if (cart) {
    
                const newProducts = req.body;
    
                cart.products = newProducts;
    
                const cartUpdated = CartsServices.updateCart(cart);

                res.json({ status: "success", data: cartUpdated });
    
            }
            else {
                res.status(400).json({ status: "error", message: `El carrito ${ cid } no existe.`});
            }
    
        }
        catch (error) {
            res.json({ status:"error", message: error.message });
        }
    };

}