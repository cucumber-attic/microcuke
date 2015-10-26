var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var Gherkin = require('gherkin');
var Glue = require('../../lib/cucumber/glue');

function compile(gherkin) {
  var parser = new Gherkin.Parser();
  var compiler = new Gherkin.Compiler();
  return compiler.compile(parser.parse(gherkin));
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
              }
            };
          }
        }
      ];
      var glue = new Glue(stepDefinitions);
      var pickle = compile("Feature: hello\n  Scenario: hello\n    Given this is defined")[0];
      var testCase = glue.createTestCase(pickle);

      assert(!executed);
      testCase.execute(new EventEmitter());
      assert(executed);
    });

    it("creates an undefined step when no stepdefs match", function () {
      var glue = new Glue([{
        createTestStep: function (pickleStep) {
          return null;
        }
      }]);
      var pickle = compile("Feature: hello\n  Scenario: hello\n    Given this is defined")[0];
      var testCase = glue.createTestCase(pickle);

      var eventEmitter = new EventEmitter();
      var finished = false;
      eventEmitter.on('step-finished', function (step) {
        finished = true;
        assert.equal(step.status, 'undefined');
        assert.deepEqual(step.location, {line: 3, column: 11});
      });
      testCase.execute(eventEmitter);
      assert.ok(finished);
    });

    it("throws an exception when two stepdefs match", function () {
      var glue = new Glue([
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
      ]);
      var pickle = compile("Feature: hello\n  Scenario: hello\n    Given this is defined")[0];
      try {
        glue.createTestCase(pickle);
        throw new Error("Expected error");
      } catch (err) {
        // TODO: Error message should have details/location about the step as well as the ambiguous step defs
        assert.equal(err.message, "Ambiguous match");
      }
    });
  });
});
