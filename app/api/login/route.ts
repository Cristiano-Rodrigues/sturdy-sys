import { Request, Response } from 'express'
import { z } from 'zod'
import userRep from '../../lib/repositories/user.js'
import bcrypt from 'bcrypt'

export async function POST (req: Request, res: Response) {
  const auth: {
    email: string,
    password: string
  } = {
    email: req.body.email,
    password: req.body.password
  }

  const Credentials = z.object({
    email: z.string().email(),
    password: z.string()
  })

  const result = Credentials.safeParse(auth)

  if (!result.success) {
    return {
      code: 400,
      success: false,
      errorMessage: 'Os dados inseridos estão incorrectos!'
    }
  }

  try {
    const userData = await userRep.fetchUser(auth.email)

    const match = await bcrypt.compare(auth.password, userData.senha)
    if (!userData || !match) {
      return {
        code: 400,
        success: false,
        errorMessage: 'Email ou password incorrectos!'
      }
    }

    return {
      success: true,
      user: {
        id: userData.id,
        name: userData.nome,
        email: auth.email,
        permission: userData.permissao
      }
    }
  } catch (error) {
    console.error(error)
    return {
      code: 500,
      success: false,
      errorMessage: 'Algo correu mal ao fazer login'
    }
  }
}

export async function GET (req: Request) {
  const password = req.body.password

  return {
    password,
    hash: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
}