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

export default {
  registerRequest,
  registerEquipment,
  getAllRequests,
  getUserRequests
}