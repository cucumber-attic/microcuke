module.exports = function TestCase(pickle, testSteps) {
  this.execute = function (eventEmitter) {
    var location = pickle.locations[pickle.locations.length - 1];

    eventEmitter.emit('scenario-started', {
      location: location,
      pickleSteps: pickle.steps
    });
    var world = {};
    runTestStepsInSequence(testSteps, eventEmitter, world);
    eventEmitter.emit('scenario-finished', {
      path: pickle.path,
      location: location
      }
    );
  }

  function runTestStepsInSequence(testSteps, eventEmitter, world) {
    var all_passed = true;
    for (var i=0 ; i<testSteps.length; i++) {
      var testStep = testSteps[i];
      var run = all_passed;
      var passed = testStep.execute(world, eventEmitter, run);
      all_passed = all_passed && passed;
    }
    return all_passed

    // This is essentially a for loop. If you think it looks weird it's
    // because we're using JavaScript promises, which is a mechanism
    // for running asynchronous code.
    // return testSteps.reduce(function (promise, testStep) {
    //   return promise.then(function (run) {
    //     return testStep.execute(world, eventEmitter, run)
    //   })
    // }, Promise.resolve(true));

  }
};
