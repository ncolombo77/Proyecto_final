import mongoose from "mongoose";
import { cartsCollection } from "../../constants/index.js";

// Esquema de los productos.
const cartSchema = new mongoose.Schema({
    products: {
        type: [],
        default: []
    }
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);