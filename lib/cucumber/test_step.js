module.exports = function TestStep(locations, matchedArguments, bodyFn) {

  this.execute = function (world, eventEmitter, run) {
    eventEmitter.emit('step-started', {
      status: 'unknown',
      location: locations[locations.length - 1],
      matchedArguments: matchedArguments
    });

    // TODO: Don't wrap a new promise here. Hang onto the one from the body (or one that we create),
    // then hang onto the then/catch to "return" true or false in the end.

    return new Promise(function (resolve) {
      var status;
      var bodyPromise;

      if (!bodyFn) {
        status = 'undefined';
        bodyPromise = Promise.resolve();
      } else if (!run) {
        status = 'skipped';
        bodyPromise = Promise.resolve();
      } else {
        var matchedArgumentValues = matchedArguments.map(function (arg) {
          return arg.value
        });
        try {
          bodyPromise = bodyFn.apply(world, matchedArgumentValues);
          status = 'passed';

          if (bodyPromise && typeof(bodyPromise.then) === 'function') {
            // ok, it's a promise
          } else {
            // not a promise - we'll create our own
            bodyPromise = Promise.resolve();
          }
        } catch (err) {
          bodyPromise = Promise.reject(err);
        }
      }

      bodyPromise.then(function () {
        eventEmitter.emit('step-finished', {
          location: locations[locations.length - 1],
          matchedArguments: matchedArguments,
          status: status
        });
        resolve(run && status == 'passed');
      });

      bodyPromise.catch(function (err) {
        eventEmitter.emit('step-finished', {
          location: locations[locations.length - 1],
          matchedArguments: matchedArguments,
          status: 'failed',
          error: err
        });
        resolve(run && status == 'passed');
      });
    });
  }
};
