import { cartsModel } from "../../models/carts.model.js";
import { addLogger } from "../../../helpers/logger.js";

const logger = addLogger();


export class CartManagerMongo {
    constructor() {
        this.model = cartsModel;
    }

    async getAll(){
        try {
            const carts = await this.model.find();
            return carts;
        } catch (error) {
            logger.error(`Se produjo un error al leer los carritos.`)
            throw error;
        }
    }


    async getById(id){
        try {
            const cart = await this.model.findById(id);
            return cart;
        } catch (error) {
            logger.error(`Se produjo un error al leer el carrito ${ cart.id }.`)
            throw error;
        }
    }


    async save(){
        try {
            const cartCreated = await this.model.create({});
            return cartCreated;
        } catch (error) {
            logger.error(`Se produjo un error al crear el carrito.`)
            throw error;
        }
    }


    async update(cartId, cart){
        try {
            const cartUpdated = await this.model.findByIdAndUpdate(cartId, cart, {new: true});
            return cartUpdated;
        } catch (error) {
            logger.error(`Se produjo un error al actualizar el carrito ${ cart.id }.`)
            throw error;
        }
    }

}