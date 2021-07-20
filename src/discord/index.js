const client = require('./client')

client.login(process.env.TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity('for !s', { type: 'WATCHING' })
})

require('./commands')(client)
require('./buttons')(client)