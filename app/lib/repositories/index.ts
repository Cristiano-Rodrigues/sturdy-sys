import mysql from 'mysql2/promise'

const [host, user, password, database] = (() => ([
  'HOST',
  'USER',
  'PASS',
  'DB_NAME',
]).map(envVar => process.env[envVar]))()

export const conn = await mysql.createConnection({
  host,
  user,
  password,
  database,
  multipleStatements: true
})