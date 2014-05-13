var highlight = require('ansi-highlight')

module.exports = function(paths, opts) {
  opts = opts || {}
  if (!opts.paths && !opts.summary) paths = Object.keys(paths).reduce(function(result, key) {
    result[key] = paths[key].length
    return result
  }, {})

  return JSON.stringify(paths, null, 2)
}

module.exports.color = function(paths, opts) {
  return highlight(module.exports(paths, opts))
}
