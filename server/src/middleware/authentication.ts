import { Request, Response, NextFunction } from './express'
import { AuthErrors, BaseError } from '../utils/customErrors'
import { initializeFirebase, admin } from '../utils/firebase_config'
import { getLogger } from '../utils/logger'
import { AppUser } from '../models/app_user.model'

import Knex = require('knex')

export const whiteList: string[] = [
  // Add unprotected endpoints here
  '/api/engage/tenant',
  '/api/engage/auth/signup',
]

class Authentication {
  constructor() {
    initializeFirebase()
  }


  // eslint-disable-next-line class-methods-use-this
  public firebaseAuth(): (Request, Response, NextFunction) => void {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (whiteList.find(x => x === req.url)) {
        return next()
      }
      try {
        if (!req.headers.authorization) throw new AuthErrors.UnauthorizedError('No Authorization token sent.')
        if (!req.headers.tenantid) throw new AuthErrors.UnauthorizedError('No Client id sent.')
        req.appUser = await Authentication.getUser(req.headers.authorization)
      } catch (err) {
        if (err instanceof BaseError) next(err)
        else next(new AuthErrors.UnauthorizedError())
      }
      return next()
    }
  }

  private static async getUser(token: string): Promise<AppUser> {
    let appUser
    try {
      const fUser = await admin.auth().verifyIdToken(token) // verify firebase id token is valid
      appUser = await AppUser.query().findOne({ firebase_uid: fUser.uid }) // find user with firebase uid in system
      if (!appUser) throw new AuthErrors.UserNotFoundUnauthorizedError('No User found for that firebase_id. Send user to registration')
    } catch (err) {
      // TODO: fix this garbase conditional. The universe is crying out in pain
      if (err instanceof AuthErrors.UserNotFoundUnauthorizedError) { // user with that id not found
        throw err
      } else if (err.code.indexOf('id-token-expired') > -1) { // if from firebase about the token expiring
        throw new AuthErrors.TokenExpiredError()
      } else if (!err.code) { // unexpeccted error, log to google logging
        getLogger().error(err) // report error to error service if from firebase
      }
      throw new AuthErrors.UnauthorizedError()
    }
    return appUser
  }
}

export default new Authentication()
