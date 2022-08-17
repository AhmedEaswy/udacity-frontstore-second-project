import express, { Request, Response } from 'express';
import { Product, ProductsStore } from "../models/product";
import { verifyAuthToken } from '../middleware/auth'
const store = new ProductsStore();

const index = async (_req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
}

const show = async (_req: Request, res: Response) => {
    try {
        const id: string = _req.params.id;
        const product = await store.show(id)
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json({
            error: `${err}`
        })
    }
}

const create = async (_req: Request, res: Response) => {
    try {
        const product: Product = {
            name: _req.body.name,
            price: _req.body.price,
            created_at: new Date(),
        }
        const newProduct = await store.create(product)
        res.status(200).json({
            msg: `product created successfully`,
            id: newProduct.id
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            error: err
        })
    }
}

const update = async (_req: Request, res: Response) => {
    try {
        const product: Product = {
            id: _req.params.id,
            name: _req.body.name,
            price: _req.body.price,
        }
        await store.update(product)
        res.json({
            msg: `Product updated successfully`,
            id: product.id
        })
    } catch (err) {
        console.log(err)
    }
}

const destroy = async (_req: Request, res: Response) => {
    try {
        await store.delete(_req.params.id)
        res.json({
            msg: `Product ${_req.params.id} deleted`
        })
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const products_routes = (app: express.Application) => {
    // products routes resources
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', verifyAuthToken, create)
    app.put('/products/:id', verifyAuthToken, update)
    app.delete('/products/:id', verifyAuthToken, destroy)
}

export default products_routes;
