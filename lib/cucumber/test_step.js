module.exports = function TestStep(gherkinLocations, matchedArguments, bodyFn, bodyLocation) {
  this.execute = function (world, eventEmitter, run) {
    eventEmitter.emit('step-started', {
      status: 'unknown',
      gherkinLocation: gherkinLocations[gherkinLocations.length - 1],
      bodyLocation: bodyLocation,
      matchedArguments: matchedArguments
    });

    // We're returning a promise of a boolean here, because JavaScript.
    // Most languages should simply return a boolean and forget about
    // the promise stuff - simpler!
    return new Promise(function (resolve) {
      if (!bodyFn) {
        resolve({status: 'undefined'});
      } else if (!run) {
        resolve({status: 'skipped'});
      } else {
        var matchedArgumentValues = matchedArguments.map(function (arg) {
          return arg.value
        });
        try {
          // Execute the step definition body
          var promise = bodyFn.apply(world, matchedArgumentValues);

          if (promise && typeof(promise.then) === 'function') {
            // ok, it's a promise
            promise.then(function () {
              resolve({status: 'passed'});
            }).catch(function (err) {
              resolve({status: 'failed', error: err});
            })
          } else {
            resolve({status: 'passed'});
          }
        } catch (err) {
          resolve({status: 'failed', error: err});
        }
      }
    }).then(function (event) {
        event.gherkinLocation = gherkinLocations[gherkinLocations.length - 1];
        event.bodyLocation = bodyLocation;
        event.matchedArguments = matchedArguments;
        eventEmitter.emit('step-finished', event);
        return event.status === 'passed';
      });
  }
};
