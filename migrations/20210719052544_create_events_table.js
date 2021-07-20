exports.up = (knex) => {
  return knex.schema.createTable('events', (table) => {
    table.increments()
    table.string('event_id').unique().notNullable()
    table.string('channel_id').notNullable()
    table.boolean('weekdays').notNullable()
    table.string('start_date').notNullable()
    table.string('end_date').notNullable()
    table.string('finale_date').defaultTo('')
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('events')
}
