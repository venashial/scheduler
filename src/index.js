const start = async () => {
  await require('./database/migrate')()

  require('./discord')
}

start()