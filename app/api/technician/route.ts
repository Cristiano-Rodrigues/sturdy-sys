import { Request, Response } from 'express'
import { z } from 'zod'
import technicianRep from '../../lib/repositories/technician.js'

export async function POST (req: Request, res: Response) {
  const technician = {
    name: req.body.name,
    spetialty: req.body.spetialty
  }

  const Technician = z.object({
    name: z.string(),
    spetialty: z.string()
  })

  const result = Technician.safeParse(technician)

  if (!result.success) {
    return {
      code: 400,
      success: false,
      errorMessage: 'Os dados inseridos estão incorrectos!'
    }
  }

  try {
    await technicianRep.insertTechnician(technician)
  } catch (error) {
    console.error(error)
    return {
      code: 500,
      success: false,
      errorMessage: 'Algo correu mal ao inserir os dados'
    }
  }

  return {
    success: true,
    message: "Dados inseridos com sucesso!"
  }
}

export async function GET (req: Request, res: Response) {
  try {
    const data = await technicianRep.getAllTechnician()

    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      message: 'Algo correu mal ao pegar os dados dos técnicos'
    }
  }
}