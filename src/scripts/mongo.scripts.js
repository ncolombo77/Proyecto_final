import mongoose from "mongoose";
import { productsModel } from "../dao/models/products.model.js";
import { config } from "../config/config.js";

const updateProducts = async () => {
    try {
        await mongoose.connect(config.mongo.url);
        console.log("Base de datos conectada.");
        const adminId = "653e960122f1f6013933e8da";
        const result = await productsModel.updateMany({}, {$set:{owner: adminId}});
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    finally {
        await mongoose.connection.close();
    }
}

updateProducts();