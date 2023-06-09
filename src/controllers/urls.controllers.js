
import { db } from "../database/database.connection.js"
import { nanoid } from "nanoid"

export async function insertShortUrl (req, res,) {

    const {url} = req.body
    const { authorization } = req.headers
    
    const token = authorization?.replace("Bearer ", "")

    const sessao = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
    if (sessao.rows.length === 0) return res.sendStatus(401)

    try {

        const idUser = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
        const id = idUser.rows[0].idUsuario
        
        const shortUrl = nanoid()

        const {rows} = await db.query(`INSERT INTO encurtar ("urlOriginal", "urlEncurtada", "criadorDaUrl") 
        VALUES ($1, $2, $3) RETURNING encurtar.id`, [url, shortUrl, id]) 
        res.status(201).send({id: rows[0].id, shortUrl})

    } catch (err){
        res.status(500).send(err.message)
    }
}

export async function getUrlId (req, res,) {

    const {id} = req.params

    try {

        const idUrl = await db.query(`SELECT * FROM encurtar WHERE id=$1`, [id])
        if (idUrl.rows.length === 0) return res.sendStatus(404)

        const idDaUrl = idUrl.rows[0].id
        const url = idUrl.rows[0].urlOriginal
        const shortUrl = idUrl.rows[0].urlEncurtada

        res.status(200).send({id:idDaUrl, shortUrl, url})

    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function getOpenUrl (req, res,) {

    const { shortUrl } = req.params;
  
    try {
        const url = await db.query(`SELECT * FROM encurtar WHERE "urlEncurtada"=$1;`, [shortUrl]);
        if (url.rows.length === 0) return res.sendStatus(404);
    
        const originalUrl = url.rows[0].urlOriginal;
        const visitCount = url.rows[0].contagemVisitas + 1;
    
        await db.query(`UPDATE encurtar SET "contagemVisitas" = $1 WHERE "urlEncurtada" = $2`, [visitCount, shortUrl]);
    
        console.log("Número total de visitas:", visitCount);
        res.redirect(302, originalUrl);
      
    }catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteUrlId (req, res,) {

    const {id} = req.params

    const { authorization } = req.headers
    
    const token = authorization?.replace("Bearer ", "")

    try {
        const sessao = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
        if (sessao.rows.length === 0) return res.sendStatus(401)
        

        const url = await db.query(`SELECT * FROM encurtar WHERE id=$1`,[id])
        if (url.rows.length === 0) res.sendStatus(404)
        console.log(url)

        const linkCreatorId = url.rows[0].criadorDaUrl
        const sessionUserId = sessao.rows[0].idUsuario; 

        if (linkCreatorId !== sessionUserId) {
         return res.sendStatus(401);
        }
       
        await db.query(`DELETE FROM encurtar WHERE id=$1`, [id])
        
        res.status(204).send("Url excluída")
    } catch (err){
        res.status(500).send(err.message)
    }

}