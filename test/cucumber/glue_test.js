var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var Gherkin = require('gherkin');
var Glue = require('../../lib/cucumber/glue');

function compile(gherkin) {
  var parser = new Gherkin.Parser();
  var compiler = new Gherkin.Compiler();
  return compiler.compile(parser.parse(gherkin), 'features/hello.feature');
}

describe("Glue", function () {
  describe("#createTestCase", function () {
    it("tells step definitions to create test steps from pickle steps", function () {
      var executed = false;
      var stepDefinitions = [
        {
          createTestStep: function (pickleStep) {
            assert.equal(pickleStep.text, 'this is defined');
            return {
              execute: function () {
                executed = true;
                return Promise.resolve();
              }
            };
          }
        }
      ];
      var glue = new Glue(stepDefinitions, []);
      var pickle = compile("Feature: hello\n  Scenario: hello\n    Given this is defined")[0];
      var testCase = glue.createTestCase(pickle);

      assert(!executed);
      return testCase.execute(new EventEmitter()).then(function () {
        assert(executed);
      });
    });

    it("creates an undefined step when no stepdefs match", function () {
      var stepDefinitions = [{
        createTestStep: function (pickleStep) {
          return null;
        }
      }];
      var glue = new Glue(stepDefinitions, []);
      var pickle = compile("Feature: hello\n  Scenario: hello\n    Given this is defined")[0];
      var testCase = glue.createTestCase(pickle);

      var eventEmitter = new EventEmitter();
      var finished = false;
      eventEmitter.on('step-finished', function (step) {
        finished = true;
        assert.equal(step.status, 'undefined');
        assert.deepEqual(step.gherkinLocation, {path: 'features/hello.feature', line: 3, column: 11});
      });
      return testCase.execute(eventEmitter)
        .then(function () {
          assert.ok(finished);
        });
    });

    it("throws an exception when two stepdefs match", function () {
      var stepDefinitions = [
        {
          createTestStep: function (pickleStep) {
            return {};
          }
        },
        {
          createTestStep: function (pickleStep) {
            return {};
          }
        }
      ];
      var glue = new Glue(stepDefinitions, []);
      var pickle = compile("Feature: hello\n  Scenario: hello\n    Given this is defined")[0];
      try {
        glue.createTestCase(pickle);
        throw new Error("Expected error");
      } catch (err) {
        // TODO: Error message should have details/location about the step as well as the ambiguous step defs
        assert.equal(err.message, "Ambiguous match");
      }
    });

    it("creates test cases with hooks", function () {
      var result = [];
      var stepDefinitions = [
        {
          createTestStep: function (pickleStep) {
            return {
              execute: function () {
                result.push('step');
                return Promise.resolve();
              }
            };
          }
        }
      ];

      var hooks = [
        {
          scope: 'before',
          createTestStep: function (pickle) {
            return {
              execute: function () {
                result.push('before')
                return Promise.resolve();
              }
            };
          }
        },
        {
          scope: 'after',
          createTestStep: function (pickle) {
            return {
              execute: function () {
                result.push('after');
                return Promise.resolve();
              }
            };
          }
        }
      ];
      var glue = new Glue(stepDefinitions, hooks);
      var pickle = compile("Feature: hello\n  Scenario: hello\n    Given this is defined")[0];
      var testCase = glue.createTestCase(pickle);

      assert.deepEqual(result, []);
      return testCase.execute(new EventEmitter()).then(function () {
        assert.deepEqual(result, ['before', 'step', 'after']);
      });
    });
  });
});
