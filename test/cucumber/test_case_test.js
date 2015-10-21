var assert = require('assert');
var TestCase = require('../../lib/cucumber/test_case');

describe("TestCase", function () {
  describe("#execute", function () {
    it("tells next step to run when the previous one passed", function () {
      var done = false;
      var testCase = new TestCase([
        {
          execute: function (eventEmitter, run) {
            return true;
          }
        },
        {
          execute: function (eventEmitter, run) {
            done = true;
            assert(run);
          }
        }
      ]);

      testCase.execute(null);
      assert(done);
    });

    it("tells next step to not run when previous one failed", function () {
      var done = false;
      var testCase = new TestCase([
        {
          execute: function (eventEmitter, run) {
            return false;
          }
        },
        {
          execute: function (eventEmitter, run) {
            done = true;
            assert(!run);
          }
        }
      ]);

      testCase.execute(null);
      assert(done);
    });
  });
});
