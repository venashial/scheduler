const addDays = (date, days = 1) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

module.exports = (start, end, weekdays = true, range = []) => {
  if (start > end) return range // invalid range
  const next = addDays(start, 1)

  const dayToAdd = new Date(start)
  if (
    weekdays ||
    (!weekdays && (dayToAdd.getDay() === 0 || dayToAdd.getDay() === 6))
  ) {
    return module.exports(next, end, weekdays, [...range, start]) // Finds the next date in the range with the existing found days
  } else {
    return module.exports(next, end, weekdays, range) // Recursive call for the next week without including that date
  }
}
