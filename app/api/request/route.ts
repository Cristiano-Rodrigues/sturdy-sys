import { Request, Response } from 'express'
import { z } from 'zod'
import equipmentRep from '../../lib/repositories/equipment.js'
import technicianRep from '../../lib/repositories/technician.js'
import requestRep from '../../lib/repositories/request.js'
import serviceRep from '../../lib/repositories/service.js'

type State = 'pending' | 'in progress' | 'done'

export async function POST (req: Request, res: Response) {
  const request = {
    userId: req.body.userId,
    items: req.body.items,
  }

  const Request = z.object({
    userId: z.number(),
    items: z.array(z.object({
      id: z.number(),
      name: z.string(),
      amount: z.number()
    })).nonempty()
  })

  const result = Request.safeParse(request)

  if (!result.success) {
    return {
      code: 400,
      success: false,
      message: 'Os dados inseridos estão incorrectos!'
    }
  }

  try {
    const availableTechnician = await technicianRep.getFirstAvailableTechnician()
    
    let state: State = availableTechnician ? 'in progress' : 'pending'

    await (new Promise(async (resolve, reject) => {
      for (const item of request.items) {
        const itemData = await equipmentRep.getEquipmentById(item.id)

        if (itemData.quantidade_stock < item.amount) {
          reject({
            code: 400,
            sucess: false,
            message: `O equipamento ${item.name} não possui quantidade suficiente`
          })
        }
      }
      resolve(true)
    }))

    const currDate = new Date()
    const requestData = {
      currDate,
      state,
      userId: request.userId
    }

    const { insertId } = await requestRep.registerRequest(requestData)

    await (new Promise(async (resolve, reject) => {
      for (const item of request.items) {
        try {
          await requestRep.registerEquipment({
            requestId: insertId,
            equipmentId: item.id,
            amount: item.amount
          })
        } catch (error) { reject(error) }
      }
      resolve(true)
    }))

    await (new Promise(async (resolve, reject) => {
      for (const item of request.items) {
        await equipmentRep.reduceAmount({
          id: item.id,
          decrease: item.amount
        })
      }
      resolve(true)
    }))

    if (availableTechnician) {
      const technicianId = availableTechnician.id
      await serviceRep.registerService({
        technicianId,
        requestId: insertId,
        currDate,
        concluded: 0
      })
      await technicianRep.changeAvailability(technicianId)
    }
  } catch (error: any) {
    console.error(error)
    if (error.code < 500) {
      return error
    }
    return {
      success: false,
      code: 500,
      message: 'Algo correu mal ao cadastrar a solicitacao'
    }
  }

  return {
    code: 200,
    success: true,
    message: "Dados inseridos com sucesso!"
  }
}

export async function GET (req: Request, res: Response) {
  try {
    const data = await requestRep.getAllRequests()

    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      message: 'Algo correu mal ao pegar os dados das solicitações'
    }
  }
}

export async function PUT (req: Request, res: Response) {
  const requestId = req.body.requestId

  try {
    await requestRep.markAskDone(requestId)
    await serviceRep.markAsAnswered(requestId)
    const technician = await technicianRep.getTechnicianByRequest(requestId)
    await technicianRep.changeAvailability(technician.tecnico_id)

    return {
      code: 200,
      success: true,
      message: 'Atendimento realizado com sucesso!'
    }
  } catch (error: any) {
    console.error(error)
    if (error.code < 500) {
      return error
    }
    return {
      code: 500,
      success: false,
      message: 'Erro na operação. Tente novamente mais tarde'
    }
  }
}