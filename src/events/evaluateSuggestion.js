const { DateTime } = require('luxon')
const { MessageButton } = require('discord-buttons')

const db = require('../database')
const client = require('../discord/client')
const testSuggestion = require('./testSuggestion')

module.exports = async ({ row_id }) => {
  const suggestion = await db.getSuggestion({ row_id })

  const event = await db.getEvent({ event_id: suggestion.event_id })

  // Check if the suggestion is pending
  if (suggestion.status !== 'pending') return

  // Check if anyone denied the suggestion
  if (suggestion.denied.length > 0) {
    await db.changeSuggestionStatus({ row_id: suggestion.id, status: 'rejected' })

    try {
      await testSuggestion({ event_id: suggestion.event_id })
    } catch (err) {
      await client.channels.cache.get(event.channel_id).send(`😳 The last suggestion of the event: ${event.event_id} was denied.`)
    }

    const message = await client.channels.cache.get(event.channel_id).messages.fetch(suggestion.message_id)
    const embed = message.embeds[0]

    const date = DateTime.fromMillis(suggestion.date)
    embed.title = `[DENIED] ${date.toLocaleString(DateTime.DATE_HUGE)}`
    embed.description = `Suggestion ${date.toLocaleString(DateTime.DATE_SHORT)} was denied by ${suggestion.denied.join(', ')}`
    embed.color = 0xFF6961

    const disable_button = new MessageButton()
    .setStyle('grey')
    .setLabel('Disabled')
    .setID('disabled:' + suggestion.id)
    .setDisabled()
    
    message.edit(embed, disable_button)
    return
  }
} 