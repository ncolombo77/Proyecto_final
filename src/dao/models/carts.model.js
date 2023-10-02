import mongoose from "mongoose";
import { cartsCollection, productsCollection } from "../../constants/index.js";

// Esquema de los productos.
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                quantity: {
                    type: Number,
                    default: 1
                },
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: productsCollection
                }
            }
        ],
        default: []
    }
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);