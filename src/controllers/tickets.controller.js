import { TicketsService } from "../services/tickets.services.js";
import { CartsServices } from "../services/carts.services.js";
import { ProductsServices } from "../services/products.services.js";
import { faker, Faker } from "@faker-js/faker";

export class TicketsController {

    static createTicket = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await CartsServices.getCart(cartId);

            const productsCart = cart.products;

            let purchaseProducts = [];
            let rejectedProducts = [];
            let amount = 0;

            for (let i = 0; i < productsCart.length; i++) {
                const prod = await ProductsServices.getById(productsCart[i].productId);
                if (prod) {
                    if (prod.stock >= productsCart[i].quantity) {

                        purchaseProducts.push(productsCart[i]);
                        prod.stock -= productsCart[i].quantity;

                        amount += productsCart[i].quantity * prod.price;

                        const productUpdated = await ProductsServices.updateProduct(prod._id, prod);

                    }
                    else {

                        rejectedProducts.push(productsCart[i]);

                    }
                }
            }

            cart.products = rejectedProducts;

            const newTicket = {
                code: faker.string.alphanumeric(6),
                purchase_datetime: new Date(),
                amount: amount,
                purchaser: req.user.username
            };

            const ticketCreated = await TicketsService.createTicket(newTicket);

            if (rejectedProducts.length > 0) {
                res.json({status:"success", data: rejectedProducts});
            }

            res.json({status: "success", message: "Ticket generado correctamente"});

        } catch (error) {
            res.json({status: "error", message: error.message});
        }
    }
}