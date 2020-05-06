import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('app_user', (table) => {
      table.increments('id')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.specificType('roles', 'character varying[]').notNullable()
      table.string('email').notNullable().unique()
      table.string('firebase_uid').notNullable().unique()
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('app_user')
}
