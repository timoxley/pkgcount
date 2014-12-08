#!/usr/bin/env node

var columnify = require('columnify')
var program = require('commander')
var bytes = require('pretty-bytes')

var renderConsole = require('../lib/render-console')
var renderJSON = require('../lib/render-json')
var pkgcount = require('../')

program
  .version(require('../package.json').version)
  .option('-m, --min [count]', 'only list packages duplicated at least this number of times')
  .option('-d, --duplicates', 'only list packages appearing more than once')
  .option('-D, --du', 'show disk usage')
  .option('--json', 'display json output')
  .option('--no-color', 'display uncolored output. Colors indicate packages with high levels of duplication')
  .option('--paths', 'list paths to each package instead of counts')
  .option('--summary', 'only display summary')
  .option('--depth [depth]', 'limit traversal depth')
  .option('-s, --sort [key]', 'Sort results by (name|duplicates|size) [duplicates]')
  .parse(process.argv);

var names = program.args
var dir = process.cwd()
if (program.duplicates) program.min = program.min || 1
if (program.sort === 'size') program.sort = 'totalSize'

pkgcount(dir, program, function(err, allPkgs) {
  if (err) throw err
  console.error("")
  var pkgs = allPkgs

  if (names.length) pkgs = pkgs.filter(function(pkg) {
    return names.indexOf(pkg.name) !== -1
  })

  if (program.min) pkgs = pkgs.filter(function(pkg) {
    return pkg.duplicates > program.min
  })

  var total = getTotal(allPkgs)
  var unique = allPkgs.length
  var duplicate = total - unique
  var pkgDepth = depth(dir, allPkgs)
  var summary = [
    {
      key: 'total',
      title: 'Total Pkgs',
      percent: '',
      value: total
    },
    {
      key: 'unique',
      title: 'Unique Pkgs',
      percent: percent(unique/total),
      value: unique
    },

    {
      key: 'duplicate',
      title: 'Duplicate Pkgs',
      percent: percent(duplicate/total),
      value: duplicate
    },
    {
      key: 'depth',
      title: 'Max. Depth',
      percent: '',
      value: pkgDepth
    }
  ]

  if (program.du) {
    var totalSpace = getTotalSpace(allPkgs)
    var wastedSpace = getWastedSpace(allPkgs)
    summary.push({
      key: 'totalSize',
      title: 'Total Size',
      percent: '',
      value: "~" + bytes(totalSpace)
    })
    summary.push({
      key: 'duplicateSize',
      title: 'Duplicate Size',
      percent: percent(wastedSpace/totalSpace),
      value: "~" + bytes(wastedSpace)
    })
  }

  if (program.json) {
    if (program.summary) pkgs = summary
    var result = program.color ? renderJSON.color(pkgs, program) : renderJSON(pkgs, program)
    console.log(result)
    return
  } else {
    if (!program.summary) {
      var result = program.color ? renderConsole.color(pkgs, program) : renderConsole(pkgs, program)
      console.log(result)
    }
  }
  var summaryOutput = columnify(summary, {
    minWidth: 3,
    columnSplitter: '  ',
    headingTransform: function(heading) {
      if (heading === 'title') return ''
      if (heading === 'value') return ''
      if (heading === 'percent') return ''
    },
    columns: ['title', 'value', 'percent'],
    config: {
      title: {align: 'left'}
    }
  })
  console.log("\nPKGCOUNT SUMMARY%s", summaryOutput)
})

function getTotal(pkgs) {
  return pkgs.reduce(function(total, pkg) {
    return total + pkg.duplicates
  }, 0)
}

function getWastedSpace(pkgs) {
  return pkgs.reduce(function(total, pkg) {
    return total + pkg.size * (pkg.duplicates - 1)
  }, 0)
}

function getTotalSpace(pkgs) {
  return pkgs.reduce(function(total, pkg) {
    return total + pkg.totalSize
  }, 0)
}

function duplicate(pkgs) {
  return total(paths) - unique(paths)
}

function depth(dir, pkgs) {
  return pkgs.reduce(function(max, pkg) {
    return Math.max(max, pkg.paths.reduce(function(pathMax, path) {
      return Math.max(pathMax, pkgcount.depth(dir, path))
    }, 0))
  }, 0)
}

function percent(amount) {
  return (Math.round(amount * 100)) + '%'
}

function invertKV(obj){
  var result = {}
  for (var key in obj) {
    var value = obj[key]
    result[value] = key
  }
  return result
}
