import * as dotenv from 'dotenv'

const env = process.env.NODE_ENV ? `${process.env.NODE_ENV}` : ''
if (env === '') {
  dotenv.config({
    path: `${__dirname}/../bin/.log.env${env}`,
  })
}
