import { getSession } from "../repositories/auth.repositories.js";


export async function authValidate(req, res, next){
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");
    if(!token){
        return res.status(401).send("authentication error");
    }
    try {
        const sessionExists = await getSession(token);
        if(!sessionExists.rowCount){
            return res.status(401).send("authentication error");
        }
        res.locals.user =  sessionExists.rows[0].user_id
        
        next();
        
    } catch (error) {
        res.status(500).send(error.message);
    }

}