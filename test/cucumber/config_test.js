var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var Config = require('../../lib/cucumber/config');

describe("Config", function () {
  describe("#build", function () {
    it("builds executable TestCase object from Gherkin sources and Glue code", function () {
      var config = new Config();

      var loadGlue = function () {
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
      };

      var loadGherkinFiles = function () {
        return [{
          path: 'features/hello.feature',
          read: function() {
            return "" +
              "Feature: Hello\n" +
              "  Scenario: first\n" +
              "    Then this should pass"
          }
        }];
      };

      var testCases = config.buildTestCases(loadGlue, loadGherkinFiles);
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

      var loadGlue = function () {
        return {
          createTestSteps: function () {}
        };
      };

      var loadGherkinFiles = function () {
        return [{
          path: 'features/hello.feature',
          read: function() {
            return "" +
              "Feature: Hello\n" +
              "  Scenario: first\n" +
              "    Then this should pass\n" +
              "\n" +
              "  Scenario: second\n" +
              "    Then this should pass\n"
          }
        }];
      };

      var testCases = config.buildTestCases(loadGlue, loadGherkinFiles);
      assert.equal(testCases.length, 2);
    });
  });
});
