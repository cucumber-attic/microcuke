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
      eventEmitter.on('step-started', function (_step) {
        assert.equal(_step.status, 'unknown');
      });

      var world = {};
      testStep.execute(world, eventEmitter, true);
    });

    it("fires an event with status=failed when a test does not pass", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], function () {
        throw Error("sad trombone");
      });

      var eventEmitter = new EventEmitter();
      eventEmitter.on('step-finished', function (_step) {
        assert.equal(_step.status, 'failed')
      });
      var world = {};
      testStep.execute(world, eventEmitter, true);
    });

    it("fires an event with status=failed when an exception is thrown", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], function () {
        throw new Error("sad trombone");
      });

      var eventEmitter = new EventEmitter();
      eventEmitter.on('step-finished', function (_step) {
        assert.equal(_step.status, 'failed');
      });

      var world = {};
      return testStep.execute(world, eventEmitter, true);
    });

    it("fires an event with status=skipped when the run parameter is false", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], function () {
        throw new Error("sad trombone");
      });

      var eventEmitter = new EventEmitter();
      eventEmitter.on('step-finished', function (_step) {
        assert.equal(_step.status, 'skipped');
      });

      var world = {};
      return testStep.execute(world, eventEmitter, false);
    });

    it("fires an event with status=passed when no exception is thrown", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], function () {
        var a = 0;
        return a
      });

      var eventEmitter = new EventEmitter();
      eventEmitter.on('step-finished', function (_step) {
        try { assert.equal(_step.status, 'passed'); }
        catch (err) {
          console.error(err)
          console.error('step was:\n')
          console.error(_step)
        }
      });

      var world = {};
      testStep.execute(world, eventEmitter, true);
    });

    it("fires an event with status=undefined when no body exists", function () {
      var locations = [];
      var testStep = new TestStep(locations, [], null);

      var eventEmitter = new EventEmitter();
      eventEmitter.on('step-finished', function (_step) {
        step = _step;
        assert.equal(step.status, 'undefined', true);
      });

      var world = {};
      testStep.execute(world, eventEmitter, true);
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
