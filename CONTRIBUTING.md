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

## TODO

* Hooks (should just be API sugar for events)
* Tagged hooks
* Progress formatter
* Summary reporter: all errors and count summary. (skip all errors if using pretty formatter to same stream)
* Pretty formatter (improve so it doesn't print filtered away stuff)
* Compact size
  * Remove toString from bool nodes
* Add Markdown support in Gherkin3 and in pretty formatter
* i18n stepdef API