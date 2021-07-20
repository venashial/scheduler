const knex = require('./knex')

// Events

module.exports.createEvent = async ({
  event_id,
  channel_id,
  weekdays,
  start_date,
  end_date,
}) => {
  await knex('events')
    .insert({
      event_id,
      channel_id,
      weekdays,
      start_date,
      end_date,
    })
    .catch((err) => {
      throw err
    })
}

module.exports.getEvent = async ({ event_id }) => {
  return (
    await knex('events')
      .where({
        event_id,
      })
      .catch((err) => {
        throw err
      })
  )[0]
}

module.exports.deleteEvent = async ({ event_id }) => {
  await knex('events')
    .where({
      event_id,
    })
    .del()
    .catch((err) => {
      throw err
    })
}

// Suggestions

module.exports.addSuggestion = async ({ event_id, date }) => {
  await knex('suggestions')
    .insert({
      event_id,
      date,
    })
    .catch((err) => {
      throw err
    })
}

module.exports.getSuggestion = async ({ row_id }) => {
  const suggestion = (
    await knex('suggestions')
      .where({ id: row_id })
      .catch((err) => {
        throw err
      })
  )[0]
  suggestion.okayed = JSON.parse(suggestion.okayed)
  suggestion.denied = JSON.parse(suggestion.denied)
  suggestion.date = parseFloat(suggestion.date)
  return suggestion
}

module.exports.getOpenSuggestion = async ({ event_id }) => {
  const suggestion = (
    await knex('suggestions')
      .where({ event_id })
      .catch((err) => {
        throw err
      })
  ).filter((it) => it.status === 'open')[0]
  suggestion.okayed = JSON.parse(suggestion.okayed)
  suggestion.denied = JSON.parse(suggestion.denied)
  suggestion.date = parseFloat(suggestion.date)
  return suggestion
}

module.exports.changeSuggestionStatus = async ({ row_id, status }) => {
  await knex('suggestions')
    .where({ id: row_id })
    .update({ status })
    .catch((err) => {
      throw err
    })
}

module.exports.okaySuggestion = async (state, { row_id, user }) => {
  const suggestion = await module.exports.getSuggestion({ row_id })

  if (state && suggestion.okayed.indexOf(user) === -1) {
    suggestion.okayed.push(user)
  } else if (!state && suggestion.okayed.indexOf(user) !== -1) {
    suggestion.okayed.splice(suggestion.okayed.indexOf(user), 1)
  }

  await knex('suggestions')
    .where({ id: row_id })
    .update({ okayed: JSON.stringify(suggestion.okayed) })
    .catch((err) => {
      throw err
    })
}

module.exports.denySuggestion = async (state, { row_id, user }) => {
  const suggestion = await module.exports.getSuggestion({ row_id })

  if (state && suggestion.denied.indexOf(user) === -1) {
    suggestion.denied.push(user)
  } else if (!state && suggestion.denied.indexOf(user) !== -1) {
    suggestion.denied.splice(suggestion.denied.indexOf(user), 1)
  }

  await knex('suggestions')
    .where({ id: row_id })
    .update({ denied: JSON.stringify(suggestion.denied) })
    .catch((err) => {
      throw err
    })
}

module.exports.changeSuggestionMessageId = async ({ row_id, message_id }) => {
  await knex('suggestions')
    .where({ id: row_id })
    .update({ message_id })
    .catch((err) => {
      throw err
    })
}
