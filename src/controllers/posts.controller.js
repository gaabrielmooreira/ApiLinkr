import { deleteLikeInPost, getLike, insertLikeInPost } from "../repositories/posts.repository.js";

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