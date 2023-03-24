import db from "../configs/database.config.js";


export async function startSession (token, id){
    await db.query(`INSERT INTO sessions (token, user_id) VALUES ($1, $2);`, [token, id])
    return "ok"
}

export async function getSession(token){
    return await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
}

export async function deleteSession(id){
    await db.query(`DELETE FROM sessions WHERE user_id = $1;`, [id])
    return "ok"
}