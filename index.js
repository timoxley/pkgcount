"use strict"

var tree = require('read-installed')
var relative = require('path').relative
var defaults = require('defaults')
var map = require('map-limit')
var du = require('du')
var path = require('path')
var read = require('installed')

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
  read(dir, {depth: options.depth}, function(err, deps) {
    if (err) return fn(err)
    var pkgSet = deps.reduce(function(pkgSet, pkg) {
      var key = pkg.name + '@' + pkg.version
      pkgSet[key] = pkgSet[key] || {
        key: key,
        name: pkg.name,
        version: pkg.version,
        depth: pkg.depth,
        paths: []
      }
      if (pkgSet[key].paths.indexOf(pkg.realPath) === -1) pkgSet[key].paths.push(pkg.realPath)
      return pkgSet
    }, {})

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
}

function find(arr, fn) {
  return arr.filter(fn).pop()
}

module.exports.depth = depth

function getDiskUsage(pkgPaths, options, fn) {
  options = options || {}
  map(pkgPaths, 100, function(pkg, next) {
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
      return !(/^node_modules|^\.git|^\.\/node_modules/.test(relative(pkgRoot, f)))
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

function assign(target, firstSource) {
  if (target === undefined || target === null)
    throw new TypeError("Cannot convert first argument to object");
  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) continue;
    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
    }
  }
  return to;
}
