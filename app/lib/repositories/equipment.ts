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

async function reduceAmount ({ id, decrease }: { id: number, decrease: number }) {
  await conn.query(
    'UPDATE equipamento SET quantidade_stock = (quantidade_stock - ?) where id = ?;',
    [decrease, id]
  )
}

async function getAllEquipment () {
  const [results] = await conn.query('SELECT * FROM equipamento')
  return results
}

async function getEquipmentById (id: number) {
  const [results] = await conn.query<any[]>('SELECT * FROM equipamento WHERE id = ?', id)
  return results[0]
}

async function count () {
  const [results] = await conn.query<any[]>('SELECT COUNT(*) AS amount FROM equipamento')
  return results[0]
}

async function getLowStockEquipment () {
  const [results] = await conn.query(
  `
    SELECT nome AS name, quantidade_stock AS amount
    FROM equipamento
    WHERE quantidade_stock <= 10;
  `)
  return results
}

export default {
  getLowStockEquipment,
  insertEquipment,
  getAllEquipment,
  getEquipmentById,
  reduceAmount,
  count
}