import { db } from "../database/database.connection.js"

export async function ranking (req, res,) {

    try {
        const userLink = await db.query(`
          SELECT e."criadorDaUrl", COUNT(*) AS "totalLinks", l."name" AS "userName"
          FROM encurtar e
          JOIN clientes l ON e."criadorDaUrl"::text = l.id::text
          GROUP BY e."criadorDaUrl", l."name"
        `);
    
        const visitas = await db.query(`
          SELECT "criadorDaUrl", SUM("contagemVisitas") AS "totalVisitas"
          FROM encurtar
          GROUP BY "criadorDaUrl"
        `);
        const totalVisitas = visitas.rows;
    
        const allDados = userLink.rows.map(row => {
          const userVisitas = totalVisitas.find(visita => visita.criadorDaUrl === row.criadorDaUrl);
          const visitCount = userVisitas ? userVisitas.totalVisitas : 0;
    
          return {
            id: row.criadorDaUrl,
            name: row.userName,
            linksCount: row.totalLinks,
            visitCount: visitCount
          };
        });
        
        res.status(200).send(allDados)
    } catch (err){
        res.status(500).send(err.message)
    }
}