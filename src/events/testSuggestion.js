const { DateTime } = require('luxon')
const Discord = require('discord.js')
const { MessageButton, MessageActionRow } = require('discord-buttons')

const db = require('../database')
const client = require('../discord/client')

module.exports = async ({ event_id }) => {
  // Get open suggestion by event id from database
  const suggestion = await db.getOpenSuggestion({ event_id })

  const event = await db.getEvent({ event_id })

  const date = DateTime.fromMillis(suggestion.date)

  const embed = new Discord.MessageEmbed()
    .setTitle(`Can you make ${date.toLocaleString(DateTime.DATE_HUGE)}?  🗓`)
    .setColor('#50c067')
    .setDescription(date.toLocaleString(DateTime.DATE_SHORT))
    .addFields({
      name: 'Okayed  📗',
      value: '\u200b',
    })
    .addFields({
      name: 'Denied  📕',
      value: '\u200b',
    })

  const button = new MessageButton()
    .setStyle('green')
    .setLabel('Yes 🏃‍♂️💨  ')
    .setID('suggestion:okay:' + suggestion.id)

  const button2 = new MessageButton()
    .setStyle('red')
    .setLabel('No 👻  ')
    .setID('suggestion:deny:' + suggestion.id)

  const actionRow = new MessageActionRow().addComponents(button, button2)

  const sent = await client.channels.cache.get(event.channel_id).send(embed, actionRow)

  await db.changeSuggestionMessageId({ row_id: suggestion.id, message_id: sent.id })

  await db.changeSuggestionStatus({ row_id: suggestion.id, status: 'pending' })
} 