import mongoose from "mongoose";

// Nombre de la colección de productos.
const chatCollection = "chatMessages";

// Esquema de los productos.
const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

export const chatModel = mongoose.model(chatCollection, messageSchema);