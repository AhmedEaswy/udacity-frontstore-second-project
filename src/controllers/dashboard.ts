import express, { Request, Response } from "express";

import {DashboardQueries} from "../services/dashboard";

const dashboard = new DashboardQueries();

const productsInOrders = async (_req: Request, res: Response) => {
    try {
        const products = await dashboard.productsInOrders();
        res.json({
            data: products
        })
    } catch (err){
        res.status(400).json({
            error: `${err}`
        })
    }
}

const UsersWithOrders = async (_req: Request, res: Response) => {
    try {
        const products = await dashboard.UsersWithOrders();
        res.json({
            data: products
        })
    } catch (err) {
        res.status(400).json({
            error: `${err}`
        })
    }

}
const ProductsForOrder = async (_req: Request, res: Response) => {
    try {
        const products = await dashboard.ProductsForOrder(_req.params.id);
        res.json({
            data: products
        })
    } catch (err) {
        res.status(400).json({
            error: `${err}`
        })
    }

}

const fiveMostExpensive = async (_req: Request, res: Response) => {
    try {
        const products = await dashboard.fiveMostExpensive();
        res.json({
            data: products
        })
    } catch (err) {
        res.status(400).json({
            error: `${err}`
        })
    }
}

const dashboard_routes = (app: express.Application) => {
    app.get('/products_in_orders', productsInOrders)
    app.get('/users_with_orders', UsersWithOrders)
    app.get('/products_for_order/:id', ProductsForOrder)
    app.get('/five-most-expensive', fiveMostExpensive)
}

export default dashboard_routes;
