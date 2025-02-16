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

async function getFirstAvailableTechnician () {
  const [results] = await conn.query<any[]>('SELECT * FROM tecnico WHERE disponibilidade = 1')
  return results[0]
}

async function getTechnicianByRequest (requestId: number) {
  const [results] = await conn.query<any[]>(
    'SELECT tecnico_id FROM atendimento WHERE solicitacao = ?',
    [requestId]
  )
  return results[0]
}

async function getBusyTechnicians () {
  const [results] = await conn.query<any[]>(
    `
      SELECT
        t.id, t.nome AS name, a.solicitacao AS request
      FROM tecnico AS t
      JOIN atendimento AS a ON a.tecnico_id = t.id
      WHERE t.disponibilidade = 0 AND a.concluido = 0;
    `,
  )
  return results
}

async function changeAvailability (technicianId: number | string) {
  await conn.query(
    'UPDATE tecnico SET disponibilidade = (NOT disponibilidade) WHERE id = ?;',
    [technicianId]
  )
}

async function count () {
  const [results] = await conn.query<any[]>(
    'SELECT COUNT(*) AS amount FROM tecnico'
  )
  return results[0]
}

export default {
  getAllTechnician,
  insertTechnician,
  getFirstAvailableTechnician,
  changeAvailability,
  getTechnicianByRequest,
  getBusyTechnicians,
  count
}