
// // Setting up the database connection
import { Model } from 'objection'
import { getLogger } from './logger'

import Knex = require('knex')

const isDev = process.env.NODE_ENV === undefined
const HOST = isDev ? process.env.DB_HOST : `/cloudsql/${process.env.DB_HOST}`

if (!process.env.DB_USER || !HOST || !process.env.DB_NAME) throw Error('Missing database env variables')
export const config: Knex.Config = {
  client: 'postgres',
  connection: {
    host: HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    instanceName: 'db',
    charset: 'utf8',
  },
}

export const initObjection = (): Knex => {
  const knex: Knex = initConnection()
  Model.knex(knex)
  return knex
}

export const initConnection = (): Knex => {
  getLogger().warn('Retrieving db connection')
  const knex: Knex = Knex(config)
  return knex
}
