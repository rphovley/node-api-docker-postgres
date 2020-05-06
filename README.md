# CI/CD for Node API with docker, postgres, firebase auth and objection (no multi-tenancy)

1. a structure for api with single db
2. has some logging built in for Google Logs
3. uses firebase auth for authentication

## Prequisites

All of these were noted from my machine at the time and may not be the lower limits of dependencies' versions

- Node >= 12 (with npm and npx)
- Docker >= 19.03.1
- Docker Compose >= 1.24.1
- ESLint. Install dbaeumer.vscode-eslint AND esbenp.prettier-vscode extensions to vscode

## Quick Start

- Find all instances of `replace-me` and replace them with a sensible name for your project
- Obtain credentials for `./env/.db.env`, `./env/.firebase_web.env` and `./server/google_service_accounts/firebase_service_account.json` files. They are required to run the project.
- Run `yarn` to install dependencies
- Run `yarn migrate` and `yarn seed`to run migrations and seed the db
- Run `yarn watch` to compile ts to js (must be run before `yarn dev`)
- Run `yarn dev` to start the api and postgres db. Must run `yarn watch` first to compile ts to dist folder

## Linting

- Uses the .eslintrc.js file at the root of the project to configure different rules for the project.
- Install dbaeumer.vscode-eslint AND esbenp.prettier-vscode extensions to vscode

## Logger

- We are using `@google-cloud/logging-bunyan` for our logging. In order for it to send it to google cloud you'll need to setup google cloud on your machine. visit [google documentation](https://cloud.google.com/logging/docs/setup/nodejs) for details

## Testing

- See [Jokes](#jokes) section
- The `test` directory contains helper factory functions to create objects. A lowercase `car` returns an object, while uppercase `Car` inserts a `car` object into the database and returns an Objection Model. All factories are patterned after this.

## Knex | Objection

- This project makes use of Knex and Objection for its relational db needs. Objection is built on top of Knex. We utilize Knex for migrations and db connections and then Objection for Object modeling.
- Uses [JSONSchema](http://json-schema.org/) for validation
- To create a migration, go to to the `deployment` directory and run the command `knex migrate:make {migration_name}`. This requires that you have installed the knex-cli to your machine

## Notes

- The entry point file is at `server/dist/server.js`, which bootstraps the server and starts listening.
- environment variables are located in `server/bin`

## Directory Structure

- `deployment`: directory for seeds and migrations for our database
- `env`: holds environment variables for application
  - `.db.env`: holds database environment variables. Required for all parts of the application.
  - `.firebase_web.env`: web api key used for generating user tokens for testing out api.
  - `google_service_accounts`: any service accounts for google required by the application
    - `firebase_service_account.json`: required to run the application (used by auth middleware).
- `scripts`: various development scripts for the project. Could contain automations for starting, building, deployment, etc...
- `server`: the application lives here.
  - `dist`: directory the typescript is transpiled into
  - `src`: typescript directory for the application. Only used in development. This directory is transpiled into the `dist` directory which is used to run the app in production
    - `controllers`: Houses logic for handling requests from the client
    - `middleware`: Custom Express middleware for our application
    - `models`: Objection models to model our database data with
    - `routes`: Routes for our api
    - `utils`: Other helpers for running our application
- `test`: where any tests will go. Also contains factories that are utilized also by the knex seed files

## Adding a Route / Controller

- Take a look at `app_user.route.ts` and `app_user.controller.ts` for examples.
- Make sure to export any new routes in `routes/index.ts`

## Docker containers

- This project uses docker-compose to orchestrate the postgres containers (development)
- In the production environment, the postgres container is replaced by usage of postgres as a service as it's bad practice to host the database on the same machine as the server (risk of data corruption)

## [CI/CD](https://docs.google.com/document/d/1oufUMsz1exq8iEC98emocDtwcjimS4RXz3Ors2wqPPc/edit?usp=sharing)

## Jokes

- What did Neil Armstrong say when no one laughed at his moon jokes?  
  “I guess you had to be there.”
- Testing in this project is a joke
