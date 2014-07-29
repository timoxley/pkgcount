"use strict"

var tree = require('npmd-tree').tree
var relative = require('path').relative
var defaults = require('defaults')

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
  tree(dir, {post: function (pkg, cb) {
    if (depth(dir, pkg.path) > options.depth) return cb()
    var key = pkg.name + '@' + pkg.version
    paths[key] = paths[key] || []
    if (paths[key].indexOf(pkg.path) == -1) paths[key].push(pkg.path)
    cb()
  }}, function (err, tree) {
    if (err) return fn(err)
    console.log('options.sortKey', options.sortKey)
    return (
      options.sortKey == 'duplicates'
      ? fn(null, sortValues(paths))
      : fn(null, sortKeys(paths))
    )
  })
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
