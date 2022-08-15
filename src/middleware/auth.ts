import jwt, {JwtPayload} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
const secret = process.env.TOKEN_SECRET || 'secret'
import {OrdersStore} from '../models/order'

export const verifyToken = async (authorizationHeader: string) => {
    try {
        const token: string = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
        let { user } = await jwt.verify(token, secret) as JwtPayload
        return user;
    } catch (err: any) {
        throw new Error(`Invalid token ${err}`)
        return new Error(`${err.toString()}`)
    }
}

export const VerifyUserOrderMine = async (req: Request, res: Response, next: NextFunction) => {
    const store = new OrdersStore();
    try {
        const authorizationHeader: string = req.headers.authorization || '';
        const user = await verifyToken(authorizationHeader);
        const order_user_id = (await store.show(req.params.id)).user_id;
        if (user.id == order_user_id) {
            next()
        } else {
            res.status(401).json({msg: 'user id dose not match'})
        }
    } catch (err: any) {
        res.status(401).json({msg: err.toString()})
    }
}

export const VerifyUserIsMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader: string = req.headers.authorization || '';
        const user_id = (await verifyToken(authorizationHeader)).id;
        if (user_id == req.params.id) {
            next()
        } else {
            res.status(401).json({msg: 'user id dose not match'})
        }
    } catch (error) {
        res.status(401).json('unauthorized')
    }
}

export const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization
        const token: string = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
        const decoded = jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(401).json('unauthorized')
    }
}

