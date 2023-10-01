import { cartDao } from "../dao/index.js";

export class CartsServices {

    static createCart = async () => {
        return await cartDao.save();
    };


    static getCart = async (cartId) => {
        return await cartDao.getById(cartId);
    };


    static updateCart = async (cartInfo) => {
        return await cartDao.update(cartInfo);
    };

}