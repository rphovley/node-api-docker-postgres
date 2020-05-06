import { BaseModel, IBaseModel } from './base.model'

import admin = require('firebase-admin')
import Knex = require('knex')

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const roles = <const> ['admin', 'attendee', 'speaker']
export type Roles = typeof roles[number]

export interface IAppUser extends IBaseModel {
  roles: Roles[]
  firebase_uid: string
  email: string
}

export interface ISignupUser extends IAppUser{
  firebase_token: string
}

export class AppUser extends BaseModel implements IAppUser {
  roles: Roles[]
  firebase_uid: string
  email: string
  static tableName = 'app_user'

  static async signupEngageUser(signupUser: ISignupUser): Promise<AppUser> {
    // const test = await admin.auth().verifyIdToken(signupUser.firebase_token)
    const { uid } = await admin.auth().verifyIdToken(signupUser.firebase_token) // validate firebase token
    // const [lead] = await knex.select({ app_user_id: 'app_user.id', lead_id: 'lead.id' }).from('lead').leftJoin('app_user', 'lead.email', 'app_user.email').where('app_user.firebase_uid', uid)
    const appUser = await AppUser.query().findOne({ firebase_uid: uid })
    if (!appUser) { // don't signup an existing user
      // create app user
      delete signupUser.firebase_token // remove token, don't want to insert it. Only need the firebase uid.
      signupUser.roles = ['attendee'] as Roles[] // ensure a attendee can't set their role
      signupUser.firebase_uid = uid
      // appUser = await AppUser.query(knex).insert(signupUser)
      // Attach new user to matching lead (by email)
      // const lead = await Lead.query(knex).findOne({ email: signupUser.email })
    }
    return appUser
  }
}
