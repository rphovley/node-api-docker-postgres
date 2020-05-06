import { Request, Response, NextFunction } from 'express'
import { initConnection } from '../../utils/db_config'

import Knex = require('knex')

let globalKnexDB

function getGlobalKnex(): Knex {
  if (!globalKnexDB) globalKnexDB = initConnection()
  return globalKnexDB
}

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getGlobalKnex().select('id', 'name').from('tenant')
    res.send({ message: 'success', data })
  } catch (err) {
    return next(err)
  }
}
