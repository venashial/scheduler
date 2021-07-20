const chrono = require('chrono-node')

const getParams = require('../../libs/getParams')
const dateRange = require('../../libs/dateRange')

const db = require('../database')
const testSuggestion = require('../events/testSuggestion')

module.exports = (client) => {
  client.on('message', async (msg) => {
    if (msg.author.bot) return

    // Create new account
    if (msg.content.startsWith('!s setup')) {
      if (
        !msg.member.hasPermission('ADMINISTRATOR') &&
        !msg.member.hasPermission('MANAGE_GUILD')
      ) {
        msg.channel.send(
          'You do not have permission to do that. Only admins or people that can manage the server can setup new events.'
        )
        return
      }

      const params = getParams(msg.content, '!s setup')

      if (
        params.id &&
        params.start &&
        params.end &&
        params.channel &&
        typeof params.weekdays === 'boolean'
      ) {
        try {
          // Create event
          const start_date = chrono.parseDate(params.start)
          const end_date = chrono.parseDate(params.end)

          const channel_id = msg.guild.channels.cache
            .filter((chx) => chx.type === 'text')
            .filter((chx) => chx.name === params.channel)
            .array()[0].id

          const dates = dateRange(start_date, end_date, params.weekdays)

          if (dates.length > 0) {
            await db.createEvent({
              event_id: params.id,
              channel_id: channel_id,
              weekdays: params.weekdays,
              start_date: start_date,
              end_date: end_date,
            })

            msg.channel.send(
              `An event with the id \`${params.id}\` was created! 🚀`
            )

            for (const date of dates) {
              await db.addSuggestion({ event_id: params.id, date })
            }

            await testSuggestion({ event_id: params.id })
          } else {
            msg.channel.send(
              "Those start and end dates didn't result in any available dates. Maybe double check them..."
            )
            return
          }
        } catch (err) {
          msg.channel.send(err.toString())
        }
      } else {
        msg.channel.send(
          "I couldn't read that. The format is `setup id:String channel:DiscordChannel weekdays:Bool start:date end:date`"
        )
        return
      }
    } else if (msg.content === '!s' || msg.content === '!s help') {
      msg.channel.send(
        "Hi, I'm a bot that helps find a date that works for a group of people. Currently I'm not joining public servers. Ask <@!616271301132156962> for more info.",
        { allowedMentions: { users: [] } }
      )
    }
  })
}
