import db from '../configs/database.config.js';

export function getLike(idUser, idPost){
    return db.query(`SELECT * FROM likes WHERE "idUser" = $1 AND "idPost" = $2;`,[idUser,idPost]);
}

export function insertLikeInPost(idUser, idPost){
    db.query(`INSERT INTO likes ("idUser", "idPost") VALUES ($1,$2);`,[idUser,idPost]);
}

export function deleteLikeInPost(idUser, idPost){
    db.query(`DELETE FROM likes WHERE "idUser" = $1 AND "idPost" = $2;`,[idUser,idPost]);
}