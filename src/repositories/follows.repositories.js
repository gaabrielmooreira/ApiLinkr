import db from "../configs/database.config.js";


export async function addFollowDB(follower_user_id,followed_user_id){

    const {rowCount: rowsInserted} = await db.query(`INSERT INTO follows (follower_user_id, followed_user_id) VALUES ($1,$2);;`, [follower_user_id,followed_user_id])
    return rowsInserted>0
}

export async function deleteFollowDB(follower_user_id,followed_user_id){
    const {rowCount: rowsDeleted} = await db.query(`DELETE FROM follows WHERE follower_user_id = $1 AND followed_user_id= $2;`, [follower_user_id,followed_user_id])
    return rowsDeleted>0
}

export async function checkIfFollowedDB(follower_user_id,followed_user_id){
    const {rows: [{check: isFollowed}]} = await db.query(`SELECT COUNT(id)>0 as check FROM follows WHERE follower_user_id = $1 AND followed_user_id= $2 ;`, [follower_user_id,followed_user_id])
    return isFollowed
}