import { insertComment, getCommentsPost } from "../repositories/comments.repositories.js";

export async function createComment(req, res){        
    const {idPost, comment} = req.body;
    const idUser = res.locals.user;
    
    try {
        const {rows:new_id} = await insertComment(idPost, idUser, comment);
        return res.status(201).send(new_id[0]);

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

 export async function getComments(req, res){

    const {post} = req.params;
    
    try {
        const allComments = await getCommentsPost(post);
        return res.status(200).send(allComments);
        
    } catch (error) {
        return res.status(500).send(error.message);
    }

 }