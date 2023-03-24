import db from "../configs/database.config.js";

export async function selectEmail (email){
    return await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
}

export async function insertUser (name, email, password, url){
    await db.query(`INSERT INTO users (name, email, password, url) VALUES ($1, $2, $3, $4);`, [name, email, password, url])
    return "ok"
}


export async function searchUserByStringInDB(string,idUser) {
    const { rows: listUsers } = await db.query(`
    SELECT
        USERS.ID,
	    USERS.NAME,
	    USERS.URL AS PHOTO_USER,
	    COALESCE(bool_or(follows.follower_user_id = $2),false) as IS_FOLLOWING
    FROM USERS
    LEFT JOIN follows
        ON follows.followed_user_id = USERS.ID
    WHERE LOWER(NAME) LIKE '%' || LOWER($1) || '%'
    GROUP BY USERS.ID
    ORDER BY IS_FOLLOWING DESC
    `,[string,idUser])
    return listUsers
}

export async function searchUserByIdInDB(idUser,idUserSearched) {
    const { rows: [user] } = await db.query(`
    SELECT
        USERS.ID,
	    USERS.NAME,
	    USERS.URL AS PHOTO_USER,
	    COALESCE(bool_or(follows.follower_user_id = $1),false) as IS_FOLLOWING
    FROM USERS
    LEFT JOIN follows
        ON follows.followed_user_id = USERS.ID
    WHERE USERS.ID = $2
    GROUP BY USERS.ID
    ORDER BY IS_FOLLOWING DESC
    `,[idUser,idUserSearched])
    return user
}