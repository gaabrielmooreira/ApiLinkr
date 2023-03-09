import db from "../configs/database.config.js";

export async function selectEmail (email){
    return db.query(`SELECT * FROM users WHERE email = $1;`, [email])
}

export async function insertUser (name, email, password, url){
    db.query(`INSERT INTO users (name, email, password, url) VALUES ($1, $2, $3, $4);`, [name, email, password, url])
    return "ok"
}


export async function searchUserInDB(string) {
    return await db.query(`
    SELECT users.id,users.name, users.url AS photo_user from users
    WHERE LOWER(name) LIKE '%' || LOWER($1) || '%';
    `,[string])
}