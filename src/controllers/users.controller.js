import bcrypt from 'bcrypt';
import { insertUser, searchUserInDB, selectEmail } from '../repositories/users.repository.js';

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

export async function searchUser(req, res) {
    const { string } = req.params
    try {
        const { rows: listUsers } = await searchUserInDB(string)
        return res.send(listUsers)
    } catch (error) {
        res.status(500).send(error.message)
    }
}