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
                res.json({ status: "error", message: `El carrito ${ cid } no existe.`});
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
                let product = cart.products.find((p) => { return parseInt(p.product) === parseInt(productId) });
    
                if (product)
                {
                    let indice = cart.products.findIndex(prod => product.id == id);
                    cart.products.splice(indice, 1);
                    CartsServices.updateCart(cartId, cart);
                }
                else
                {
                    res.json({ status: "error", message: `El producto ${ pid } no existeen el carrito ${ cid }.`});
                }
            }
            else
            {
                res.json({ status: "error", message: `El carrito ${ cid } no existe.`});
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
    
                CartsServices.updateCart(cart);
    
            }
            else {
                res.json({ status: "error", message: `El carrito ${ cid } no existe.`});
            }
    
        }
        catch (error) {
            res.json({ status:"error", message: error.message });
        }
    };


    static purchase = async (req, res) => {
        try {
            
        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    };

}