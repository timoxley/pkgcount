"use strict"

var columnify = require('columnify')
var chalk = require('chalk')
var bytes = require('pretty-bytes')

module.exports = renderConsole

function renderConsole(pkgs, opts) {
  var columns = ["key"]
  if (!opts.paths) {
    columns.push("duplicates")
    pkgs = pkgs.map(function(pkg) {
      pkg.duplicates = pkg.duplicates
      return pkg
    })
  } else {
    columns.push("paths")
    pkgs = pkgs.map(function(pkg) {
      pkg.paths = pkg.paths.join('\n')
      return pkg
    })
  }
  if (opts.du) {
    pkgs = pkgs.map(function(pkg) {
      pkg.size = bytes(pkg.size)
      pkg.totalSize = bytes(pkg.totalSize)
      return pkg
    })
    columns.push("totalSize")
  }
  return columnify(pkgs, {preserveNewLines: true, columns: columns, headingTransform: function(heading) {
    if (heading === 'duplicates') return ' # '
    if (heading === 'key') return 'PACKAGE'
    if (heading === 'totalSize') return 'SIZE'
    return heading
  },
  columnSplitter: '  ',
  config: {
    duplicates: {align: 'left'},
    totalSize: {align: 'left'},
    size: {align: 'left'},
    key: {align: 'left'}
  }})
}

renderConsole.color = function renderConsoleColor(pkgs, opts) {
  var max = pkgs.reduce(function(max, pkg) {
    return Math.max(max, pkg.duplicates)
  }, 0)

  // dynamically discover color ranges by splitting into quarters
  // between 0 and max
  var range = max * 0.25
  var high = Math.max(5, range * 3)
  var mid = Math.max(2, range * 2)
  var low = Math.max(1, range)

  pkgs = pkgs.map(function(pkg) {
    var name = pkg.name
    var version = pkg.version
    var duplicates = pkg.duplicates
    if (duplicates > high) name = chalk.inverse(chalk.red(name))
    else if (duplicates > mid) name = chalk.red(name)
    else if (duplicates > low) name = chalk.yellow(name)
    pkg.key = [name,version].join('@')
    return pkg
  })
  return renderConsole(pkgs, opts)
}
