import { cartDao } from "../dao/index.js";

export class CartsServices {

    static saveCart = async (cartInfo) => {
        return await cartDao.save(cartInfo);
    };


    static getCarts = async () => {
        return await cartDao.getAll();
    };


    static getCart = async (cartId) => {
        return await cartDao.getById(cartId);
    };


    static updateCart = async (cartId, cart) => {
        return await cartDao.update(cartId, cart);
    };

}