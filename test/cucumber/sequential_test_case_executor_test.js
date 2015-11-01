var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var SequentialTestCaseExecutor = require('../../lib/cucumber/sequential_test_case_executor');

describe("Runtime", function () {
  describe("#execute", function () {
    it("runs test cases in sequence", function () {
      var order = [];
      var tc1 = {
        execute: function (eventEmitter) {
          order.push(1);
          return Promise.resolve();
        }
      };
      var tc2 = {
        execute: function (eventEmitter) {
          order.push(2);
          return Promise.resolve();
        }
      };

      var runtime = new SequentialTestCaseExecutor([tc1, tc2]);
      return runtime.execute(new EventEmitter())
        .then(function () {
          assert.deepEqual(order, [1, 2]);
        });
    });
  });
});
