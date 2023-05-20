import { db } from "../database/database.connection.js"

export async function ranking (req, res,) {

    try {
        const userLink = await db.query(` SELECT e."criadorDaUrl", COUNT(*) AS "totalLinks", l."name" as "userName"
        FROM encurtar e
        JOIN clientes l ON e."criadorDaUrl"::text = l.id::text
        GROUP BY e."criadorDaUrl", l."name"`)

        const allDados = userLink.rows.map(row => {
            return {

                id: row.criadorDaUrl,
                name: row.userName,
                linksCount: row.totalLinks,
                visitCount: 0
            };
          });

        res.status(200).send(allDados)
    } catch (err){
        res.status(500).send(err.message)
    }
}