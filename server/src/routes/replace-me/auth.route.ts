import { Router } from 'express'
import { signup } from '../../controllers/replace-me/auth.controller'

export class AuthRoute {
  public static create(router: Router): void {
    router.post('/api/engage/auth/signup', signup)
  }
}
