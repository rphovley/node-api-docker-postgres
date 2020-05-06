import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('lead', (table) => {
      table.increments('id')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.string('first_name')
      table.string('last_name')
      table.string('email').unique()
      table.string('phone_number').unique()
      table.boolean('opt_out')
      table.integer('login_id').unsigned().references('id')
        .inTable('app_user')
        .index()
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('lead')
}
