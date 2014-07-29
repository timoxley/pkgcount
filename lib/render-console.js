var columnify = require('columnify')
var chalk = require('chalk')

module.exports = renderConsole

function renderConsole(data, opts) {
  return renderConsoleRows(toArray(data), opts)
}

function renderConsoleRows(rows, opts) {
  opts = opts || {}

  if (opts.paths) {
    rows = rows.map(function(row) {
      return {
        name: row.name,
        paths: row.value.join('\n\n')
      }
    })
  } else {
    rows = rows.map(function(row) {
      return {
        name: row.name,
        count: row.value.length
      }
    })
  }
  return columnify(rows, {preserveNewLines: true})
}

function toArray(data) {
  if (Array.isArray(data)) return data
  var rows = []
  for (var key in data) {
    rows.push({
      name: key,
      value: data[key]
    })
  }
  return rows
}

renderConsole.color = function renderConsoleColor(data, opts) {
  var rows = toArray(data)

  var max = rows.reduce(function(max, row) {
    return Math.max(max, row.value.length)
  }, 0)

  // dynamically discover color ranges by splitting into quarters
  // between 0 and max
  var range = max * 0.25
  var high = Math.max(5, range * 3)
  var mid = Math.max(2, range * 2)
  var low = Math.max(1, range)

  rows = rows.map(function(row) {
    var name = row.name.split('@')[0]
    var version = row.name.split('@')[1]
    var count = row.value.length
    if (count > high) name = chalk.inverse(chalk.red(name))
    else if (count > mid) name = chalk.red(name)
    else if (count > low) name = chalk.yellow(name)
    row.name = [name,version].join('@')
    return row
  })
  return renderConsoleRows(rows, opts)
}
