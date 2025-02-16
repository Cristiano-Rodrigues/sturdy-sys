import { Request, Response } from 'express'
import equipmentRep from '../../lib/repositories/equipment.js'
import technicianRep from '../../lib/repositories/technician.js'
import requestRep from '../../lib/repositories/request.js'

export async function GET (req: Request, res: Response) {
  try {
    const { amount: amountOfEquipments } = await equipmentRep.count()
    const { amount: amountOfTechnicians } = await technicianRep.count()
    const { amount: amountOfRequests } = await requestRep.count()
    const { amount: amountOfPendingRequests } = await requestRep.countPending()
    const busyTechnicians = await technicianRep.getBusyTechnicians()
    const lowStockEquipments = await equipmentRep.getLowStockEquipment()
    const pendingRequests = await requestRep.getPendingRequests()

    return {
      success: true,
      data: {
        amountOfEquipments,
        amountOfTechnicians,
        amountOfRequests,
        amountOfPendingRequests,
        busyTechnicians,
        lowStockEquipments,
        pendingRequests
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Algo correu mal ao pegar os dados gerais'
    }
  }
}