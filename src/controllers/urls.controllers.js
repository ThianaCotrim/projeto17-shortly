
import { db } from "../database/database.connection.js"
import { nanoid } from "nanoid"

export async function insertShortUrl (req, res,) {

    const {url} = req.body
    const { authorization } = req.headers
    
    const token = authorization?.replace("Bearer ", "")


    try {

        // if (!url) {
        //     return res.status(422).send("A URL é obrigatória no corpo da requisição.");
        //   }

        const id = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
        const idUsuario = id.rows[0].idUsuario

        const shortlyUrl = nanoid()
        await db.query(`INSERT INTO encurtar ("urlOriginal", "urlEncurtada", "criadorDaUrl") 
        VALUES ($1, $2, $3)`, [url, shortlyUrl, idUsuario])

        res.status(201).send(idUsuario, shortlyUrl)

    } catch (err){
        res.status(500).send(err.message)
    }
}