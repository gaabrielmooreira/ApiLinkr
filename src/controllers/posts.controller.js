import { deleteLikeInPost, getLike, insertLikeInPost, insertPost } from "../repositories/posts.repository.js";

export async function createPost(req, res){

    const data = req.body;    
    try { 
        insertPost(data);       
        return res.status(201).send("post created");

    } catch (error) {
        return res.status(500).send(error.message);
    }

}

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