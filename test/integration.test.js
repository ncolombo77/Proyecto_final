import { app } from "../src/app.js";
import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;

const requester = supertest(app);

describe("Pruebas app e-commerce", () => {
    describe("Pruebas del módulo de productos", function() {

        this.timeout(10000);

        before(async function() {
            this.cookie;
            this.testProduct;
        });


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

            this.cookie = cookieData;

        });

        it ("La cookie debe tener los datos del usuario generado con el token", async ()=> {
            const response = await requester.get("/api/sessions/current").set("Cookie",[`${this.cookie.name}=${this.cookie.value}`]);
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data).to.have.property("_id");
            expect(response.body.data).to.have.property("role");
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
            const response = await requester.post("/api/products").send(productMock).set("Cookie",[`${this.cookie.name}=${this.cookie.value}`]);
            
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data).to.have.property("_id");
            expect(response.body.data.title).to.be.equal(productMock.title);
            expect(response.body.data.price).to.be.equal(productMock.price);
            expect(response.body.data.status).to.be.equal(productMock.status);
            expect(response.body.data.stock).to.be.equal(productMock.stock);
            expect(response.body.data.category).to.be.equal(productMock.category);
            this.testProduct = response.body.data;
        });

        it("El endpoint PUT /api/products debe actualizar un producto en la BD", async () => {

            this.testProduct.title = "TestProduct Updated";
            this.testProduct.stock = 200;
            const response = await requester.put(`/api/products/${this.testProduct._id}`).send(this.testProduct).set("Cookie",[`${this.cookie.name}=${this.cookie.value}`]);
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data.title).to.be.equal(this.testProduct.title);
            expect(response.body.data.stock).to.be.equal(this.testProduct.stock);
            expect(response.body.data.category).to.be.equal(this.testProduct.category);
        });

        it("El endpoint DELETE /api/products debe eliminar un producto en la BD", async () => {

            const response = await requester.delete(`/api/products/${this.testProduct._id}`).set("Cookie",[`${this.cookie.name}=${this.cookie.value}`]);
            console.log(response);
            expect(response.body.status).to.be.equal("success");
            expect(response.body.data._id).to.be.equal(this.testProduct._id);
            expect(response.body.data.title).to.be.equal(this.testProduct.title);
            expect(response.body.data.stock).to.be.equal(this.testProduct.stock);
            expect(response.body.data.category).to.be.equal(this.testProduct.category);
        });

    })
});