import { cartsModel } from "../../models/carts.model.js";

export class CartManagerMongo {
    constructor() {
        this.model = cartsModel;
    }

    async getAll(){
        try {
            const carts = await this.model.find();
            return carts;
        } catch (error) {
            throw new error(`Se produjo un error al leer los carritos.`);
        }
    }


    async getById(id){
        try {
            const cart = await this.model.findById(id);
            return cart;
        } catch (error) {
            throw new error(`Se produjo un error al leer el carrito ${ id }.`);
        }
    }


    async save(){
        try {
            const cartCreated = await this.model.create({});
            return cartCreated;
        } catch (error) {
            throw new error(`Se produjo un error al crear el carrito.`);
        }
    }


    async update(cartId, cart){
        try {
            const cartUpdated = await this.model.findByIdAndUpdate(cartId, cart, {new: true});
            return cartUpdated;
        } catch (error) {
            throw error;
            //throw new error(`Se produjo un error al actualizar el carrito ${ cart.id }.`);
        }
    }

}