# pkgcount

Easily see how many packages, which versions and how many copies of each package are installed in your node_modules hierarchy.

## Installation

```
npm install -g pkgcount
```

## Usage

```
> pkgcount --help

  Usage: pkgcount [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -m, --min [count]  only list packages duplicated at least this number of times
    -d, --duplicates   only list packages appearing more than once
    -D, --du           show disk usage
    --json             display json output
    --no-color         display uncolored output. Colors indicate packages with high levels of duplication
    --paths            list paths to each package instead of counts
    --summary          only display summary
    --depth [depth]    limit traversal depth
    -s, --sort [key]   Sort results by (name|duplicates|size) [duplicates]
```

By default, `pkgcount` uses coloured output as a simple visual aide to
help identify packages with high levels of duplication. Packages are
shaded from yellow->red based on the number of duplicates.

## Examples

### List All Packages

#### timoxley/pkgcount

```
> pkgcount

PACKAGE                              #
pkgcount@2.0.0                       1
util-extend@1.0.1                    1
js-tokenizer@1.3.1                   1
colors@0.6.2                         1
chalk@0.5.1                          1
ansi-styles@1.1.0                    1
escape-string-regexp@1.0.2           1
has-ansi@0.1.0                       1
slide@1.1.6                          1
strip-ansi@0.3.0                     1
supports-color@0.2.0                 1
columnify@1.3.2                      1
strip-ansi@2.0.0                     1
ansi-regex@1.1.0                     1
wcwidth@1.0.0                        1
defaults@1.0.0                       1
clone@0.1.15                         1
commander@2.2.0                      1
du@0.1.0                             1
async@0.1.22                         1
json-stringify-safe@5.0.0            1
map-limit@0.0.1                      1
graceful-fs@3.0.5                    1
ansi-highlight@1.0.2                 1
pretty-bytes@1.0.1                   1
get-stdin@1.0.0                      1
read-installed@3.1.3                 1
debuglog@1.0.1                       1
read-package-json@1.2.7              1
github-url-from-git@1.4.0            1
github-url-from-username-repo@1.0.2  1
glob@4.3.1                           1
inflight@1.0.4                       1
inherits@2.0.1                       1
minimatch@2.0.1                      1
brace-expansion@1.0.1                1
balanced-match@0.2.0                 1
concat-map@0.0.0                     1
lru-cache@2.5.0                      1
normalize-package-data@1.0.3         1
semver@4.1.0                         1
readdir-scoped-modules@1.0.1         1
dezalgo@1.0.1                        1
asap@1.0.0                           1
ansi-regex@0.2.1                     2
once@1.3.1                           3
wrappy@1.0.1                         5

PKGCOUNT SUMMARY
Total Pkgs      54
Unique Pkgs     47   87%
Duplicate Pkgs  7    13%
Max. Depth      6
```

### List Only Duplicates

#### substack/node-browserify

```
> pkgcount --duplicates

PACKAGE                   #
convert-source-map@0.3.5  2
indexof@0.0.1             2
JSONStream@0.7.4          2
wrappy@1.0.1              2
jsonify@0.0.0             2
acorn@0.9.0               2
hash.js@0.2.1             2
elliptic@0.15.15          2
path-platform@0.0.1       2
wordwrap@0.0.2            2
optimist@0.3.7            2
minimist@0.2.0            2
brorand@1.0.5             3
through2@0.5.1            3
jsonparse@0.0.5           3
traverse@0.6.6            3
bn.js@0.15.2              3
readable-stream@1.1.13    4
source-map@0.1.40         4
amdefine@0.1.0            5
core-util-is@1.0.1        5

PKGCOUNT SUMMARY
Total Pkgs      211
Unique Pkgs     175  83%
Duplicate Pkgs  36   17%
Max. Depth      5
```

### List Only Summary

#### mikeal/request

```
pkgcount --summary


PKGCOUNT SUMMARY
Total Pkgs      94
Unique Pkgs     86   91%
Duplicate Pkgs  8    9%
Max. Depth      6
```

### JSON Output & No Color Highlighting

All commands accept these flags.

```
> pkgcount --summary --json --no-color
```

### List Paths to Packages

Similar to npm ls --parseable.

#### chjj/marked

```
> pkgcount --paths

PACKAGE           paths
marked@0.3.2
robotskirt@2.7.1  node_modules/robotskirt
showdown@0.3.1    node_modules/showdown
markdown@0.5.0    node_modules/markdown
nopt@2.1.2        node_modules/markdown/node_modules/nopt
abbrev@1.0.5      node_modules/markdown/node_modules/nopt/node_modules/abbrev

PKGCOUNT SUMMARY

Total Pkgs      6
Unique Pkgs     6    100%
Duplicate Pkgs  0    0%
Max. Depth      3
```

### Limit Traversal Depth

```
> pkgcount --depth=1

PACKAGE           #
marked@0.3.2      1
robotskirt@2.7.1  1
showdown@0.3.1    1
markdown@0.5.0    1

PKGCOUNT SUMMARY
Total Pkgs      4
Unique Pkgs     4    100%
Duplicate Pkgs  0    0%
Max. Depth      1
```

## See Also

* [timoxley/pkgfiles](https://github.com/timoxley/pkgfiles)
* [timoxley/pkgrep](https://github.com/timoxley/pkgrep)

## License

MIT
