var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var TestStep = require('../../lib/cucumber/test_step');

describe("TestStep", function () {
  describe("#execute", function () {
    it("fires an event with status=unknown before a step is executed", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], function () {
      });

      var eventEmitter = new EventEmitter();
      var step;
      eventEmitter.on('step-started', function (_step) {
        step = _step;
      });

      var world = {};
      testStep.execute(world, eventEmitter, true);
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
      var run = testStep.execute(world, eventEmitter, true);
      assert(!run);
      assert.equal(step.status, 'failed');
    });

    it("fires an event with status=skipped when the run parameter is false", function () {
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
      testStep.execute(world, eventEmitter, false);
      assert.equal(step.status, 'skipped');
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
      var run = testStep.execute(world, eventEmitter, true);
      assert(run);
      assert.equal(step.status, 'passed', true);
    });

    it("fires an event with status=undefined when no body exists", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], null);

      var eventEmitter = new EventEmitter();
      var step;
      eventEmitter.on('step-finished', function (_step) {
        step = _step;
      });

      var world = {};
      var run = testStep.execute(world, eventEmitter, true);
      assert(!run);
      assert.equal(step.status, 'undefined', true);
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
      testStep.execute(world, eventEmitter, true);
      assert.equal(arg, 'hello');
    });
  });
});
