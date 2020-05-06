/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { initializeFirebase, admin } from '../../server/src/utils/firebase_config'
import { initConnection } from '../../server/src/utils/db_config'

import faker = require('faker')
import rp = require('request-promise')

initializeFirebase()
getFirebaseToken()

async function getFirebaseToken(): Promise<void> {
  const knex = initConnection()
  const uid = faker.random.uuid()
  await knex.destroy()
  console.log(`Generating token for user with uid: ${uid}`)

  admin.auth().createCustomToken(uid)
    .then((customToken) => {
      // Send token back to client

      return getIdTokenFromCustomToken(customToken)
    }).then((idToken) => {
      console.log(idToken)
    })
    .catch((error) => {
      console.log('Error creating custom token:', error)
    })
}


// 'customToken' comes from FirebaseAdmin.auth().createCustomToken(uid)
function getIdTokenFromCustomToken(customToken): Promise<string> {
  const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.WEB_API_KEY}`
  const data = {
    token: customToken,
    returnSecureToken: true,
  }

  const options = {
    method: 'POST',
    uri: url,
    body: data,
    json: true, // Automatically stringifies the body to JSON
  }

  return rp(options)
  // idToken is the firebase id token that can be used with verifyIdToken
    .then(parsedBody => parsedBody.idToken)
}
