import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: Date,
    amount: {
        type: Number,
        required: true
    },
    purchaser: String
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);