import dotenv from "dotenv";
import { __dirname } from "../utils.js";
import path from "path";

const mode = "development";


dotenv.config({
    path: mode == "development" ? path.join(__dirname, "./config/.env.development") : path.join(__dirname, "./config/.env.production")
});


export const config = {
    server: {
        port: process.env.PORT,
        secretSession: process.env.SECRET_SESSION
    },
    mongo: {
        url: process.env.MONGO_URL
    },
    github: {
        clientId: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET,
        callbackUrl: process.env.GITHUB_CALLBACKURL
    }
}