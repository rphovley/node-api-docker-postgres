import admin from 'firebase-admin'

const initializeFirebase = (): void => {
  const serviceAccount = require("../../../env/google_service_accounts/firebase_service_account.json")
  if(!serviceAccount) throw Error("Missing firebase config")

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
  })
  admin.auth()
}

export { initializeFirebase, admin }
