# pkgcount

Report number of duplicate packages are installed.

## Examples

#### timoxley/pkgcount

```
> pkgcount

NAME                   COUNT
ansi-highlight@1.0.2   1
ansi-styles@1.0.0      1
chalk@0.4.0            1
clone@0.1.15           1
colors@0.6.2           1
columnify@1.1.0        1
commander@2.2.0        1
continuable-hash@0.1.4 1
continuable-list@0.1.6 1
continuable-para@1.2.0 1
continuable@1.1.8      1
deep-extend@0.2.8      1
defaults@1.0.0         1
has-color@0.1.7        1
ini@1.1.0              1
js-tokenizer@1.3.1     1
minimist@0.0.9         2
mkdirp@0.3.5           1
npmd-config@1.0.11     1
npmd-tree@3.3.4        1
optimist@0.6.1         1
osenv@0.0.3            1
pkg-count@0.0.0        1
pull-core@1.0.0        1
pull-fs@1.1.3          1
pull-paramap@1.0.5     1
pull-split@0.1.2       1
pull-stream@2.20.0     1
pull-through@1.0.12    1
rc@0.3.5               1
strip-ansi@0.1.1       1
strip-ansi@0.2.1       1
to-camel-case@0.2.1    1
to-no-case@0.1.1       1
to-space-case@0.1.2    1
underscore@1.6.0       1
wcwidth.js@0.0.4       1
wordwrap@0.0.2         1

SUMMARY
1   Duplicate Packages
8   Max. Nesting Depth
38  Unique Packages
39  Total Packages
```

### rvagg/workshopper
```
> pkgcount

NAME                      COUNT
bl@0.4.1                  1
charm@0.1.2               1
colors-tmpl@0.1.0         1
colors@0.6.2              2
consoul@0.0.1             1
inherits@2.0.1            1
map-async@0.1.1           1
marked@0.2.9              1
minimist@0.0.4            1
mkdirp@0.3.5              1
object-keys@0.4.0         1
optimist@0.6.0            1
pygmentize-bundled@2.1.0  1
readable-stream@1.0.17    1
resumer@0.0.0             1
split@0.2.10              1
terminal-menu@0.1.0       1
through2@0.2.1            1
through@2.3.4             1
tuple-stream@0.0.2        1
wordwrap@0.0.2            1
workshopper@1.0.0-alpha07 1
xtend@2.1.1               1

SUMMARY
1   Duplicate Packages
4   Max. Nesting Depth
23  Unique Packages
24  Total Packages
```

### substack/node-browserify

```
> pkgcount --duplicates

NAME                               COUNT
JSONStream@0.6.4                   2
amdefine@0.1.0                     5
convert-source-map@0.3.3           2
core-util-is@1.0.1                 2
esprima-fb@3001.1.0-dev-harmony-fb 4
esprima@1.0.4                      3
estraverse@1.5.0                   2
inherits@2.0.1                     2
isarray@0.0.1                      2
jsonparse@0.0.5                    3
minimist@0.0.8                     3
optimist@0.3.7                     2
process@0.5.2                      2
source-map@0.1.33                  5
string_decoder@0.10.25-1           2
through@2.2.7                      3
traverse@0.6.6                     3
wordwrap@0.0.2                     2

SUMMARY
18  Unique Packages
21  Max. Nesting Depth
31  Duplicate Packages
49  Total Packages
```

### mikeal/request

```
> pkgcount --summary

SUMMARY
0   Duplicate Packages
3   Max. Nesting Depth
24  Total Packages
```

```
> pkg-count --summary --json --no-color

{
  "unique": 24,
  "total": 24,
  "duplicate": 0,
  "depth": 3
}
```

### chjj/marked

```
> pkgcount --paths

NAME             PATHS
abbrev@1.0.4     /Users/timoxley/Projects/libs/marked/node_modules/markdown/node_modules/nopt/node_modules/abbrev
markdown@0.5.0   /Users/timoxley/Projects/libs/marked/node_modules/markdown
marked@0.3.2     /Users/timoxley/Projects/libs/marked
nopt@2.1.2       /Users/timoxley/Projects/libs/marked/node_modules/markdown/node_modules/nopt
robotskirt@2.7.1 /Users/timoxley/Projects/libs/marked/node_modules/robotskirt
showdown@0.3.1   /Users/timoxley/Projects/libs/marked/node_modules/showdown

SUMMARY
0   Duplicate Packages
3   Max. Nesting Depth
6   Total Packages
```

## License

MIT
