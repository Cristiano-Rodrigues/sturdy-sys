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

async function changeAvailability (technicianId: number | string) {
  await conn.query(
    'UPDATE tecnico SET disponibilidade = NOT disponibilidade WHERE id = ?;',
    [technicianId]
  )
}

export default {
  getAllTechnician,
  insertTechnician,
  getFirstAvailableTechnician,
  changeAvailability,
  getTechnicianByRequest
}