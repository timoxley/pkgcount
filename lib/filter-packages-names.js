"use strict"

module.exports = function nameFilter(paths, names) {
  var validKeys = []
  if (!names.length) return paths
  names.forEach(function(name) {
    var version = name.split('@')[1]
    validKeys = validKeys.concat(Object.keys(paths).filter(function(key) {
      if (!version) return key.split('@')[0].indexOf(name) !== -1
      else return key == name
    }))
  })
  return validKeys.reduce(function(result, key) {
    result[key] = result[key] || paths[key]
    return result
  }, {})
}
