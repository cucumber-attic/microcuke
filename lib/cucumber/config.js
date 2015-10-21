var TestCase = require('./test_case');

module.exports = function Config() {
  this.buildTestCases = function (glueLoader, gherkinLoader) {
    return [new TestCase()];
  }
};