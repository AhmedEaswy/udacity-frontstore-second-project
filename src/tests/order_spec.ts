import supertest from 'supertest'
import { Order, OrdersStore } from '../models/order';
// import express from "express";

// const app: express.Application = express()
import app from '../index'
const store = new OrdersStore()

// Testing Modal Order
describe('Order Model', () => {
    it('should have an index method', async () => {
        const result = await store.index
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

    // Login User Before Create Order
    it("should login user", async () => {
        const res = await request
            .post("/login")
            .send(user);
        expect(res.status).toBe(200);
        user = res.body.result
        token = res.body.token
        // console.log(token)
    });

    // Create Order After Login User
    it("should create new order", async () => {
        const res = await request
            .post("/orders")
            .set('Authorization', `Bearer ${token}`)
            .send(order);
        expect(res.status).toBe(200);
        order.id = res.body.id;
    });

    // Create Order After Login User
    it("should get list of orders", async () => {
        const res = await request
            .get("/orders")
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
    });    // Create Order After Login User

    it("should Show Single Order", async () => {
        const res = await request
            .get(`/orders/${order.id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
    });

});
