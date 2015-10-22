var TestCase = require('./test_case');

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
      if(testStep) {
        testSteps.push(testStep);
      }
    });

    if(testSteps.length != 1) throw new Error("Expected a single match");
    return testSteps[0];
  }

};