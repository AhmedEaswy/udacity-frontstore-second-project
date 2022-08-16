import supertest from 'supertest'
import { Product, ProductsStore } from '../models/product';
// import express from "express";

// const app: express.Application = express()
import app from '../index'
const store = new ProductsStore()

// Testing Product Modal
describe('Product Model', async () => {
    it('should Create Product', async () => {
        const newProduct: Product = {
            name: 'product',
            price: 100,
        }
        const create_product = await store.create(newProduct);
        console.log(await create_product)
        expect(create_product).toBeDefined()
    })
    it('should Have Index Method', async () => {
        const products = await store.index()
        expect(products.length).toBeGreaterThan(0)
    })
})



describe("Product API Tests", () => {
    const request = supertest(app);
    const product = { id: undefined, name: "test", price: 20 };


    let user = {
        id: undefined,
        email: 'elesawy325@gmail.com',
        password: '123456789',
    };
    let token = '';

    // Login User Before Create Order
    it("should login user before creating product", async () => {
        const res = await request
            .post("/login")
            .send(user);
        expect(res.status).toBe(200);
        user = res.body.result
        token = res.body.token
        // console.log(token)
    });

    // Create New Product
    it("should create new product", async () => {
        const res = await request
            .post("/products")
            .set('Authorization', `Bearer ${token}`)
            .send(product);
        expect(res.status).toBe(200);
        product.id = res.body.id;
    });

    // Get List Of Products
    it("should get list of products", async () => {
        const res = await request
            .get("/products")
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
    });

    // Get Product Info
    it("should get product info", async () => {
        const res = await request.get(`/products/${product.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(product.id);
    });

    // Update Created Product
    it("should update product info", async () => {
        product.name = "new name";
        product.price = 100;
        const res = await request
            .put(`/products/${product.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(product);
        expect(res.status).toBe(200);
    });

    // Delete Created Product
    it("should delete product", async () => {
        const res = await request
            .delete(`/products/${product.id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
    });

});
