"use strict"

// convert:
// {
//   pkgA@1.0.0: [/path/to/pkgA, /path/to/otherpkgA],
//   pkgB@1.0.0: [/path/to/pkgB]
// }
//
// into:
// {
//   pkgA@1.0.0: 2
//   pkgB@1.0.0: 1
// }

module.exports = function(paths) {
  var result = {}
  for (var key in paths) {
    result[key] = paths[key].length
  }
  return result
}
