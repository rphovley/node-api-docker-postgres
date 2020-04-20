/* eslint-disable no-console */

// module dependencies

import './utils/env'

// eslint-disable-next-line import/first
import { Express } from './express'


// create http server

const expressServer = Express.bootstrap()
const { httpServer } = expressServer

// listen on provided ports
httpServer.listen(expressServer.port)

// add error handler
httpServer.on('error', onError)

// start listening on port
httpServer.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function onError(error) {
  let bind = 'Port or pipe'
  if (error.syscall !== 'listen') throw error
  const addr = httpServer.address()
  if (addr) bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const address = httpServer.address()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { port } = address as any
  console.log(`Magic Happens on port ${port}`)
}
