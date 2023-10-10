import { faker, Faker, es, en } from "@faker-js/faker";

export class MockingController {


    static generateProduct = () => {
        const { database, commerce, image, string } = faker;

        return {
            id: database.mongodbObjectId(),
            title: commerce.productName(),
            description: commerce.productDescription(),
            price: parseFloat(commerce.price()),
            code: string.alphanumeric(10),
            stock: parseInt(string.numeric(2)),
            status: string.alphanumeric(1),
            images: image.url()
        }
    };


    static getMockingProducts = async (req, res) => {

        let products = [];

        for (let i = 0; i < 100; i++) {
            products.push(this.generateProduct());
        }

        res.json({ status: "success", data: products });

    };

}