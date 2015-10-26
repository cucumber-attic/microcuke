module.exports = function TestCase(pickle, testSteps) {
  this.execute = function (eventEmitter) {
    var location = pickle.locations[pickle.locations.length - 1];

    eventEmitter.emit('scenario-started', {
      path: pickle.path,
      location: location
    });
    var world = {};
    var run = true;
    testSteps.forEach(function (testStep) {
      run = testStep.execute(world, eventEmitter, run);
    });
    eventEmitter.emit('scenario-finished', {
      path: pickle.path,
      location: location
    });
  }
};