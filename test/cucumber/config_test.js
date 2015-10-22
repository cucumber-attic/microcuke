var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var Config = require('../../lib/cucumber/config');

var stubGlue = {
  createTestCase: function () {
    return {
      execute: function (eventEmitter) {
        eventEmitter.emit('scenario-started');
      }
    };
  }
};

function stubGherkinLoader(gherkin) {
  return {
    loadGherkinFiles: function () {
      return [{
        path: 'features/hello.feature',
        read: function () {
          return gherkin;
        }
      }];
    }
  };
}

describe("Config", function () {
  describe("#build", function () {
    it("builds executable TestCase object from Gherkin sources and Glue code", function () {
      var config = new Config();

      var gherkinLoader = stubGherkinLoader("" +
        "Feature: Hello\n" +
        "  Scenario: first\n" +
        "    Then this should pass\n"
      );

      var testCases = config.buildTestCases(stubGlue, gherkinLoader);
      var eventEmitter = new EventEmitter();

      var scenarioStarted = false;
      eventEmitter.on('scenario-started', function () {
        scenarioStarted = true;
      });

      testCases[0].execute(eventEmitter);

      assert.ok(scenarioStarted, true);
    });

    it("builds 2 TestCase objects from Gherkin sources and Glue code", function () {
      var config = new Config();

      var gherkinLoader = stubGherkinLoader("" +
        "Feature: Hello\n" +
        "  Scenario: first\n" +
        "    Then this should pass\n" +
        "\n" +
        "  Scenario: second\n" +
        "    Then this should pass\n"
      );

      var testCases = config.buildTestCases(stubGlue, gherkinLoader);
      assert.equal(testCases.length, 2);
    });
  });
});
