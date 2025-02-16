import { conn } from "./index.js"

async function registerRequest ({
  currDate,
  state,
  userId
}: {
  currDate: Date,
  state: 'pending' | 'in progress' | 'done',
  userId: number
}) {
  const [results] = await conn.query<any[]>(
    'INSERT INTO solicitacao (data, estado, cliente_id) VALUES(?, ?, ?); SELECT LAST_INSERT_ID();',
    [currDate, state, userId]
  )
  return results[0]
}

async function markAskDone (requestId: number) {
  await conn.query<any[]>(
    'UPDATE solicitacao SET estado = \'done\' WHERE id = ?;',
    [requestId]
  )
}

async function registerEquipment ({
  requestId,
  equipmentId,
  amount
}: {
  requestId: number,
  equipmentId: number,
  amount: number
}) {
  await conn.query<any[]>(
    'INSERT INTO solicitacao_equipamento (solicitacao_id, equipamento_id, quantidade) VALUES(?, ?, ?);',
    [requestId, equipmentId, amount]
  )
}

async function getAllRequests () {
  const [results] = await conn.query<any[]>(
    `
      SELECT
        s.id, s.data, s.estado, se.quantidade, e.nome, e.categoria, u.nome AS solicitante
      FROM solicitacao AS s
      JOIN solicitacao_equipamento AS se ON se.solicitacao_id = s.id
      JOIN equipamento AS e ON se.equipamento_id = e.id
      JOIN usuario AS u ON u.id = s.cliente_id
      ORDER BY s.id;
    `
  )
  return results
}

async function getUserRequests (id: number) {
  const [results] = await conn.query<any[]>(
    `
      SELECT
        s.id, s.data, s.estado, se.quantidade, e.nome, e.categoria, u.nome AS solicitante
      FROM solicitacao AS s
      JOIN solicitacao_equipamento AS se ON se.solicitacao_id = s.id
      JOIN equipamento AS e ON se.equipamento_id = e.id
      JOIN usuario AS u ON u.id = s.cliente_id
      WHERE s.cliente_id = ?
      ORDER BY s.id;
    `, [id]
  )
  return results
}

async function getPendingRequests () {
  const [results] = await conn.query<any[]>(
    `
      SELECT s.id, s.data, s.estado, u.nome AS solicitante
      FROM solicitacao AS s
      JOIN usuario AS u ON s.cliente_id = u.id
      WHERE s.estado = 'pending';
    `
  )
  return results
}

async function count () {
  const [results] = await conn.query<any[]>('SELECT COUNT(*) AS amount FROM solicitacao')
  return results[0]
}

async function countPending () {
  const [results] = await conn.query<any[]>('SELECT COUNT(*) AS amount FROM solicitacao WHERE estado = \'pending\'')
  return results[0]
}

export default {
  getPendingRequests,
  registerRequest,
  registerEquipment,
  getAllRequests,
  getUserRequests,
  markAskDone,
  countPending,
  count
}