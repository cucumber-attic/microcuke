module.exports = function Runtime(testCases) {
  this.execute = function (eventEmitter) {
    var exitStatus = 0;

    eventEmitter.on('step-finished', function (step) {
      if (step.status === 'failed') exitStatus = 1;
    });

    return runTestCases(testCases, function (testCase) {
      return testCase.execute(eventEmitter)
    }).then(function () {
      // This seems stupid at this point. Move outside this file.
      return exitStatus;
    });
  };

  function runTestCases(testCases, fn) {
    return new Promise(function (resolve) {
      (function next(testCases) {
        if (testCases[0]) {
          fn(testCases[0]).then(function () {
            next(testCases.slice(1))
          })
        } else {
          resolve()
        }
      })(testCases)
    })
  }
};
