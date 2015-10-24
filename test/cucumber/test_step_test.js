var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var TestStep = require('../../lib/cucumber/test_step');

describe("TestStep", function () {
  describe("#execute", function () {
    it("fires an event with status=failed when an exception is thrown", function () {
      var testStep = new TestStep([], function () {
        throw new Error("sad trombone");
      });

      var eventEmitter = new EventEmitter();
      var step;
      eventEmitter.on('step-finished', function (_step) {
        step = _step;
      });

      testStep.execute(eventEmitter);
      assert.equal(step.status, 'failed');
    });

    it("fires an event with status=passed when no exception is thrown", function () {
      var testStep = new TestStep([], function () {
      });

      var eventEmitter = new EventEmitter();
      var step;
      eventEmitter.on('step-finished', function (_step) {
        step = _step;
      });

      testStep.execute(eventEmitter);
      assert.equal(step.status, 'passed');
    });
  });
});
