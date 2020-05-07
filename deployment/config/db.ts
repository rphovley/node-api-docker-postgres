
// // Setting up the database connection
import './env'

import Knex = require('knex')

export const config: Knex.Config = {
  client: 'postgres',
  connection: {
    host: process.env.MIGRATION_DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    instanceName: 'db',
    charset: 'utf8',
  },
}

export const initConnection = (): Knex => {
  const knex: Knex = Knex(config)
  return knex
}
