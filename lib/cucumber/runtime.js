module.exports = function Runtime(testCases) {
  this.execute = function (eventEmitter) {
    var exitStatus = 0;

    eventEmitter.on('step-finished', function (step) {
      if (step.status === 'failed') exitStatus = 1;
    });

    return runTestCasesInSequence(testCases, eventEmitter)
      .then(function () {
        // This seems stupid at this point. Move outside this file.
        return exitStatus;
      });
  };

  function runTestCasesInSequence(testCases, eventEmitter) {
    var promise = Promise.resolve(true);
    testCases.forEach(function (testCase) {
      promise = promise.then(function () {
        return testCase.execute(eventEmitter)
      })
    });
    return promise;
  }
};
