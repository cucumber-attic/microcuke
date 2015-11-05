module.exports = function SequentialTestCaseExecutor(testCases) {
  this.execute = function (eventEmitter) {
    // This is essentially a for loop. If you think it looks weird it's
    // because we're using JavaScript promises, which is a mechanism
    // for running asynchronous code.
    return testCases.reduce(function (promise, testCase) {
      return promise.then(function () {
        return testCase.execute(eventEmitter)
      });
    }, Promise.resolve());
  };
};
