var EventEmitter = require('events').EventEmitter;

module.exports = function Runtime(testCases) {
  this.execute = function() {
    var exitStatus = 0;

    var eventEmitter = new EventEmitter();
    eventEmitter.on('step-finished', function (step) {
      if (step.status == 'failed') exitStatus = 1;
    });

    testCases.forEach(function (testCase) {
      testCase.execute(eventEmitter);
    });
    return exitStatus;
  };
};
