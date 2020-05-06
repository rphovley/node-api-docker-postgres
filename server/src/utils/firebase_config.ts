import admin from 'firebase-admin'

const env = process.env.NODE_ENV ? `${process.env.NODE_ENV}` : ''
if (env === '') {
  loadFirebaseConfig()
}

function loadFirebaseConfig(){
  const firebaseConfig = require('../../google_service_accounts/firebase_service_account.json')
  process.env.FIREBASE_PROJECT_ID = firebaseConfig.project_id
  process.env.FIREBASE_PRIVATE_KEY = firebaseConfig.private_key
  process.env.FIREBASE_CLIENT_EMAIL = firebaseConfig.client_email
}

const initializeFirebase = (): void => {
  if(!process.env.FIREBASE_PRIVATE_KEY) throw Error("Missing firebase env variables")
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }

  if ((process.env.NODE_ENV || 'development') === 'development') { admin.database.enableLogging(true) }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
  })
  admin.auth()
}

export { initializeFirebase, admin }
