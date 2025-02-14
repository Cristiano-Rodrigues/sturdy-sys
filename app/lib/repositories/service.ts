import { conn } from "./index.js"

async function registerService ({
  technicianId,
  requestId,
  currDate,
  concluded
}: {
  technicianId: number | string,
  requestId: number | string,
  currDate: Date,
  concluded: 0 | 1 | boolean
}) {
  await conn.query(
    'INSERT INTO atendimento (tecnico_id, solicitacao, data, concluido) VALUES(?, ?, ?, ?)',
    [technicianId, requestId, currDate, concluded]
  )
}

export default {
  registerService
}