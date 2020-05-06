// Imports the Google Cloud client library for Bunyan
import { LoggingBunyan } from '@google-cloud/logging-bunyan'

import Bunyan = require('bunyan')

// Creates a Bunyan Stackdriver Logging client
let logger
let loggingBunyan

const getLogger = (): Bunyan => {
  loggingBunyan = new LoggingBunyan()
  // Create a Bunyan logger that streams to Stackdriver Logging
  // Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
  if (!logger) {
    // Log to the console at 'info' and above
    const streams = []
    // And log to Stackdriver Logging, logging at 'info' and above
    if (process.env.NODE_ENV) {
      streams.push(loggingBunyan.stream('info'))
      streams.push({ stream: process.stdout, level: 'info' })
    }
    logger = Bunyan.createLogger({
    // The JSON payload of the log as it appears in Stackdriver Logging
    // will contain "name": "my-service"
      name: 'replace-me',
      streams,
    })
  }
  return logger
}

export { getLogger }
