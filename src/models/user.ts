import Client from '../database'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const secret = process.env.TOKEN_SECRET || 'secret'

export type User = {
    id?: string
    name: string
    email: number,
    password?: string,
}

export type Data = {
    user?: User,
    msg: string
}

export type UserLogin = {
    email: number,
    password?: string
}

const   pepper = process.env.BCRYPT_PASSWORD,
    saltRounds = process.env.SALT_ROUNDS || 10;

export class UsersStore {

    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT id, name, email, created_at, updated_at FROM users'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to users ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT id, name,  email, created_at, updated_at FROM users WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Can not show to users on id: ${id} ${err}`)
        }
    }

    async create(user: User): Promise<User> {
        try {
            const hash = bcrypt.hashSync(`${user.password}${pepper}`, Number(saltRounds));
            const sql = 'INSERT INTO users (name, email, password, created_at) VALUES($1, $2, $3, $4) RETURNING *'
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                user.name,
                user.email,
                hash,
                new Date(),
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not create to users on id: ${user} ${err}`
            )
        }
    }

    async update(user: User): Promise<User> {
        try {
            const sql =
                `UPDATE users SET name = $1, email = $2, updated_at = $3 WHERE id = ($4);`
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                user.name,
                user.email,
                new Date(),
                user.id,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not update to users on id: ${user} ${err}`
            )
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Can not delete to users on id: ${id} Because he is already has orders ${err}`)
        }
    }

    async authenticate(u: UserLogin): Promise<User | Error> {
        try {
            const   conn = await Client.connect(),
                    sql = 'SELECT * FROM users WHERE email=($1)',
                    result = await conn.query(sql, [u.email]);
            if (result.rows.length) {
                const user: User = result.rows[0]
                console.log(user)
                if (bcrypt.compareSync(`${u.password}${pepper}`, <string>user.password)) {
                    return user;
                } else {
                    const err: Error = new Error('Password is incorrect');
                    return err;
                }
            } else {
                const err: Error = new Error('User not found');
                return err;
            }
        } catch (err) {
            return new Error(`Can not authenticate to users ${err}`)
        }

    }

}
