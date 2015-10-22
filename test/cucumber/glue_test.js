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
      testCase.execute();
      assert(executed);
    });
  });
});
