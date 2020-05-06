/* eslint-disable no-console */
/* eslint-disable dot-notation */
import { initConnection } from './config/db'


import Knex = require('knex')

export async function seed(knex: Knex): Promise<void> {
  // Clean db

  await deleteRecords(knex)
  const now = (new Date()).toISOString()
  console.log('insertin records')
  await knex('tenant').insert({
    created_at: now,
    updated_at: now,
    name: 'Tesla',
    db_name: 'tenant',
    db_user: 'tenant',
    db_port: '5432',
    db_host: '127.0.0.1',
    db_pass: '',
  })
  await knex('tenant').insert({
    created_at: now,
    updated_at: now,
    name: 'Kwiki Mart',
    db_name: 'tenant',
    db_user: 'tenant',
    db_port: '5433',
    db_host: '127.0.0.1',
    db_pass: '',
  })
  await knex('tenant').insert({
    created_at: now,
    updated_at: now,
    name: 'Lemonade Stand',
    db_name: 'tenant',
    db_user: 'tenant',
    db_port: '5434',
    db_host: '127.0.0.1',
    db_pass: '',
  })
}

const deleteRecords = async (knex: Knex): Promise<void> => {
  console.log('removing records')
  await knex('tenant').del()
}

const dbConnection = initConnection()

const runSeeds = async (): Promise<void> => {
  console.log('Seeds starting')
  await seed(dbConnection)
  console.log('Seeds completed')
  await dbConnection.destroy()
}

runSeeds()
