var assert = require('assert');
var Config = require('../../lib/cucumber/config');

describe("Config", function () {
  it("builds TestCase objects from Gherkin sources and Glue code", function () {
    var config = new Config();

    var glueLoader = function() {

    };

    var gherkinLoader = function() {

    };

    var testCases = config.buildTestCases(glueLoader, gherkinLoader);
    assert.equal(testCases.length, 1);
  })
});
