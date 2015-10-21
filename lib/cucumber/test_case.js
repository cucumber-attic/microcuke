module.exports = function TestCase(testSteps) {
  this.execute = function (eventEmitter) {
    testSteps.forEach(function (testStep) {
      testStep.execute(eventEmitter);
    });
  }
};