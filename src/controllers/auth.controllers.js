import { db } from "../database/database.connection.js"

export async function singUp (req, res) {

    const {name, email, password, confirmPassword} = req.body

    try {
        await db.query(`INSERT INTO clientes (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4);`,
        [name, email, password, confirmPassword])
      
        res.status(201).send("Cliente cadastrado com sucesso no banco de dados")
    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function signIn (req, res) {

    const {email, password} = req.body

    try {
        await db.query(`INSERT INTO login (email, password) VALUES ($1, $2)`, [email, password])
        res.status(201).send("Login realizado com sucesso")
    } catch (err){
        res.status(500).send(err.message)
    }
}