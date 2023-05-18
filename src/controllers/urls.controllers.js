
import { db } from "../database/database.connection.js"
import { nanoid } from "nanoid"

export async function insertShortUrl (req, res) {

    const {url} = req.body

    try {

        if (!url) {
            return res.status(422).send("A URL é obrigatória no corpo da requisição.");
          }

        const shortlyUrl = nanoid()
        const encurtador = await db.query(`INSERT INTO shorts (shortlyUrl, url) VALUES ($1, $2)`, [shortlyUrl, url])

        res.send(encurtador)

    } catch (err){
        res.status(500).send(err.message)
    }
}