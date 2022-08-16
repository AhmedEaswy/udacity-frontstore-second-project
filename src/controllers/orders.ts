import express, { Request, Response, NextFunction } from 'express';
import { OrdersStore, Order } from "../models/order";
import {verifyAuthToken, verifyToken, VerifyUserOrderMine} from "../middleware/auth";
import {DashboardQueries} from "../services/dashboard";

const store = new OrdersStore();
const dashboard = new DashboardQueries();

const index = async (_req: Request, res: Response) => {
    try {
        const orders = await store.index();
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
}

const show = async (_req: Request, res: Response) => {
    try {
        const id: string = _req.params.id;
        const order = await store.show(id)
        const products = await dashboard.ProductsForOrder(_req.params.id);
        res.status(200).json({
            order: {
                data: order,
                products: products
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: `${error}`
        })
    }
}

const create = async (_req: Request, res: Response) => {
    try {
        const   status: string = _req.body.status,
                token: string = _req.headers.authorization || '';

        const user = await verifyToken(token)
        const newOrder = await store.create(status, user.id)
        res.status(200).json({
            msg: `order created successfully on id: ${newOrder.id}`
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: `${error}`
        })
    }
}

// const update = async (_req: Request, res: Response) => {
//     try {
//         const order: Order = {
//             id: _req.params.id,
//             status: _req.body.status,
//             user_id: _req.body.user_id,
//         }
//         await store.update(order)
//         res.json({
//             msg: `Order updated successfully on id: ${order.id}`
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }
const updateStatus = async (_req: Request, res: Response) => {
    try {
        const   id: string = _req.params.id,
                status: string = _req.body.status;
        await store.updateStatus(id, status)
        res.json({
            msg: `Order updated successfully on id: ${id}`
        })
    } catch (err) {
        console.log(err)
    }
}

// const destroy = async (_req: Request, res: Response) => {
//     try {
//         await store.delete(_req.params.id)
//         res.json({
//             msg: `Order ${_req.params.id} deleted`
//         })
//     } catch (err) {
//         res.json({
//             error: `${err}`
//         })
//     }
// }

const addProduct = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const   order_id: string = _req.params.id,
                product_id: string = _req.body.product_id,
                quantity: string = _req.body.quantity,
                added = await store.addProduct(order_id, product_id, quantity);

        res.json({
            msg: `Product added to Order successfully on id: ${added.id}`
        })
    } catch (error) {
        res.json({
            error: `${error}`
        })
    }
}

const orders_routes = (app: express.Application) => {
    // orders routes resources
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.post('/orders', verifyAuthToken, create)
    // app.put('/orders/:id', VerifyUserOrderMine, update)
    app.put('/orders/:id/update_status', VerifyUserOrderMine, updateStatus)
    // app.delete('/orders/:id', VerifyUserOrderMine, destroy)

    app.post('/orders/:id/products', VerifyUserOrderMine, addProduct)
}

export default orders_routes;
