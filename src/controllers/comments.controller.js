import { insertComment, getCommentsPost } from "../repositories/comments.repositories.js";

export async function createComment(req, res){        
    const {idPost, comment} = req.body;
    const idUser = res.locals.user;
    
    try {
        const newId = await insertComment(idPost, idUser, comment);
        console.log(newId);
        return res.status(201).send(newId);

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