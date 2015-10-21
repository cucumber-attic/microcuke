var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var Config = require('../../lib/cucumber/config');

var stubGlueLoader = {
  loadGlue: function () {
    return {
      createTestSteps: function () {
        return [
          {
            execute: function (eventEmitter) {
              eventEmitter.emit('step-started');
            }
          }
        ];
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

      var testCases = config.buildTestCases(stubGlueLoader, gherkinLoader);
      var eventEmitter = new EventEmitter();

      var stepExecuted = false;
      eventEmitter.on('step-started', function () {
        stepExecuted = true;
      });

      testCases[0].execute(eventEmitter);

      assert.ok(stepExecuted, true);
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

      var testCases = config.buildTestCases(stubGlueLoader, gherkinLoader);
      assert.equal(testCases.length, 2);
    });
  });
});
