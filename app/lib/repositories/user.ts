import { conn } from "./index.js"

async function fetchUser (email: string) {
  const [results] = await conn.query<any[]>('SELECT * FROM usuario WHERE email=?', email)
  return results[0]
}

export default {
  fetchUser
}