import * as dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

let {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    ENV,
} = process.env

if (ENV === 'dev') {
    POSTGRES_DB = process.env.POSTGRES_DB
} else if (ENV === 'test') {
    POSTGRES_DB = process.env.POSTGRES_DB_TEST
}

const client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
})


export default client
