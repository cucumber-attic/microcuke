var assert = require('assert');
var TestCase = require('../../lib/cucumber/test_case');

describe("TestCase", function () {
  describe("#execute", function () {
    it("tells next step to run when the previous one passed", function () {
      var done = false;
      var testCase = new TestCase([
        {
          execute: function (world, eventEmitter, run) {
            return true;
          }
        },
        {
          execute: function (world, eventEmitter, run) {
            done = true;
            assert(run);
          }
        }
      ]);

      testCase.execute(null);
      assert(done);
    });

    it("uses the same this object across steps", function () {
      var done = false;
      var testCase = new TestCase([
        {
          execute: function (world, eventEmitter, run) {
            world.bingo = 'yes';
            return true;
          }
        },
        {
          execute: function (world, eventEmitter, run) {
            done = true;
            assert.equal(world.bingo, 'yes');
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
          execute: function (world, eventEmitter, run) {
            return false;
          }
        },
        {
          execute: function (world, eventEmitter, run) {
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
