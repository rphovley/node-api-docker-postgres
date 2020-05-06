import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('event', (table) => {
      table.increments('id')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.string('name').notNullable()
      table.string('event_type').notNullable()
      table.string('content_type').notNullable()
      table.string('industry').notNullable()
      table.string('location_name').notNullable()
      table.string('location_notes')
      table.string('location_lat')
      table.string('location_lng')
      table.string('location_address')
      table.string('location_map')
      table.integer('created_by_id').unsigned().notNullable().references('id')
        .inTable('app_user')
        .index()
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('event')
}
