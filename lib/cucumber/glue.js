var TestCase = require('./test_case');
var TestStep = require('./test_step');

module.exports = function Glue(stepDefinitions, hooks) {
  this.createTestCase = function (pickle) {
    var testSteps = []
      .concat(createHookSteps(hooks, 'before', pickle))
      .concat(createPickleTestSteps(pickle))
      .concat(createHookSteps(hooks, 'after', pickle));
    return new TestCase(pickle, testSteps);
  };

  function createHookSteps(hooks, scope, pickle) {
    return hooks.filter(function (hook) {
      return hook.scope === scope; // TODO: AND matches pickle's tags
    }).map(function (hook) {
      return hook.createTestStep(pickle);
    });
  }

  function createPickleTestSteps(pickle) {
    return pickle.steps.map(function (pickleStep) {
      return createPickleTestStep(pickleStep);
    });
  }

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
        // Create an undefined step (null bodyFn)
        return new TestStep(pickleStep.locations, [], null);
      default:
        throw new Error("Ambiguous match");
    }
  }
};
