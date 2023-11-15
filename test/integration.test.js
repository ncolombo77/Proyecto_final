import { app } from "../src/app.js";
import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;

const requester = supertest(app);

var cookie;

describe("Pruebas app e-commerce", () => {

    describe("Pruebas del módulo de sesiones", function() {

        this.timeout(10000);

        it("El endpoint POST /api/sessions/login debe loguear un usuario correctamente", async() => {

            const testUser = {
                email: "nicolas@coder.com",
                password: "coder"
            };

            const responseUsr = await requester.post("/api/sessions/login").send(testUser);
            expect(responseUsr.status).to.be.equal(303);

            const cookieResponse = responseUsr.headers["set-cookie"][0];
            const cookieData ={
                name: cookieResponse.split("=")[0],
                value: cookieResponse.split("=")[1]
            };

            cookie = cookieData;

        });

        it ("La cookie debe tener los datos del usuario generado con el token", async ()=> {
            const response = await requester.get("/api/sessions/current").set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data).to.have.property("_id");
            expect(response.body.data).to.have.property("role");
        });

    });


    describe("Pruebas del módulo de productos", function() {

        this.timeout(10000);

        before(async function() {
            this.testProduct;
        });


        it("El endpoint POST /api/products debe crear un producto en la BD", async () => {

            const productMock = {
                title: "TestProduct",
                description: "Descripción del producto Test.",
                price: 100,
                code: "COD001",
                stock: 100,
                status: "activo",
                category: "Alfajores"
            };
            const response = await requester.post("/api/products").send(productMock).set("Cookie",[`${cookie.name}=${cookie.value}`]);

            expect(response.body.status).to.be.equal("success");
            expect(response.body.data).to.have.property("_id");
            expect(response.body.data.title).to.be.equal(productMock.title);
            expect(response.body.data.price).to.be.equal(productMock.price);
            expect(response.body.data.status).to.be.equal(productMock.status);
            expect(response.body.data.stock).to.be.equal(productMock.stock);
            expect(response.body.data.category).to.be.equal(productMock.category);
            this.testProduct = response.body.data;
        });

        it("El endpoint GET /api/products/:pid debe devolver un producto de la BD", async () => {
            const response = await requester.get(`/api/products/${this.testProduct._id}`).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data._id).to.be.equal(this.testProduct._id);
            expect(response.body.data.title).to.be.equal(this.testProduct.title);
            expect(response.body.data.price).to.be.equal(this.testProduct.price);
            expect(response.body.data.status).to.be.equal(this.testProduct.status);
            expect(response.body.data.stock).to.be.equal(this.testProduct.stock);
            expect(response.body.data.category).to.be.equal(this.testProduct.category);
        });

        it("El endpoint PUT /api/products debe actualizar un producto en la BD", async () => {

            this.testProduct.title = "TestProduct Updated";
            this.testProduct.stock = 200;
            const response = await requester.put(`/api/products/${this.testProduct._id}`).send(this.testProduct).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data.title).to.be.equal(this.testProduct.title);
            expect(response.body.data.stock).to.be.equal(this.testProduct.stock);
            expect(response.body.data.category).to.be.equal(this.testProduct.category);
        });

        it("El endpoint DELETE /api/products debe eliminar un producto en la BD", async () => {

            const response = await requester.delete(`/api/products/${this.testProduct._id}`).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data.acknowledged).to.be.equal(true);
            expect(response.body.data.deletedCount).to.be.equal(1);
        });

    });


    describe("Pruebas del módulo de carritos", function() {

        this.timeout(10000);

        before(async function() {
            this.testCart;
            this.testProduct;
            this.userCookie;
        });

        it("El endpoint POST /api/carts debe crear un carrito vacío en la BD", async () => {
            const response = await requester.post("/api/carts").set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data).to.have.property("_id");
            expect(response.body.data).to.have.property("products");
            expect(response.body.data.products).to.be.deep.equal([]);

            this.testCart = response.body.data;
        });


        it("El endpoint GET /api/carts debe devolver todos los carritos en la BD", async () => {
            const response = await requester.get("/api/carts").set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.body).to.have.property("status");
            expect(response.body).to.have.property("data");
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data).to.be.an('array');
        });


        it("El endpoint GET /api/carts/:cid debe devolver un carrito de la BD", async () => {
            const response = await requester.get(`/api/carts/${this.testCart._id}`).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.body).to.have.property("status");
            expect(response.body).to.have.property("data");
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data._id).to.be.equal(this.testCart._id);
        });


        it("El endpoint POST /api/carts/:cid/product/:pid debe agregar un producto al carrito (solo perfil usuario).", async () => {

            const testUser = {
                email: "user@gmail.com",
                password: "user"
            };
            const responseUsr = await requester.post("/api/sessions/login").send(testUser);
            const cookieResponse = responseUsr.headers["set-cookie"][0];
            const cookieData = {
                name: cookieResponse.split("=")[0],
                value: cookieResponse.split("=")[1]
            };
            this.userCookie = cookieData;

            const productMock = {
                title: "TestProduct",
                description: "Descripción del producto Test.",
                price: 100,
                code: "COD001",
                stock: 100,
                status: "activo",
                category: "Alfajores"
            };
            const responseProd = await requester.post("/api/products").send(productMock).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            this.testProduct = responseProd.body.data;

            const response = await requester.post(`/api/carts/${this.testCart._id}/product/${this.testProduct._id}`).set("Cookie",[`${this.userCookie.name}=${this.userCookie.value}`]);
            expect(response.body).to.have.property("status");
            expect(response.body).to.have.property("data");
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data.products).to.be.an('array');
            expect(response.body.data.products.length).to.be.equal(1);
            expect(response.body.data.products[0].productId).to.be.equal(this.testProduct._id);
            expect(response.body.data.products[0].quantity).to.be.equal(1);

        });


        it("El endpoint POST /api/carts/:cid/product/:pid no debe permitir agregar un producto al carrito (solo perfil premium o admin).", async () => {

            const response = await requester.post(`/api/carts/${this.testCart._id}/product/${this.testProduct._id}`).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.body).to.have.property("status");
            expect(response.body.status).to.be.equal("error");
            expect(response.statusCode).to.be.equal(401);

        });


        it("El endpoint DELETE /api/carts/:cid/product/:pid debe eliminar un producto del carrito.", async () => {

            const testUser = {
                email: "user@gmail.com",
                password: "user"
            };
            const responseUsr = await requester.post("/api/sessions/login").send(testUser);
            const cookieResponse = responseUsr.headers["set-cookie"][0];
            const cookieData = {
                name: cookieResponse.split("=")[0],
                value: cookieResponse.split("=")[1]
            };
            this.userCookie = cookieData;

            const response = await requester.delete(`/api/carts/${this.testCart._id}/product/${this.testProduct._id}`).set("Cookie",[`${this.userCookie.name}=${this.userCookie.value}`]);
            expect(response.body).to.have.property("status");
            expect(response.body.status).to.be.equal("success");

            const responseDeleted = await requester.get(`/api/carts/${this.testCart._id}`).set("Cookie",[`${this.userCookie.name}=${this.userCookie.value}`]);
            expect(responseDeleted.body).to.have.property("status");
            expect(responseDeleted.body).to.have.property("data");
            expect(responseDeleted.body.status).to.be.equal("success");
            expect(responseDeleted.body.data.products).to.be.deep.equal([]);

            const responseProd = await requester.delete(`/api/products/${this.testProduct._id}`).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(responseProd.body.status).to.be.equal("success");
            expect(responseProd.body.data.acknowledged).to.be.equal(true);
            expect(responseProd.body.data.deletedCount).to.be.equal(1);
        });


    });

});