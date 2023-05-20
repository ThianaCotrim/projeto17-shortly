import { db } from "../database/database.connection.js"

export async function getDadosUsuario (req, res,) {

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    try {

        const confirmToken = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
        const usuarioId = confirmToken.rows[0].idUsuario

        const nomeUsuario = await db.query(`SELECT * FROM clientes WHERE id=$1`, [usuarioId])

        const pegarDados = await db.query(`SELECT id, "urlOriginal", "urlEncurtada", "contagemVisitas" FROM encurtar WHERE "criadorDaUrl"=$1`, [usuarioId])
        const todosOsDados = pegarDados.rows
        const totalLinks = pegarDados.rowCount

        const allDados = nomeUsuario.rows.map(all => {
            const id = confirmToken.rows.find(i => i.idUsuario)
            const name = nomeUsuario.rows.find(n => n.name)

            return {
                id: id.idUsuario,
                name: name,
                visitCount: 0,
                shortenedUrls: todosOsDados
            }
        })
        

        let somaVisitas = 0;
        allDados[0].shortenedUrls.forEach(url => {
        somaVisitas += url.contagemVisitas;
        allDados[0].visitCount = somaVisitas
    });
    console.log(totalLinks)

        res.status(200).send(allDados)
    } catch (err){
        res.status(500).send(err.message)
    }

}