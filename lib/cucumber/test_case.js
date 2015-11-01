module.exports = function TestCase(pickle, testSteps) {
  this.execute = function (eventEmitter) {
    var location = pickle.locations[pickle.locations.length - 1];

    eventEmitter.emit('scenario-started', {
      path: pickle.path,
      location: location
    });
    var world = {};

    return runSteps(testSteps, eventEmitter, world)
      .then(function () {
        eventEmitter.emit('scenario-finished', {
          path: pickle.path,
          location: location
        });
      });
  };

  function runSteps(testSteps, eventEmitter, world) {
    return new Promise(function (resolve) {
      (function next(steps, run) {
        if (steps[0]) {
          steps[0].execute(world, eventEmitter, run).then(function (run) {
            next(steps.slice(1), run)
          })
        } else {
          resolve()
        }
      })(testSteps, true)
    })
  }
};