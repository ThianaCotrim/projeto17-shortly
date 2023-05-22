import { db } from "../database/database.connection.js"

export async function getDadosUsuario (req, res,) {

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    const sessao = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
    if (sessao.rows.length === 0) return res.sendStatus(401)

    try {

        const confirmToken = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
        const usuarioId = confirmToken.rows[0].idUsuario

        const nomeUsuario = await db.query(`SELECT * FROM clientes WHERE id=$1`, [usuarioId])

        const pegarDados = await db.query(`SELECT id, "urlOriginal", "urlEncurtada", "contagemVisitas" FROM encurtar WHERE "criadorDaUrl"=$1`, [usuarioId])
        const todosOsDados = pegarDados.rows


        const id = todosOsDados[0].id
        const shortUrl = todosOsDados[0].urlEncurtada
        const url = todosOsDados[0].urlOriginal
       

        const totalLinks = pegarDados.rowCount

        const allDados = nomeUsuario.rows.map(all => {
            const id = confirmToken.rows.find(i => i.idUsuario)
            const name = nomeUsuario.rows.find(n => n.name)

            return {
                id: id.idUsuario,
                name: name.name,
                visitCount: 0,
                shortenedUrls: todosOsDados
            }
        })
        

        let somaVisitas = 0;
        allDados[0].shortenedUrls.forEach(url => {
        somaVisitas += url.contagemVisitas;
        allDados[0].visitCount = somaVisitas
    })

    const objeto = {id: confirmToken.rows[0].idUsuario, name: nomeUsuario.rows[0].name, visitCount: somaVisitas, shortenedUrls: todosOsDados}
   

        res.status(200).send(objeto)
    } catch (err){
        res.status(500).send(err.message)
    }

}