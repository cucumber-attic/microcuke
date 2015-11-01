module.exports = function TestStep(locations, matchedArguments, bodyFn) {

  this.execute = function (world, eventEmitter, run) {
    eventEmitter.emit('step-started', {
      status: 'unknown',
      location: locations[locations.length - 1],
      matchedArguments: matchedArguments
    });

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
        event.location = locations[locations.length - 1];
        event.matchedArguments = matchedArguments;
        eventEmitter.emit('step-finished', event);
        return event.status === 'passed';
      });
  }
};
