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
    var promise = Promise.resolve(true);
    testSteps.forEach(function (testStep) {
      promise = promise.then(function (run) {
        return testStep.execute(world, eventEmitter, run)
      })
    });
    return promise;
  }
};