module.exports = function TestCase(pickle, testSteps) {
  this.execute = function (eventEmitter) {
    var location = pickle.locations[pickle.locations.length - 1];

    eventEmitter.emit('scenario-started', {
      path: pickle.path,
      location: location
    });
    var world = {};

    return runTestStepsInSequence(testSteps, eventEmitter, world)
      .then(function () {
        eventEmitter.emit('scenario-finished', {
          path: pickle.path,
          location: location
        });
      });
  };

  function runTestStepsInSequence(testSteps, eventEmitter, world) {
    // This is essentially a for loop. If you think it looks weird it's
    // because we're using JavaScript promises, which is a mechanism
    // for running asynchronous code.
    return testSteps.reduce(function (promise, testStep) {
      return promise.then(function (run) {
        return testStep.execute(world, eventEmitter, run)
      })
    }, Promise.resolve(true));
  }
};