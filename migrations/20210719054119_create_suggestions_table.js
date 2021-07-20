exports.up = (knex) => {
  return knex.schema.createTable('suggestions', (table) => {
    table.increments()
    table.string('event_id').notNullable()
    table.string('date').notNullable()
    table.string('message_id').defaultTo('')
    table.string('okayed').defaultTo('[]') // array of users
    table.string('denied').defaultTo('[]') // array of users
    table.string('status').defaultTo('open') // open (not tried), rejected, pending (voting in-progress), accepted
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('suggestions')
}
