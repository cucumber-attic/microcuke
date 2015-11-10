var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var chalk = require('chalk');
var WritableStream = require('memory-streams').WritableStream;
var PrettyPlugin = require('../../lib/cucumber/pretty_plugin');

describe('PrettyPlugin', function () {
  var stdout, eventEmitter, scenario, steps;

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
          "    Given I have 42 cukes\n" +
          "    And I have fun\n";
      }
    };

    eventEmitter = new EventEmitter();
    new PrettyPlugin(stdout, sourceReader).subscribe(eventEmitter);

    scenario = {
      location: {path: 'features/cukes.feature', line: 4, column: 1},
      pickleSteps: [
        {
          locations: [{path: 'features/cukes.feature', line: 6, column: 10}],
          text: 'I have 14 cukes'
        },
        {
          locations: [{path: 'features/cukes.feature', line: 7, column: 8}],
          text: 'I have fun'
        }
      ]
    };

    steps = [
      {
        status: 'unknown',
        gherkinLocation: {path: 'features/cukes.feature', line: 6, column: 10},
        matchedArguments: [
          {offset: 18, value: "42"}
        ]
      },
      {
        status: 'unknown',
        gherkinLocation: {path: 'features/cukes.feature', line: 7, column: 8},
        matchedArguments: [
          {offset: 16, value: "fun"}
        ]
      }
    ];

  });

  it("prints passing step as green", function () {
    eventEmitter.emit('scenario-started', scenario);

    eventEmitter.emit('step-started', steps[0]);
    steps[0].status = 'passed';
    eventEmitter.emit('step-finished', steps[0]);

    eventEmitter.emit('step-started', steps[1]);
    steps[1].status = 'passed';
    eventEmitter.emit('step-finished', steps[1]);

    var expected = "  Scenario: hello\n\n" +
      chalk.green('    Given I have ') + chalk.green.bold('42') + chalk.green(' cukes') + ' ' + chalk.gray("# features/cukes.feature:6") + "\n" +
      chalk.green('    And I have ') + chalk.green.bold('fun') + '        ' + chalk.gray("# features/cukes.feature:7") + "\n";
    assert.deepEqual(stdout.toString(), expected);
  });

  it("prints failing step as red", function () {
    eventEmitter.emit('scenario-started', scenario);

    eventEmitter.emit('step-started', steps[0]);
    steps[0].status = 'failed';
    steps[0].error = new Error("oops");
    steps[0].error.stack = "Error: oops"; // more predictable - no frames
    eventEmitter.emit('step-finished', steps[0]);

    eventEmitter.emit('step-started', steps[1]);
    steps[1].status = 'skipped';
    eventEmitter.emit('step-finished', steps[1]);

    var expected = "  Scenario: hello\n\n" +
      chalk.red('    Given I have ') + chalk.red.bold('42') + chalk.red(' cukes') + ' ' + chalk.gray("# features/cukes.feature:6") + "\n" +
      chalk.red('      Error: oops') + "\n" +
      chalk.cyan('    And I have ') + chalk.cyan.bold('fun') + '        ' + chalk.gray("# features/cukes.feature:7") + "\n";
    assert.equal(stdout.toString(), expected);
  });
});
