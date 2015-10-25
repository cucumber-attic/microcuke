module.exports = function TestCase(testSteps) {
  this.execute = function (eventEmitter) {
    var world = {};
    var run = true;
    testSteps.forEach(function (testStep) {
      run = testStep.execute(world, eventEmitter, run);
    });
  }
};