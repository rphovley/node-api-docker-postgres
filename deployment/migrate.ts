/* eslint-disable no-console */
import { initConnection, config } from './config/db'

import Knex = require('knex')

const migrationConfig: Knex.MigratorConfig = {
  extension: 'ts',
  stub: 'migration.stub.ts',
  directory: 'deployment/migrations', // relative to project root
}

const runMigrations = async (): Promise<void> => {
  await runMigration(migrationConfig)
}

const runMigration = async (migConfig): Promise<void> => {
  const knexInstance = initConnection()
  try {
    await knexInstance.migrate.latest(migConfig)
  } catch (err) {
    console.log(err)
    console.log('Migration Failed')
    process.exit(1)
  }
  // eslint-disable-next-line dot-notation
  console.log(`Migrations complete for ${config.connection['instanceName']}`)
  await knexInstance.destroy()
}

runMigrations()
