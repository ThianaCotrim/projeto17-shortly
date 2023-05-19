
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
        res.status(201).send({idUser, shortlyUrl})

    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function getUrlId (req, res,) {

    const {id} = req.params

    try {

        const idUrl = await db.query(`SELECT * FROM encurtar WHERE id=$1`, [id])
        const idDaUrl = idUrl.rows[0].id
        const urlOriginal = idUrl.rows[0].urlOriginal
        const urlEncurtada = idUrl.rows[0].urlEncurtada

        res.status(200).send({idDaUrl, urlOriginal, urlEncurtada})

    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function getOpenUrl (req, res,) {

    const {shortUrl} = req.params

    try {

        const idUrl = await db.query(`SELECT * FROM encurtar WHERE "urlEncurtada"=$1`, [shortUrl])
        const urlEncurtada = idUrl.rows[0].urlEncurtada

        await db.query(`UPDATE encurtar SET "contagemVisitas" = "contagemVisitas" + 1 WHERE "urlEncurtada" = $1`, [shortUrl])

        res.redirect(302, urlEncurtada)
    }catch (err) {
        res.status(500).send(err.message)
    }
}