"use strict"

var tree = require('read-installed')
var relative = require('path').relative
var defaults = require('defaults')
var map = require('map-limit')
var du = require('du')
var path = require('path')

var DEFAULTS = {
  depth: Infinity,
  sort: 'duplicates'
}

module.exports = function(dir, options, fn) {
  if (!fn) {
    fn = options
    options = {}
  }
  options = options || {}
  options = defaults(options, DEFAULTS)
  if (options.depth === 0) options.depth = Infinity
  pkgcount(dir, options, function(err, pkgPaths) {
    if (err) return fn(err)
    if (!options.du) return sort(null, pkgPaths)
    getDiskUsage(pkgPaths, options, sort)
  })

  function sort(err, pkgPaths) {
    if (err) return fn(err)
    return fn(null, pkgPaths.sort(sortBy(options.sort)))
  }
}

function pkgcount(dir, options, fn) {
  var pkgSet = {}
  tree(dir, {depth: options.depth}, function (err, pkg) {
    if (err) return fn(err)
    var deps = getDependencies(pkg, options.depth)
    map(deps, 30, function(pkg, next) {
      var key = pkg.name + '@' + pkg.version
      pkgSet[key] = pkgSet[key] || {
        key: key,
        name: pkg.name,
        version: pkg.version,
        depth: pkg.depth,
        paths: []
      }
      if (pkgSet[key].paths.indexOf(pkg.realPath) === -1) pkgSet[key].paths.push(pkg.realPath)
      next()
    }, function(err) {
      if (err) return fn(err, [])
      var pkgPaths = Object.keys(pkgSet).map(function(key) {
        return pkgSet[key]
      }).map(function(pkgPath) {
        pkgPath.paths = pkgPath.paths.map(function(pth) {
          return path.relative(dir, pth)
        })
        pkgPath.duplicates = pkgPath.paths.length
        return pkgPath
      })
      if (options.noSelf) pkgPaths = pkgPaths.filter(function(pkgPath) {
        return pkgPath.duplicates
      })
      fn(null, pkgPaths)
    })
  })
}

function find(arr, fn) {
  return arr.filter(fn).pop()
}

function getDependencies(pkg, maxDepth, _results) {
  _results = _results || []
  if (!pkg || typeof pkg !== 'object') return _results
  if (_results.indexOf(pkg) !== -1) return _results
  if (pkg.depth > maxDepth) return _results
  _results.push(pkg)
  var dependencies = pkg.dependencies
  if (!dependencies) return []
  var keys = Object.keys(dependencies)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var dep = dependencies[key]
    getDependencies(dep, maxDepth, _results)
  }
  return _results
}

module.exports.depth = depth

function getDiskUsage(pkgPaths, options, fn) {
  options = options || {}
  map(pkgPaths, 15, function(pkg, next) {
    var testPath = pkg.paths[0]
    if (!testPath) testPath = '.'
    diskUsage(testPath, function(err, size) {
      if (err) return next(err)
      pkg.size = size
      pkg.totalSize = size * pkg.duplicates
      return next(null, pkg)
    })
  }, fn)
}

function diskUsage(pkgRoot, fn) {
  du(pkgRoot, {
    disk: true,
    filter: function (f) {
      return !(/^node_modules|\.git|^\.\/node_modules/.test(relative(pkgRoot, f)))
    }
  }, fn)
}

function depth(dir, path) {
  return relative(dir, path).split(/\/node_modules\//).length
}

function sortBy(key) {
  return function(a, b) {
    if (typeof a[key] === 'string') {
      return a[key].localeCompare(b[key])
    } else {
      return a[key] - b[key]
    }
  }
}
