import { __dirname } from "../../../utils.js";
import path from "path";
import fs from "fs";

class CartManager {
    constructor(nombreArchivo) {
        this.path = path.join(__dirname, `/files/${ nombreArchivo }`);
    };


    fileExists() {
        return fs.existsSync(this.path);
    }


    async getById(id) {
        try {
            if (this.fileExists) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(content);

                let cart = carts.find((c) => { return c.id === parseInt(id) });

                if (cart != undefined) {
                    return cart;
                }
                else {
                    throw new Error(`No existe el carrito ${ id }.`);
                }
            }
            else {
                throw new Error(`Error al obtener el carrito ${ id }, no existe el archivo.`);
            }
        }
        catch (error) {
            throw error;
        }
    }


    async save() {
        try {
            if (this.fileExists) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(content);
                let newId  = 1;
                if (carts.length > 0) {
                    newId = parseInt(carts[carts.length - 1].id) + 1;
                }
                const newCart = {
                    id: newId,
                    products: []
                };
                carts.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return newCart;
            }
            else {
                throw new Error("Error al grabar el carrito, no se encontró el archivo.");
            }
        }
        catch (error) {
            throw error;
        }
    }


    async update(id, updatedCart) {
        try {
            if (this.fileExists) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(content);

                const cart = carts.find(c => c.id === parseInt(id));

                cart.products = updatedCart.products;

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

                return cart;
            }
            else {
                throw new Error("Error al actualizar el carrito, no se encontró el archivo.");
            }
        }
        catch (error) {
            throw error;
        }
    }

}

export { CartManager };