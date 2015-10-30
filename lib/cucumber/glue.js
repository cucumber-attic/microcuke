var TestCase = require('./test_case');
var TestStep = require('./test_step');

module.exports = function Glue(stepDefinitions, hooks) {
  this.createTestCase = function (pickle) {
    var beforeHookTestSteps = hooks.filter(function (hook) {
      return hook.scope === 'before'; // TODO: AND matches pickle's tags
    }).map(function(hook) {
      return hook.createTestStep(pickle);
    });

    var pickleTestSteps = pickle.steps.map(function (pickleStep) {
      return createPickleTestStep(pickleStep);
    });

    var testSteps = [].concat(beforeHookTestSteps).concat(pickleTestSteps);
    return new TestCase(pickle, testSteps);
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
        return new TestStep(pickleStep.locations, [], null);
      default:
        throw new Error("Ambiguous match");
    }
  }
};
