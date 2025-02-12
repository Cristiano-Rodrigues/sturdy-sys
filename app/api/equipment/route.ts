import { Request, Response } from 'express'
import { z } from 'zod'
import equipmentRep from '../../lib/repositories/equipment.js'

export async function POST (req: Request, res: Response) {
  const equipment = {
    name: req.body.name,
    category: req.body.category,
    amount: req.body.amount,
    description: req.body.description
  }

  const Equipment = z.object({
    name: z.string(),
    category: z.string(),
    amount: z.number(),
    description: z.string()
  })

  const result = Equipment.safeParse(equipment)

  if (!result.success) {
    return {
      code: 400,
      success: false,
      errorMessage: 'Os dados inseridos estão incorrectos!'
    }
  }

  try {
    await equipmentRep.insertEquipment(equipment)
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
    const data = await equipmentRep.getAllEquipment()

    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      message: 'Algo correu mal ao pegar os dados dos equipamentos'
    }
  }
}