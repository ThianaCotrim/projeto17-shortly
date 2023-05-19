import { db } from "../database/database.connection.js"

export async function getDadosUsuario (req, res,) {

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    const nomeUsuario = await db.query(`SELECT * FROM clientes`)
    const idDoUsuario = await db.query(`SELECT * FROM login`)
    


    try {

        
        const confirmToken = await db.query(`SELECT * FROM login WHERE token=$1`, [token])
        const usuarioId = confirmToken.rows[0].idUsuario

        const nomeUsuario = await db.query(`SELECT * FROM clientes WHERE id=$1`, [usuarioId])
        const nome = nomeUsuario.rows[0].name
        console.log(nome)

        const pegarDados = await db.query(`SELECT id, "urlOriginal", "urlEncurtada", "contagemVisitas" FROM encurtar WHERE "criadorDaUrl"=$1`, [usuarioId])
        const todosOsDados = pegarDados.rows



        const teste = await db.query(`SELECT id, "urlOriginal", "urlEncurtada", "contagemVisitas" FROM encurtar WHERE "criadorDaUrl"=$1`, [usuarioId])
        const testeUm = teste.rows

        
        for (let i = 0; i < testeUm.length; i++){
            const elemento = testeUm[i].contagemVisitas
            console.log(elemento)
        }
        


        const user = await db.query(`SELECT * FROM encurtar`)

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
       

        res.status(200).send(allDados)
    } catch (err){
        res.status(500).send(err.message)
    }

}