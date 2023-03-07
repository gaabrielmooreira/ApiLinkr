import db from '../configs/database.config.js';

export async function insertPost(data){
    return await db.query(`INSERT INTO posts (id_user, post_description, post_link) VALUES ($1, $2, $3);`, [res.locals.user, data.description, data.link]);
}

export function getLike(idUser, idPost){
    return db.query(`SELECT * FROM likes WHERE "idUser" = $1 AND "idPost" = $2;`,[idUser,idPost]);
}

export function insertLikeInPost(idUser, idPost){
    db.query(`INSERT INTO likes ("idUser", "idPost") VALUES ($1,$2);`,[idUser,idPost]);
}

export function deleteLikeInPost(idUser, idPost){
    db.query(`DELETE FROM likes WHERE "idUser" = $1 AND "idPost" = $2;`,[idUser,idPost]);
}