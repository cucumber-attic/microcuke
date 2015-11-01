module.exports = function SequentialTestCaseExecutor(testCases) {
  this.execute = function (eventEmitter) {
    var promise = Promise.resolve(true);
    testCases.forEach(function (testCase) {
      promise = promise.then(function () {
        return testCase.execute(eventEmitter)
      })
    });
    return promise;
  };
};
