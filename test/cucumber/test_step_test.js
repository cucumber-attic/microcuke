var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var TestStep = require('../../lib/cucumber/test_step');

describe("TestStep", function () {
  describe("#execute", function () {
    it("fires an event with status=unknown when a step is executed", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], function () {
      });

      var eventEmitter = new EventEmitter();
      var step;
      eventEmitter.on('step-started', function (_step) {
        step = _step;
      });

      var world = {};
      testStep.execute(world, eventEmitter);
      assert.equal(step.status, 'unknown');
    });

    it("fires an event with status=failed when an exception is thrown", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], function () {
        throw new Error("sad trombone");
      });

      var eventEmitter = new EventEmitter();
      var step;
      eventEmitter.on('step-finished', function (_step) {
        step = _step;
      });

      var world = {};
      testStep.execute(world, eventEmitter);
      assert.equal(step.status, 'failed');
    });

    it("fires an event with status=passed when no exception is thrown", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], function () {
      });

      var eventEmitter = new EventEmitter();
      var step;
      eventEmitter.on('step-finished', function (_step) {
        step = _step;
      });

      var world = {};
      testStep.execute(world, eventEmitter);
      assert.equal(step.status, 'passed');
    });

    it("passes argument values to body function", function () {
      var arg;

      var locations = [];
      var matchedArguments = [{value: 'hello'}];
      var testStep = new TestStep(locations, matchedArguments, function (_arg) {
        arg = _arg;
      });

      var eventEmitter = new EventEmitter();
      var world = {};
      testStep.execute(world, eventEmitter);
      assert.equal(arg, 'hello');
    });
  });
});
