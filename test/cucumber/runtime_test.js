var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var Runtime = require('../../lib/cucumber/runtime');

describe("Runtime", function () {
  describe("#execute", function () {
    it("returns 1 when there is a failing test case", function () {
      var failedTestCase = {
        execute: function (eventEmitter) {
          var failedStep = {
            status: 'failed'
          };
          eventEmitter.emit('step-finished', failedStep);
        }
      };
      var runtime = new Runtime([failedTestCase]);
      var exitStatus = runtime.execute(new EventEmitter());
      assert.equal(exitStatus, 1);
    });

    it("returns 0 when all test cases are passing", function () {
      var passedTestCase = {
        execute: function (eventEmitter) {
          var passedStep = {
            result: {status: 'passed'}
          };
          eventEmitter.emit('step-finished', passedStep);
        }
      };

      var runtime = new Runtime([passedTestCase]);
      var exitStatus = runtime.execute(new EventEmitter());
      assert.equal(exitStatus, 0);
    });
  });
});
