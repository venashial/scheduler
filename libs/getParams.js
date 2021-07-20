module.exports = (content, replace) => {
  const message = content.toLowerCase().replace(replace, '').substring(1)
  if (!message) return {}

  const args = message.split(' ')
  if (args.length == 0) return {}

  const params = {}
  args.forEach((arg, index) => {
    params[arg.match(/^([^:])+/)[0]] = arg.match(/[^:]+$/)[0]
  })

  Object.keys(params).forEach((key) => {
    if (params[key].includes(',')) {
      params[key] = params[key].split(',')
    } else if (params[key] === 'false' || params[key] === 'true') {
      params[key] = JSON.parse(params[key])
    } else if (!isNaN(params[key]) && !isNaN(parseFloat(params[key]))) {
      params[key] = JSON.parse(params[key])
    }
  })

  return params
}
