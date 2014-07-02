"use strict"

module.exports = function nameFilter(paths, min) {
  min = min || 0
  var result = {}
  for (var key in paths) {
    var count = paths[key].length
    if (count < min) continue
    result[key] = paths[key]
  }
  return result
}
