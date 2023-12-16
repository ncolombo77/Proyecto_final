import { ProductsServices } from "../services/products.services.js";
import { UsersServices } from "../services/users.services.js";
import { CartsServices } from "../services/carts.services.js";

export class ViewsController {

    static renderHome = (req, res) => {
        res.render("home");
    };


    static renderSignUp = (req, res) => {
        res.render("signup");
    };


    static renderLogin = (req, res) => {
        res.render("login");
    };


    static renderProfile = async (req, res) => {
        res.render("profile", {user: JSON.parse(JSON.stringify(req.user))});
    };


    static renderProducts = async (req, res) => {
        try {
            // Obtengo los parámetros para el listado de productos.
            const {limit = 8, page = 1, stock, sort = "asc"} = req.query;
    
            const stockValue = stock === 0 ? undefined : parseInt(stock);
    
            if (!["asc", "desc"].includes(sort)) {
                res.render("products", {error:"Orden no valido."});
            }

            const sortValue = sort === "asc" ? 1 : -1;

            let query = {};
            if(stockValue) {
                query = { stock:{$gte:stockValue} };
            }

            const result = await ProductsServices.getWithPaginate(query, { page, limit, sort:{price:sortValue}, lean: true });

            let productsInCart = 0;
            if (req.user) {
                const userCart = await CartsServices.getCart(req.user.cart);
                productsInCart = userCart.products.length;
            }

            let baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
            if (result.page == 1)
                baseUrl += `?page=1`;
    
            const hostUrl = `${req.protocol}://${req.get("host")}`;
    
            const resultProductsView = {
                status:"success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}` : null,
                nextLink: result.hasNextPage ? `${baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`)}` : null,
                hostUrl,
                user: req.user ? JSON.parse(JSON.stringify(req.user)) : "",
                productsInCart
            };
    
            res.render("products", resultProductsView );
        }
        catch (error) {
            console.log(error);
            res.render("error", error);
        }
    };


    static renderRTProducts = async (req, res) => {
        try {
            const products = await ProductsServices.getProducts();
    
            res.render("realTimeProducts", { products });
        }
        catch (error) {
            res.render("error", error);
        }
    };


    static renderChat = (req, res) => {
        res.render("chat");
    };


    static renderForgotPassword = (req, res) => {
        res.render("forgotPassword");
    };


    static renderResetPassword = (req, res) => {
        const token = req.query.token;
        res.render("resetPassword", {token});
    };


    static renderUsers = async (req, res) => {
        try {

            const users = await UsersServices.getUsers();

            const resultUsersView = {
                user: req.user.toJSON(),
                users: users,
                hostUrl: `${req.protocol}://${req.get("host")}`
            };

            res.render("users", resultUsersView);

        } catch (error) {
            res.render("error", error);
        }
    };


    static renderCart = async (req, res) => {
        try {

            const userCart = await CartsServices.getCart(req.user.cart);

            let productsInCart = [];
            let totalAmmount = 0;

            for (let i = 0; i < userCart.products.length; i++) {

                const prod = await ProductsServices.getById(userCart.products[i].productId);

                if (prod) {

                    productsInCart.push({
                        title: prod.title,
                        price: prod.price,
                        quantity: userCart.products[i].quantity,
                        subTotal: prod.price * userCart.products[i].quantity
                    });

                    totalAmmount += prod.price * userCart.products[i].quantity;

                }
            }

            const resultCartView = {
                user: req.user.toJSON(),
                products: productsInCart,
                totalAmmount,
                hostUrl: `${req.protocol}://${req.get("host")}`
            };

            res.render("cart", resultCartView);

        } catch (error) {
            res.render("error", error);
        }
    };


}