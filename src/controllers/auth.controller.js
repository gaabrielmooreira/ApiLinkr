import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid'; 
import { deleteSession, startSession } from '../repositories/auth.repositories.js';
import {  selectEmail } from '../repositories/users.repository.js';


export async function signIn (req, res){
    const { email, password} = req.body

    try {
        const findEmail = await selectEmail(email)
        if(findEmail.rowCount === 0 ) return res.status(401).send("Email or password incorrect.")

        const findedPassword = findEmail.rows[0].password 
        const id = findEmail.rows[0].id 
        const url = findEmail.rows[0].url
        const name = findEmail.rows[0].name

        if (bcrypt.compareSync(password, findedPassword)){

            const token = uuid()
            startSession(token, id)
            
            return res.status(200).send({token:token, url: url, name:name})

        } else{
            return res.status(401).send("Email or password incorrect.")
        }

        
    } catch (error) {
        res.status(500).send(error.message)
    }
}


export async function signOut(req, res){
    const id = res.locals.user

    try {
        deleteSession(id)
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error.message)
    }

}
