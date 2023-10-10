import express from "express";
import { config } from "./config/config.js";

import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import path from 'path';
import { Server } from "socket.io";

import { viewsRouter } from "./routes/views.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { mockingRouter } from "./routes/mocking.routes.js";

import { chatModel } from "./dao/models/chat.model.js";

import session from "express-session";
import mongoStore from "connect-mongo";

import { initializePassport } from "./config/passportConfig.js";
import passport from "passport";

import { errorHandler } from "./middlewares/errorHandler.js";


const port = config.server.port;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const httpServer = app.listen(port, () => console.log(`Servidor iniciado en el puerto ${ port }.`));

const socketServer = new Server(httpServer);

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));


// Configuración de sesiones.
app.use(session({
    store: mongoStore.create({
        mongoUrl:config.mongo.url
    }),
    secret: config.server.secretSession,
    resave: true,
    saveUninitialized: true
}));

// Configuración de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use(viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/mockingproducts", mockingRouter);

app.use(errorHandler);


socketServer.on("connection", (socketConnected) => {

    console.log(`Nuevo cliente conectado (id: ${ socketConnected.id } ).`);

    socketConnected.on("newProduct", async (data) => {
        try {
            const productService = new ProductManager('products.json');

            const products = await productService.get();

            const productCreated = await productService.save(data);

            products.push(productCreated);

            socketServer.emit("productsUpdate", products);
        }
        catch (error) {
            console.log("Error: ", error.message);
        }

    })


    socketConnected.on("authenticated", async (msg) => {
        const messages = await chatModel.find();
        socketServer.emit("messageHistory", messages);
        socketConnected.broadcast.emit("newUser", msg);
    });

    socketConnected.on("message", async (data) => {
        console.log("Datos: ", data);
        const messageCreated = await chatModel.create(data);
        const messages = await chatModel.find();
        socketServer.emit("messageHistory", messages);
    });

});