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
  rows = rows.map(function(row) {
    var name = row.name.split('@')[0]
    var version = row.name.split('@')[1]
    var count = row.value.length
    if (count > 5) name = chalk.inverse(chalk.red(name))
    else if (count > 3) name = chalk.red(name)
    else if (count > 1) name = chalk.yellow(name)
    row.name = [name,version].join('@')
    return row
  })
  return renderConsoleRows(rows, opts)
}
