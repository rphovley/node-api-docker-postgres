/* eslint-disable import/no-extraneous-dependencies */
require('ts-node/register')

// This file is not used when running migrations or running seeds. It is only used when creating a migration.
// eslint-disable-next-line import/first
import { config } from './config/db'

module.exports = {

  development:
  {
    ...config,
    migrations: {
      extension: 'ts',
      stub: '../migration.stub.ts',
    },
  },
  staging: {
    ...config,
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    ...config,
    pool: {
      min: 2,
      max: 10,
    },
  },

}
