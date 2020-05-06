/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-unresolved */ // the firebase file is added dynamically by the build server after ts is built

import admin from 'firebase-admin'

const initializeFirebase = (): void => {
  const serviceAccount = require('../../../env/google_service_accounts/firebase_service_account.json')
  if (!serviceAccount) throw Error('Missing firebase config')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
  })
  admin.auth()
}

export { initializeFirebase, admin }
