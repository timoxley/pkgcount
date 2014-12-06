"use strict"

var tree = require('read-installed')
var relative = require('path').relative
var defaults = require('defaults')
var map = require('map-limit')

var DEFAULTS = {
  depth: Infinity,
  sortKey: 'name'
}

module.exports = function(dir, options, fn) {
  if (!fn) {
    fn = options
    options = {}
  }
  options = options || {}
  options = defaults(options, DEFAULTS)
  if (options.depth === 0) options.depth = Infinity
  return pkgcount(dir, options, fn)
}

function pkgcount(dir, options, fn) {
  var paths = {}
  tree(dir, {depth: options.depth}, function (err, pkg) {
    if (err) return fn(err)
    var deps = getDependencies(pkg)
    map(deps, 1, function(pkg, next) {
      var key = pkg.name + '@' + pkg.version
      paths[key] = paths[key] || []
      if (paths[key].indexOf(pkg.realPath) == -1) paths[key].push(pkg.realPath)
      next()
    }, function(err) {
      if (err) return fn(err)
      options.sortKey == 'duplicates'
      ? fn(null, sortValues(paths))
      : fn(null, sortKeys(paths))
    })
  })
}

function getDependencies(pkg, _results) {
  _results = _results || []
  if (!pkg) return _results
  if (_results.indexOf(pkg) !== -1) return _results
  _results.push(pkg)
  var dependencies = pkg.dependencies
  if (!dependencies) return []
  var keys = Object.keys(dependencies)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var dep = dependencies[key]
    getDependencies(dep, _results)
  }
  return _results
}

module.exports.depth = depth

function depth(dir, path) {
  return relative(dir, path).split('node_modules').length - 1
}

function sortKeys(obj) {
  var keys = Object.keys(obj).sort()
  return keys.reduce(function(result, key) {
    result[key] = obj[key]
    return result
  }, {})
}

function sortValues(obj) {
  var keys = Object.keys(obj).sort(function(a, b) {
    return obj[a].length - obj[b].length
  })
  return keys.reduce(function(result, key) {
    result[key] = obj[key]
    return result
  }, {})
}
