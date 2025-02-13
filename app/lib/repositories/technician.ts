import { conn } from "./index.js"

async function insertTechnician ({
  name, spetialty
}: {
  name: string,
  spetialty: string,
}) {
  await conn.query(
    'INSERT INTO tecnico (nome, especialidade) VALUES(?, ?)',
    [name, spetialty]
  )
}

async function getAllTechnician () {
  const [results] = await conn.query('SELECT * FROM tecnico')
  return results
}

export default {
  getAllTechnician,
  insertTechnician
}