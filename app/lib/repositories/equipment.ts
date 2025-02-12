import { conn } from "./index.js"

async function insertEquipment ({
  name, category, amount, description
}: {
  name: string,
  category: string,
  amount: number,
  description: string
}) {
  await conn.query(
    'INSERT INTO equipamento (nome, categoria, quantidade_stock, descricao) VALUES(?, ?, ?, ?)',
    [name, category, amount, description]
  )
}

async function getAllEquipment () {
  const [results] = await conn.query('SELECT * FROM equipamento')
  return results
}

export default {
  insertEquipment,
  getAllEquipment
}