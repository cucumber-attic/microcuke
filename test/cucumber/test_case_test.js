var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var TestCase = require('../../lib/cucumber/test_case');

describe("TestCase", function () {
  describe("#execute", function () {
    it("tells next step to run when the previous one passed", function () {
      var done = false;
      var pickle = {
        path: 'features/test.feature',
        locations: []
      };
      var testSteps = [
        {
          execute: function (world, eventEmitter, run) {
            return true;
          }
        },
        {
          execute: function (world, eventEmitter, run) {
            done = true;
            assert(run === true);
            return true;
          }
        }
      ];
      var testCase = new TestCase(pickle, testSteps);

      testCase.execute(new EventEmitter());
      assert(done === true);
    });

    it("uses the same 'this' object across steps", function () {
      var done = false;
      var pickle = {
        path: 'features/test.feature',
        locations: []
      };
      var testSteps = [
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
            return true;
          }
        }
      ];
      var testCase = new TestCase(pickle, testSteps);

      testCase.execute(new EventEmitter());
      assert(done === true);
    });

    it("tells next step to not run when previous one failed", function () {
      var done = false;
      var pickle = {
        path: 'features/test.feature',
        locations: []
      };
      var testSteps = [
        {
          execute: function (world, eventEmitter, run) {
            return false;
          }
        },
        {
          execute: function (world, eventEmitter, run) {
            done = true;
            assert(!run);
            return false;
          }
        }
      ];
      var testCase = new TestCase(pickle, testSteps);

      testCase.execute(new EventEmitter());
      assert(done === true);
    });
  });
});
