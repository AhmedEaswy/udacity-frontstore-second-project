import Client from '../database'

export type Order = {
    id?: string
    user_id: string
    status: string,
    created_at?: Date,
    updated_at?: Date,
}

export class OrdersStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to orders ${err}`)
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Can not show to orders on id: ${id} ${err}`)
        }
    }

    async create(status: string, user_id: string): Promise<Order> {
        try {
            const sql =
                'INSERT INTO orders (user_id, status, created_at) VALUES($1, $2, $3) RETURNING *'
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                user_id,
                status,
                new Date(),
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not update order status ${err}`
            )
        }
    }

    async update(order: Order): Promise<Order> {
        try {
            const sql =
                `UPDATE orders SET user_id = $1, status = $2, updated_at = $3 WHERE id = ($4);`
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                order.user_id,
                order.status,
                new Date(),
                order.id,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not update to orders on id: ${order} ${err}`
            )
        }
    }
    async updateStatus(id: string, status: string): Promise<Order> {
        try {
            const sql =
                `UPDATE orders SET status = $1, updated_at = $3 WHERE id = ($2);`
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                status,
                id,
                new Date()
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not update to orders on id: ${id} ${err}`
            )
        }
    }

    async delete(id: string): Promise<Order> {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Can not delete to orders on id: ${id} ${err}`)
        }
    }

    async addProduct(order_id: string, product_id: string, quantity: string): Promise<Order> {
        // get order to see if it is open
        try {
            const ordersql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await Client.connect()

            const result = await conn.query(ordersql, [order_id])

            const order = result.rows[0]

            if (order.status !== "open") {
                throw new Error(`Could not add product ${product_id} to order ${order_id} because order status is ${order.status}`)
            }

            conn.release()
        } catch (err) {
            throw new Error(`${err}`)
        }

        try {
            const sql =
                'INSERT INTO order_products (product_id, quantity, order_id) VALUES($1, $2, $3) RETURNING *'
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                product_id,
                quantity,
                order_id,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not add product to order on id: ${product_id} ${err}`
            )
        }
    }

}
