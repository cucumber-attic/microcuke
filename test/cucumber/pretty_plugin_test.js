var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var chalk = require('chalk');
var WritableStream = require('memory-streams').WritableStream;
var PrettyPlugin = require('../../lib/cucumber/pretty_plugin');

describe('PrettyPlugin', function () {
  var stdout, eventEmitter, scenario, step;

  beforeEach(function () {
    stdout = new WritableStream();
    var sourceReader = {
      // override the readSource method
      readSource: function (path) {
        return "" +
          "Feature: don't print this\n" +
          "  or this\n" +
          "\n" +
          "  Scenario: hello\n" +
          "\n" +
          "    Given I have 42 cukes\n";
      }
    };

    eventEmitter = new EventEmitter();
    new PrettyPlugin(stdout, sourceReader).subscribe(eventEmitter);

    scenario = {
      path: 'features/cukes.feature',
      location: {line: 4, column: 1}
    };

    step = {
      status: 'unknown',
      location: {line: 6, column: 11},
      matchedArguments: [
        {offset: 18, value: "42"}
      ]
    };

  });

  it("prints passing step as green", function () {
    eventEmitter.emit('scenario-started', scenario);
    eventEmitter.emit('step-started', step);

    step.status = 'passed';

    eventEmitter.emit('step-finished', step);

    var color = chalk.green;
    var expected = "  Scenario: hello\n\n" +
      color('    Given I have ') +
      color.bold('42') +
      color(' cukes') + "\n";
    assert.equal(stdout.toString(), expected);
  });

  it("prints failing step as red", function () {
    eventEmitter.emit('scenario-started', scenario);
    eventEmitter.emit('step-started', step);

    step.status = 'failed';
    step.error = new Error("oops");
    step.error.stack = "Error: oops"; // more predictable - no frames

    eventEmitter.emit('step-finished', step);

    var color = chalk.red;
    var expected = "  Scenario: hello\n\n" +
      color('    Given I have ') + color.bold('42') + color(' cukes') + "\n" +
      color('      Error: oops') + "\n";
    //console.log(stdout.toString());
    assert.equal(stdout.toString(), expected);
  });
});
