import { productDao } from "../dao/index.js";

export class ProductsServices {

    static getProducts = async () => {
        return await productDao.get();
    };


    static getById = async (productId) => {
        return await productDao.getById(productId);
    };


    static getWithPaginate = async (query, options) => {
        return await productDao.getWithPaginate(query, options);
    };


    static createProduct = async (productInfo) => {
        return await productDao.save(productInfo);
    };


    static updateProduct = async (productInfo) => {
        return await productDao.update(productInfo);
    };


    static deleteProduct = async (productId) => {
        return await productDao.delete(productId);
    };

}