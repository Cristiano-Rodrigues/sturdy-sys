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

export default {
  insertEquipment
}