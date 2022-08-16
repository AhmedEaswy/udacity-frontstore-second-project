import supertest from 'supertest'
import { Product, ProductsStore } from '../models/product';
// import express from "express";

// const app: express.Application = express()
import app from '../index'
const store = new ProductsStore()


// Testing Product Modal
describe('Product Model', () => {
    it('should have an index method', async () => {
        const result = await store.index
        expect(result).toBeDefined()
    })

    it('index method should return a list of products', async () => {
      const result: () => Promise<Product[]> = await store.index
      expect(result).toBeDefined()
    })
})

describe("Product API Tests", () => {
    const request = supertest(app);
    const product = { id: undefined, name: "test", price: 20 };

    // Create New Product
    it("should create new product", async () => {
        const res = await request
            .post("/products")
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
            .send(product);
        expect(res.status).toBe(200);
    });

    // Delete Created Product
    it("should delete product", async () => {
        const res = await request
            .delete(`/products/${product.id}`);
        expect(res.status).toBe(200);
    });

});
