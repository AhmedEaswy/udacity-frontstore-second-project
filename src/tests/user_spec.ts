import supertest from 'supertest'
import { User, UsersStore } from '../models/user';
// import express from "express";

// const app: express.Application = express()
import app from '../index'
const store = new UsersStore()


describe('User Model', () => {
    it('should have an index method', async () => {
        const result = await store.index
        expect(result).toBeDefined()
    })

    it('index method should return a list of users', async () => {
        const result: () => Promise<User[]> = await store.index
        expect(result).toBeDefined()
    })
})

describe("User API Tests", () => {
    const request = supertest(app);

    let user = {
        id: undefined,
        email: "elesawy325@gmail.com",
        password: '123456789',
        name: "Ahmed Eleaswy"
    };
    let token = '';

    // Register A New User
    it("should create new user", async () => {
        const res = await request
            .post("/register")
            .send(user);
        expect(res.status).toBe(200);
        user.id = res.body.id;
        token = res.body.token
    });

    // Get List OF Users
    it("should get list of users", async () => {
        const res = await request
            .get("/users")
        expect(res.status).toBe(200);
    });

    // Login With Created User
    it("should login user", async () => {
        const res = await request
            .post("/login")
            .send(user);
        expect(res.status).toBe(200);
        user = res.body.result
        token = res.body.token
    });

    // Check Token After Login & and Auth With Token
    it("check Auth Function to check token", async () => {
        const res = await request
            .post("/auth")
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
    });

    // Get User By ID
    it("should get user info", async () => {
        const res = await request.get(`/users/${user.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(user.id);
    });

    // Update User INFO
    it("should update user info", async () => {
        user.name = "Test User";
        user.email = "elesawy325@gmail.com";
        const res = await request
            .put(`/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(user);
        expect(res.status).toBe(200);
    });

});
