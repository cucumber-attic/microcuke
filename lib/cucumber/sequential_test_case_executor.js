module.exports = function SequentialTestCaseExecutor(testCases) {
  this.execute = function (eventEmitter) {
    var all_passed = true;
    for (var i=0 ; i<testCases.length ; i++) {
      var testCase = testCases[i];
      var passed = testCase.execute(eventEmitter);
      all_passed = all_passed && passed;
    }
    return all_passed;

    // This is essentially a for loop. If you think it looks weird it's
    // because we're using JavaScript promises, which is a mechanism
    // for running asynchronous code.
    //
    // return testCases.reduce(function (promise, testCase) {
    //   return promise.then(function () {
    //     return testCase.execute(eventEmitter)
    //   });
    // }, Promise.resolve());

  };
};
