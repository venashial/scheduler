const chunk = require('lodash.chunk')

const db = require('../database')
const evaluateSuggestion = require('../events/evaluateSuggestion')

module.exports = (client) => {
  client.on('clickButton', async (msg) => {
    // Okay or deny suggestion
    if (msg.id.startsWith('suggestion:')) {
      const action = msg.id.split(':')[1]
      const suggestion_id = msg.id.split(':')[2]

      await msg.clicker.fetch()
      const user = await msg.clicker.member.toString()

      if (action === 'okay') {
        await db.denySuggestion(false, { row_id: suggestion_id, user })
        await db.okaySuggestion(true, { row_id: suggestion_id, user })
      } else if (action === 'deny') {
        await db.okaySuggestion(false, { row_id: suggestion_id, user })
        await db.denySuggestion(true, { row_id: suggestion_id, user })
      }

      const suggestion = await db.getSuggestion({ row_id: suggestion_id })

      const embed = msg.message.embeds[0]
      embed.fields[0] = {
        name: embed.fields[0].name,
        value:
          chunk(suggestion.okayed, 3)
            .map((names) => names.join(', '))
            .join('\n') || '\u200b',
      }
      embed.fields[1] = {
        name: embed.fields[1].name,
        value:
          chunk(suggestion.denied, 3)
            .map((names) => names.join(', '))
            .join('\n') || '\u200b',
      }

      await msg.message.edit(embed)

      await msg.reply.defer(true)

      setTimeout(async () => {
        await evaluateSuggestion({ row_id: suggestion_id })
      }, 3000)

      // await msg.reply.edit(`${action === 'okay' ? '📗' : '📕' } You just ${action === 'okay' ? 'okayed' : 'denied' } that date.`)
    }
  })
}
