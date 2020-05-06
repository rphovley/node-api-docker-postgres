import * as http from 'http'
import * as path from 'path'
import express from 'express'
import * as bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import * as routes from './routes/engage'
import * as adminRoutes from './routes/admin'
import { initObjection } from './utils/db_config'
import { BaseError } from './utils/customErrors'
import normalizePort from './utils/normalizePort'
import authentication from './middleware/authentication'
import { authorization } from './middleware/authorization'
import { getLogger } from './utils/logger' // uses google cloud logging

const PORT_FALLBACK = '8080'

export class Express {
  public app: express.Application
  public port: string | number | boolean
  public httpServer: http.Server

  constructor() {
    this.app = express()
    initObjection() // initialize the db connection and objection ORM to global db
    this.port = normalizePort(process.env.SERVER_PORT || PORT_FALLBACK)
    this.app.set('port', this.port)
    this.initMiddleware()
    this.initRoutes()
    this.initAdminRoutes()
    this.appStatusRoute()
    this.initErrorHandling()
    this.httpServer = http.createServer(this.app)
  }

  /**
   * Fire up the bass cannon
   */
  public static bootstrap(): Express {
    return new Express()
  }

  /**
   * Stack middleware
   */
  private initMiddleware(): void {
    this.app.use(bodyParser.json())
    this.app.use(morgan('dev'))
    this.app.use(cors())
    this.app.use(express.static(path.join(__dirname, 'public')))
    this.app.use(authentication.firebaseAuth())
    this.app.use(authorization)
  }

  /**
   * Add routers to exports in routes/index.ts and they'll be added here automatically
   */
  private initRoutes(): void {
    const router: express.Router = express.Router()
    Object.values(routes).forEach(route => {
      route.create(router)
    })
    this.app.use(router)
  }

  /**
   * Add routers to exports in routes/admin/index.ts and they'll be added here automatically
   */
  private initAdminRoutes(): void {
    const router: express.Router = express.Router()
    Object.values(adminRoutes).forEach(route => {
      route.create(router)
    })
    this.app.use(router)
  }

  private appStatusRoute(): void {
    this.app.get('/api/status', (_, res) => {
      res.send({ message: 'okay' })
    })
  }

  private initErrorHandling(): void {
    this.app.use((err, req, res, next) => {
      if (err == null) err = {}
      // eslint-disable-next-line no-console
      console.log('\x1b[31m', err)
      if (err instanceof BaseError) { // Errors designed by developers to go to the end user are of type BaseError
        res.status(err.status).json({ message: err.message, err })
      } else {
        getLogger().error(err) // only send log to google if is not an expected error
        res.status(err.status || err.statusCode || 500).json({ message: err.message || 'Internal Server Error', err })
      }
    })
  }
}
