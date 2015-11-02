## Code coverage

Just run the tests:

    npm test

The build will fail if coverage drops below 100%.
The report is in `coverage/lcov-report/index.html`.

## Counting Source Lines of Code (SLOC)

See how big it is:

    npm run sloc

Make sure it's not too big:

    npm run sloccheck

## Design philosophy

* Single public method per class - makes it easier to translate to functional languages. Also good OO desing.
* Losely coupled. Most classes require 0 or 1 other classes. None require more than 2. Supports open-closed principle.

## TODO

* [x] Support promises
* [ ] Support callbacks
* [ ] Support DocStrings and DataTables
* [ ] Hooks (should just be API sugar for events)
* [ ] Tagged hooks
* [ ] Progress formatter
* [ ] Summary reporter: all errors and count summary. (skip all errors if using pretty formatter to same stream)
* [ ] Pretty formatter (improve so it doesn't print filtered away stuff)
* [ ] Compact size
  * Remove toString from bool nodes
* [ ] Add Markdown support in Gherkin3 and in pretty formatter
* [ ] i18n stepdef API

## Maybe

* --profile - if we do it, do it suites style
* --order
* Filter by line in tag/step/docstring/data table

## Out of scope

* Print snippets
* Dry run (who uses that anyway)
* Turn off colour (--no-color)
* --name filter (who needs that when we have line and tags)
* --out - let's use plugin:out format instead
* --i18n - refer to online docs instead
* --fail-fast - nice feature, but not needed in microcuke
* --init
* --exclude - WTF didn't even know we had that
* --no-multiline - more YAGNI
* --strict
* --guess STUPID
* --expand STUPID TOO
* --version
* --help