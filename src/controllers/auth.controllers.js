import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"


export async function singUp (req, res) {

    const {name, email, password, confirmPassword} = req.body

    try {
        const hash = bcrypt.hashSync(password, 10)

        await db.query(`INSERT INTO clientes (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4);`,
        [name, email, hash, confirmPassword])

        res.status(201).send("Cliente cadastrado com sucesso no banco de dados")
        console.log(hash)
    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function signIn (req, res) {

    const {email, password} = req.body

    try {
        const token = uuid()
        await db.query(`INSERT INTO tokens (token) VALUES ($1)`, [token])

        await db.query(`INSERT INTO login (email, password) VALUES ($1, $2)`, [email, password])
        res.status(201).send("Login realizado com sucesso")
    } catch (err){
        res.status(500).send(err.message)
    }
}