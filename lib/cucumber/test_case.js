module.exports = function TestCase(testSteps) {
  this.execute = function (eventEmitter) {
    var run = true;
    testSteps.forEach(function (testStep) {
      run = testStep.execute(eventEmitter, run);
    });
  }
};