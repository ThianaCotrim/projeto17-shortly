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

        const id = await db.query(`SELECT * FROM clientes WHERE email=$1`, [email])
        const idUsuario = id.rows[0].id

        const token = uuid()

        const login = await db.query(`INSERT INTO login (email, password, token, "idUsuario") VALUES ($1, $2, $3, $4)`, [email, password, token, idUsuario])
        res.status(201).send(login)
        console.log(login)
    } catch (err){
        res.status(500).send(err.message)
    }
}