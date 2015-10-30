var assert = require('assert');
var Hook = require('../../lib/cucumber/hook');

describe("Hook", function () {
  describe("#createTestStep", function () {
    it("returns null when the hook's tag expression doesn't match the pickle's tags");

    it("returns a TestStep when there is no tag expression", function () {
      var hook = new Hook(function () {
      });

      var pickle = {};
      var testStep = hook.createTestStep(pickle);
      assert.ok(testStep);
    });
  });
});
