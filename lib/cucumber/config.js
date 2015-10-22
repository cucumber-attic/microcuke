var Gherkin = require('gherkin');
var TestCase = require('./test_case');

module.exports = function Config() {
  var parser = new Gherkin.Parser();
  var compiler = new Gherkin.Compiler();

  this.buildTestCases = function (glue, gherkinLoader) {
    var pickles = [];

    gherkinLoader.loadGherkinFiles().forEach(function (gherkinFile) {
      var feature = parser.parse(gherkinFile.read());
      pickles = pickles.concat(compiler.compile(feature));
    });
    return pickles.map(function (pickle) {
      return glue.createTestCase(pickle);
    });
  }
};