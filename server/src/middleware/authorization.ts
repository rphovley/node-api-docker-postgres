import { Request, Response, NextFunction } from './express'
import { AuthErrors } from '../utils/customErrors'
import { Roles } from '../models/app_user.model'
import { whiteList } from './authentication'

type IRoutePermissions = {
  [key: string]: Roles[]
}

// TODO: make this configurable per request method (i.e. GET, POST, PUT, etc...)
const routePermissions: IRoutePermissions = {
  '/admin/app_users': ['speaker'],
}

function isAdmin(user): boolean {
  return user.roles.includes('admin')
}

// Validate that the user has the correct role/permissions for the requested resource
export const authorization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (whiteList.find(x => x === req.url)) { // skip whitelisted resources
    return next()
  }
  // admins can access all resources
  if (!isAdmin(req.appUser)) {
    const sufficient = routePermissions[req.url] && routePermissions[req.url].some(role => req.appUser.roles.includes(role))
    if (!sufficient) { next(new AuthErrors.PermissionDenied()) }
  }
  next()
}
