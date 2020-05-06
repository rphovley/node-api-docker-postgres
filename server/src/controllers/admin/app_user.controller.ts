import { Request, Response, NextFunction } from '../../middleware/express'
import { AppUser } from '../../models/app_user.model'

export async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const appUsers = await AppUser.query()
    res.json({ message: 'success', data: appUsers })
  } catch (err) {
    return next(err)
  }
}

export async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
  const appUserId = req.params.id
  if (!appUserId) return next({ status: 422, message: 'id required to update AppUser' })
  try {
    const appUsers = await AppUser.query().findById(appUserId)
    res.json({ message: 'success', data: appUsers })
  } catch (err) {
    return next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { body } = req
  if (!body) return next({ status: 422, message: 'Body required to create AppUser' })
  try {
    const appUsers = await AppUser.query().insert(body)
    res.send({ message: 'success', data: appUsers })
  } catch (err) {
    return next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { body } = req
  const appUserId = req.params.id
  if (!appUserId) return next({ status: 422, message: 'id required to update AppUser' })
  try {
    const appUsers = await AppUser.query().patchAndFetchById(appUserId, body)
    if (!appUsers) return next({ status: 404, message: `Could not find AppUser with id: ${appUserId}` })
    res.send({ message: 'success', data: appUsers })
  } catch (err) {
    return next(err)
  }
}

export async function del(req: Request, res: Response, next: NextFunction): Promise<void> {
  const appUserId = req.params.id
  if (!appUserId) return next({ status: 422, message: 'id required to update AppUser' })
  try {
    const appUsers = await AppUser.query().deleteById(appUserId)
    if (!appUsers) return next({ status: 404, message: `Could not find AppUser with id: ${appUserId}. May be already deleted.` })
    res.send({ message: 'success', data: appUsers })
  } catch (err) {
    return next(err)
  }
}
