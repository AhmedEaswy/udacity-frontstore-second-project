import Client from '../database'
import {Product} from "../models/product";

export class DashboardQueries {
    // Get all products that have been included in orders
    async productsInOrders(): Promise<{ name: string, price: number, order_id: string }[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id'

            const result = await conn.query(sql);
            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to orders ${err}`)
        }
    }

    async UsersWithOrders(): Promise<{ first_name: string, last_name: string, email: string }[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id'

            const result = await conn.query(sql);
            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to orders ${err}`)
        }
    }
    async ProductsForOrder(id: string): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            // const sql = 'SELECT id, quantity, product_id FROM order_products WHERE order_id=($1)'
            const sql = 'select product_id, quantity, price, name from order_products INNER JOIN products ON order_products.product_id=products.id where order_id=($1)'

            const result = await conn.query(sql, [id]);
            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to orders ${err}`)
        }
    }

    async fiveMostExpensive(): Promise<{ name: string, price: number }[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5'

            const result = await conn.query(sql);
            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to orders ${err}`)
        }
    }
}
