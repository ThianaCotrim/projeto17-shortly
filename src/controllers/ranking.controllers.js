import { db } from "../database/database.connection.js"

export async function ranking (req, res,) {

    try {
        const userLink = await db.query(`
          SELECT e."criadorDaUrl", COUNT(*) AS "totalLinks", l."name" AS "userName"
          FROM encurtar e
          JOIN clientes l ON e."criadorDaUrl"::text = l.id::text
          GROUP BY e."criadorDaUrl", l."name"
          LIMIT 10
        `);
    
        const visitas = await db.query(`
          SELECT "criadorDaUrl", SUM("contagemVisitas") AS "totalVisitas"
          FROM encurtar
          GROUP BY "criadorDaUrl"
          LIMIT 10
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

        allDados.sort((a, b) => b.visitCount - a.visitCount);
        const ultimos10 = allDados.slice(-10);
        
        res.status(200).send(ultimos10)
    } catch (err){
        res.status(500).send(err.message)
    }
}