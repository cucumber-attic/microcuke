module.exports = function Runtime(testCases) {
  this.execute = function (eventEmitter) {
    var exitStatus = 0;

    eventEmitter.on('step-finished', function (step) {
      if (step.status == 'failed') exitStatus = 1;
    });

    testCases.forEach(function (testCase) {
      testCase.execute(eventEmitter);
    });
    return exitStatus;
  };
};
