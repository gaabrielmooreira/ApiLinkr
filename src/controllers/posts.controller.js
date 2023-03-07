import { deleteLikeInPost, getLike, getRepositoryPostsByHashtag, insertLikeInPost } from "../repositories/posts.repository.js";

export async function likePost(req,res){
    const idPost = req.params.idPost;  
    const idUser = res.locals.idUser;
    try {
        const like = getLike(idUser,idPost);
        if(like.rows[0]){
            deleteLikeInPost(idUser,idPost);
            return res.status(200).send("like deleted successfully");
        } else {
            insertLikeInPost(idUser,idPost);
            return res.sendStatus(201).send("like created succesfully");
        }
    } catch(err) {
        return res.status(500).send(err);
    }
}


export async function getPostsByHashtag(req,res) {
    const {hashtag} = req.params
    try {
        const {rowCount, rows: data} = await getRepositoryPostsByHashtag(hashtag)
        if (!rowCount) return res.sendStatus(404)
        else return res.send(data)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}