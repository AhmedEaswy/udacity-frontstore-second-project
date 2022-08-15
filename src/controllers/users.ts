import express, { Request, Response, NextFunction } from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
import {UsersStore, User, UserLogin} from "../models/user";
import { VerifyUserIsMe, verifyAuthToken } from "../middleware/auth";
const store = new UsersStore();

const secret = process.env.TOKEN_SECRET || 'secret'

const index = async (_req: express.Request, res: express.Response) => {
    const users  = await store.index();
    try {
        res.json({
            data: users
        })
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const show = async (req: express.Request, res: express.Response) => {
    const user: User  = await store.show(req.params.id);
    try {
        res.json(user)
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: req.body.password,
        }
        const newUser = await store.create(user)
        const token = jwt.sign({ user: {'email': newUser.email, 'password': newUser.password} }, secret,{ expiresIn: '1h' })
        res.json({
            msg: 'User created Successfully',
            token: token
        })
    } catch(error) {
        console.log(error)
        res.send(error)
    }
}

const update = async (req: Request, res: Response) => {
    const userData: User = {
        id: req.params.id,
        name: req.body.name,
        email: req.body.email.toLowerCase(),
    }
    try {
        await store.update(userData)
        res.json(userData)
    } catch (error: any) {
        res.status(400).json({
            error: error.toString(),
        })
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const deleteId: string = req.params.id;
        await store.delete(deleteId)
        res.json({ msg: 'User deleted Successfully' })
    } catch (error: any) {
        res.status(400).json({
            error: error.toString(),
        })
    }
}

const auth = async (req: Request, res: Response) => {
    try {
        const userData: UserLogin = {
            email: req.body.email.toLowerCase(),
            password: req.body.password
        }
        const result = (await store.authenticate(userData))
        if ('email' in await result) {
            const token = jwt.sign({ user: result }, secret, { expiresIn: '1h' })
            res.json({
                result,
                token: token
            })
        } else {
            res.json({
                msg: result.toString(),
            })
        }
    } catch (err) {
        console.log(err)
        res.json(err)
    }
}

const authToken = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization
        const token: string = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
        let { user } = jwt.verify(token, secret) as JwtPayload
        delete user.password;
        res.json({
            data: user
        })
    } catch (err) {
        res.status(401).json('unauthorized')
    }
}

// middleware to verify auth token


const users_routes = (app: express.Application) => {
    // users routes resources
    app.get('/users', index)
    app.get('/users/:id', show)
    app.post('/register', create)
    app.put('/users/:id', VerifyUserIsMe, update)
    app.delete('/users/:id', VerifyUserIsMe, destroy)
    // users auth routes
    app.post('/login', auth)
    app.post('/auth', authToken)
}



export default users_routes;
