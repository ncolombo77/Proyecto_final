import { ProductManagerMongo } from "./managers/mongo/productManagerMongo.js";
import { CartManagerMongo } from "./managers/mongo/cartManagerMongo.js";
import { UsersManagerMongo } from "./managers/mongo/usersManagerMongo.js";
import { TicketManagerMongo } from "./managers/mongo/ticketManagerMongo.js";
import { connectDB } from "../config/dbConnection.js";


// Conexión a la base de datos mongoDB
connectDB();

export const productDao = new ProductManagerMongo();
export const cartDao = new CartManagerMongo();
export const userDao = new UsersManagerMongo();
export const ticketDao = new TicketManagerMongo();