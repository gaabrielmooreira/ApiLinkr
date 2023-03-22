import bcrypt from 'bcrypt';
import { insertUser, searchUserByIdInDB, searchUserByStringInDB, selectEmail } from '../repositories/users.repository.js';

export async function signUp(req, res) {
    const { name, email, password, url } = req.body

    try {
        const emailExists = await selectEmail(email)
        if (emailExists.rowCount !== 0) return res.status(409).send("Email already exists.")

        const criptPassword = bcrypt.hashSync(password, 10)

        insertUser(name, email, criptPassword, url)

        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function searchUserByString(req, res) {
    const { string } = req.params
    const idUser = res.locals.user;

    try {
        const listUsers = await searchUserByStringInDB(string,idUser)
        return res.send(listUsers)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function searchUserByID(req, res) {
    const { idUserSearched } = req.params
    const idUser = res.locals.user;

    try {
        const user = await searchUserByIdInDB(idUser,idUserSearched)
        return res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
}