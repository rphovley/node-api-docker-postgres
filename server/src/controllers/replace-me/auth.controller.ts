import { Request, Response, NextFunction } from '../../middleware/express'
import { AppUser } from '../../models/app_user.model'
import { AuthErrors } from '../../utils/customErrors'
import { AuthValidation } from '../../models/validations/auth.validation'

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  // receive google data and the related attendee information
  // const { body } = req as { body: ISignupUser }
  try {
    AuthValidation.validateSignup(req)
    const appUser = await AppUser.signupUser(req.body)
    res.send({ message: 'success', data: appUser })
  } catch (err) {
    if (err.code) next(new AuthErrors.FirebaseError())
    return next(err)
  }
}
