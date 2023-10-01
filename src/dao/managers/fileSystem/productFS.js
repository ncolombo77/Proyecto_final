import { productsModel } from "../../models/products.model.js"

export class ProductsMongo {

    constructor() {
        this.model = productsModel;
    };


    // Obtener todos los productos
    async get() {
        try {
            const products = await this.model.find();
            return products;
        }
        catch(error) {
            console.log(`Se produjo un error al leer todos los productos (método getAll()): ${ error.message }`);
            throw new error(`Se produjo un error al leer todos los productos.`);
        }
    };


    // Obtener un procto por id.
    async getById(id) {
        try {
            const product = await this.model.findById(id);
            return product;
        }
        catch(error) {
            console.log(`Se produjo un error al leer el producto ${ id } (método getById()): ${ error.message }`);
            throw new error(`Se produjo un error al leer el producto.`);
        }
    };


    // Grabar un producto
    async save(productInfo) {
        try {
            const productCreated = await this.model.create(productInfo);
            return productCreated;
        }
        catch(error) {
            console.log(`Se produjo un error al grabar un producto (método save()): ${ error.message }`);
            throw new error(`Se produjo un error al crear el producto.`);
        }
    }
}