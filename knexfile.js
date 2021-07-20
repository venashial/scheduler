const development = {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
  },
}

const production = {
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite3',
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
  },
}

module.exports = {
  development,
  production,
}
