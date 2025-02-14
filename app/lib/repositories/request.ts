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

export default {
  registerRequest,
  registerEquipment
}