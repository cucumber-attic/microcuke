var TestCase = require('./test_case');
var TestStep = require('./test_step');

module.exports = function Glue(stepDefinitions) {
  this.createTestCase = function (pickle) {
    var testSteps = pickle.steps.map(function (pickleStep) {
      return createPickleTestStep(pickleStep);
    });
    return new TestCase(testSteps);
  };

  function createPickleTestStep(pickleStep) {
    var testSteps = [];
    stepDefinitions.forEach(function (stepDefinition) {
      var testStep = stepDefinition.createTestStep(pickleStep);
      if (testStep) {
        testSteps.push(testStep);
      }
    });

    switch (testSteps.length) {
      case 1:
        return testSteps[0];
      case 0:
        return new TestStep.Undefined();
    }
  }
};
