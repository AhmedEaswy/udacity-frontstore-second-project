import supertest from 'supertest'
import { Order, OrdersStore } from '../models/order';
// import express from "express";

// const app: express.Application = express()
import app from '../index'
const store = new OrdersStore()


describe('Order Model', () => {
    it('should have an index method', async () => {
        const result = await store.index
        expect(result).toBeDefined()
    })

    it('index method should return a list of orders', async () => {
        const result: () => Promise<Order[]> = await store.index
        expect(result).toBeDefined()
    })
})

describe("Order API Tests", () => {
    const request = supertest(app);

    const order = {
        id: undefined,
        user_id: '',
        quantity: '',
        status: ''
    };
    let user = {
        id: undefined,
        email: 'elesawy325@gmail.com',
        password: '123456789',
    };
    let token = '';

    it("should login user", async () => {
        const res = await request
            .post("/login")
            .send(user);
        expect(res.status).toBe(200);
        user = res.body.result
        token = res.body.token
        console.log(token)
    });

    it("should create new order", async () => {
        const res = await request
            .post("/orders")
            .set('Authorization', `Bearer ${token}`)
            .send(order);
        expect(res.status).toBe(200);
        order.id = res.body.id;
        console.log(res.body)
    });

    it("should get list of orders", async () => {
        const res = await request
            .get("/orders")
        expect(res.status).toBe(200);
    });

});
