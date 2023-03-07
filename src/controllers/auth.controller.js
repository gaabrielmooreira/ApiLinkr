import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid'; 
import { insertUser, selectEmail, startSession } from '../repositories/repositories.js';

export async function signUp (req, res){
    const {name, email, password, url} = req.body

    try {
       const emailExists = await selectEmail(email)
       if(emailExists.rowCount !== 0) return res.status(409).send("Email already exists.")

       const criptPassword = bcrypt.hashSync(password, 10)

       insertUser(name, email, criptPassword, url)

       res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function signIn (req, res){
    const { email, password} = req.body

    try {
        const findEmail = await selectEmail(email)
        if(findEmail.rowCount === 0 ) return res.status(401).send("Email or password incorrect.")

        const findedPassword = findEmail.rows[0].password 
        const id = findEmail.rows[0].id 

        if (bcrypt.compareSync(password, findedPassword)){

            const token = uuid()
            startSession(token, id)
            return res.status(200).send({token:token})

        } else{
            return res.status(401).send("Email or password incorrect.")
        }

        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

