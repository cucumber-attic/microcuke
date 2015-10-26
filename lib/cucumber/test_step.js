module.exports = function TestStep(locations, matchedArguments, bodyFn) {

  this.execute = function (world, eventEmitter, run) {
    var status = 'unknown';
    var error = null;
    eventEmitter.emit('step-started', {
      status: status,
      location: locations[locations.length - 1],
      matchedArguments: matchedArguments
    });

    if (!bodyFn) {
      status = 'undefined';
    } else if (!run) {
      status = 'skipped';
    } else {
      try {
        var matchedArgumentValues = matchedArguments.map(function (arg) {
          return arg.value
        });
        bodyFn.apply(world, matchedArgumentValues);
        status = 'passed';
      } catch (err) {
        status = 'failed';
        error = err;
      }
    }

    eventEmitter.emit('step-finished', {
      status: status,
      location: locations[locations.length - 1],
      matchedArguments: matchedArguments,
      error: error
    });
    return run && status == 'passed';
  }
};
