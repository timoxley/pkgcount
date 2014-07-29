#!/usr/bin/env node

var tree = require('npmd-tree').tree
var columnify = require('columnify')
var program = require('commander')

var renderConsole = require('../lib/render-console')
var renderJSON = require('../lib/render-json')
var countPaths = require('../lib/count-paths')
var filterPackagesNames = require('../lib/filter-packages-names')
var filterPackagesCount = require('../lib/filter-packages-count')
var pkgcount = require('../')

program
  .version(require('../package.json').version)
  .option('--min [count]', 'only list packages duplicated at least this number of times')
  .option('--duplicates', 'only list packages appearing more than once')
  .option('--json', 'display json output')
  .option('--no-color', 'display uncolored output. Colors indicate packages with high levels of duplication')
  .option('--paths', 'list paths to each package instead of counts')
  .option('--summary', 'only display summary')
  .option('--depth [depth]', 'limit traversal depth')
  .parse(process.argv);

var names = program.args
var dir = process.cwd()
if (program.duplicates) program.min = program.min || 2

pkgcount(dir, {depth: program.depth}, function(err, allPaths) {
  console.log("")
  var paths = filterPackagesNames(allPaths, names)
  paths = filterPackagesCount(paths, program.min)

  var outputData = paths

  var summary = {
    unique: unique(allPaths),
    total: total(allPaths),
    duplicate: duplicate(allPaths),
    depth: depth(dir, allPaths)
  }

  if (program.json) {
    if (program.summary) outputData = summary
    var result = program.color ? renderJSON.color(outputData, program) : renderJSON(outputData, program)
    console.log(result)
    return
  } else {
    if (!program.summary) {
      var result = program.color ? renderConsole.color(outputData, program) : renderConsole(outputData, program)
      console.log(result)
    }
  }
  console.log("")
  console.log("SUMMARY", columnify(invertKV(summary), {minWidth: 3, headingTransform: function() {return ''}, dataTransform: function(data) {
    if (data === 'unique') return 'Unique Packages'
    if (data === 'total') return 'Total Packages'
    if (data === 'duplicate') return 'Duplicate Packages'
    if (data === 'depth') return 'Max. Nesting Depth'
    return data
  }}))
})

function unique(paths) {
  return Object.keys(paths).length
}

function total(paths) {
  return Object.keys(paths).reduce(function(total, key) {
    return total + paths[key].length
  }, 0)
}

function duplicate(paths) {
  return total(paths) - unique(paths)
}

function depth(dir, paths) {
  return Object.keys(paths).reduce(function(max, key) {
    return Math.max(max, paths[key].reduce(function(total, path) {
      return total + pkgcount.depth(dir, path)
    }, 0))
  }, 0)
}

function invertKV(obj){
  var result = {}
  for (var key in obj) {
    var value = obj[key]
    result[value] = key
  }
  return result
}
