import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const { Pool } = pg;

const configDatabase = {
    connectionString: process.env.DATABASE_URL,
    ...(process.env.NODE_ENV === "production" && {
        ssl: {
            rejectUnauthorized: false,
        }
    })
};

const db = new Pool(configDatabase);

export default db;