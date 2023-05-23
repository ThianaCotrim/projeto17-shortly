import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import dayjs from "dayjs";
import {v4 as uuid} from "uuid"


export async function singUp (req, res) {

    const {name, email, password, confirmPassword} = req.body

    if(password !== confirmPassword) return res.status(422).send("As senhas não conferem");
    const emailExistente = await db.query(`SELECT * FROM clientes WHERE email=$1;`, [email])
    if (emailExistente.rows.length > 0) return res.status(409).send("Email já cadastrado")

    try {
        const hash = bcrypt.hashSync(password, 10)
        const createdAt = dayjs()

        await db.query(`INSERT INTO clientes (name, email, password, "confirmPassword", "createdAt" ) VALUES ($1, $2, $3, $4, $5);`,
        [name, email, hash, confirmPassword, createdAt])

        res.status(201).send("Cliente cadastrado com sucesso no banco de dados")
        console.log(hash)
    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function signIn (req, res) {

    const {email, password} = req.body

    const emailExistente = await db.query(`SELECT * FROM clientes WHERE email=$1;`, [email])
   
    if (emailExistente.rows.length === 0) return res.status(401).send("Email ainda não cadastrado")

    const senhaVerificada = bcrypt.compareSync(password, emailExistente.rows[0].password)
    if (!senhaVerificada) return res.status(401).send("Senha não corresponde a este e-mail")

    try {
        const id = await db.query(`SELECT * FROM clientes WHERE email=$1`, [email])
        const idUsuario = id.rows[0].id

        const createdAt = dayjs()
        const token = uuid()
        await db.query(`INSERT INTO login (email, password, token, "idUsuario", "createdAt") VALUES ($1, $2, $3, $4, $5)`, [email, password, token, idUsuario, createdAt])
        res.status(200).send({token: token})
        
    } catch (err){
        res.status(500).send(err.message)
    }
    
}