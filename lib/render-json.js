var highlight = require('ansi-highlight')

module.exports = function(pkgs, opts) {
  opts = opts || {}
  if (!opts.paths) pkgs = pkgs.map(function(pkg) {
    delete pkg.paths
    return pkg
  }, {})

  return JSON.stringify(pkgs, null, 2)
}

module.exports.color = function(paths, opts) {
  return highlight(module.exports(paths, opts))
}
