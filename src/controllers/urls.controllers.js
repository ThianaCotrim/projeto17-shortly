
import { db } from "../database/database.connection.js"
import { nanoid } from "nanoid"

export async function insertShortUrl (req, res,) {

    const {url} = req.body
    const { authorization } = req.headers
    
    const token = authorization?.replace("Bearer ", "")

    try {

        const id = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
        const idUser = id.rows[0].idUsuario
        
        const shortlyUrl = nanoid()
        await db.query(`INSERT INTO encurtar ("urlOriginal", "urlEncurtada", "criadorDaUrl") 
        VALUES ($1, $2, $3)`, [url, shortlyUrl, idUser])
        res.sendStatus(201)

    } catch (err){
        res.status(500).send(err.message)
    }
}