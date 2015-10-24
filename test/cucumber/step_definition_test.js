var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var StepDefinition = require('../../lib/cucumber/step_definition');

describe("StepDefinition", function () {
  describe("#createTestStep", function () {
    it("returns null when the regexp doesn't match the pickleStep's text", function () {
      var stepDefinition = new StepDefinition(/I have (\d+) cukes/, function (n) {
      });

      var pickleStep = {text: "wat"};
      var testStep = stepDefinition.createTestStep(pickleStep);
      assert.equal(testStep, null);
    });

    it("returns a TestStep when the regexp matches the pickleStep's text", function () {
      var stepDefinition = new StepDefinition(/I have (\d+) cukes/, function (n) {
      });

      var pickleStep = {text: "I have 44 cukes"};
      var testStep = stepDefinition.createTestStep(pickleStep);
      assert.ok(testStep);
    });

    it("creates a TestStep that passes captures to body function", function () {
      var n;
      var stepDefinition = new StepDefinition(/I have (\d+) cukes/, function (_n) {
        n = _n;
      });

      var pickleStep = {text: "I have 44 cukes"};
      var testStep = stepDefinition.createTestStep(pickleStep);
      testStep.execute(new EventEmitter());
      assert.equal(n, "44");
    });

    it("throws an error when the number of capture groups is different from the number of function parameters", function () {
      var stepDefinition = new StepDefinition(/I have (\d+) cukes/, function (n, wat) {
      });
      var pickleStep = {text: "I have 44 cukes"};
      try {
        stepDefinition.createTestStep(pickleStep);
        throw new Error("Expected error");
      } catch (err) {
        // TODO: Error message should say where the step definition is defined (file and line)
        assert.equal(err.message, "Arity mismatch. /I have (\\d+) cukes/ has 1 capture group(s), but the body function takes 2 argument(s)");
      }
    });
  });
});
