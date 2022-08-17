import supertest from 'supertest'
import { User, UsersStore } from '../models/user';
import app from '../index'
import {Product} from "../models/product";

const store = new UsersStore()

describe('User Model', async () => {
    const newUser: User = {
        name: 'Test Model Ahmed',
        email: 'test45600test.com',
        password: '123456789',
    }
    it('should Create User', async () => {
        const create_user = await store.create(newUser);
        newUser.id = await create_user.id;
        expect(create_user).toBeDefined()
    })
    it('should Have Index Method', async () => {
        const users = await store.index()
        expect(users.length).toBeGreaterThan(0)
    })
    it('should Have Show Method', async () => {
        const user = await store.show(<string>newUser.id)
        expect(user).toBeDefined()
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

    // Register A New User If It Does Not Exist
    it("should create new user", async () => {
        const res = await request
            .post("/register")
            .send(user);
        expect(res.status).toBeTruthy()
        if (res.status === 200) {
            user.id = res.body.id
            token = res.body.token
        }
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

    // Get List OF Users
    it("should get list of users", async () => {
        const res = await request
            .get("/users")
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
    });

    // Get User By ID
    it("should get user info", async () => {
        const res = await request
            .get(`/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
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
