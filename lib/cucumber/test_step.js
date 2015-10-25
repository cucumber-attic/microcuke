module.exports = function TestStep(matchedArgumentValues, bodyFn) {
  this.execute = function (world, eventEmitter, run) {
    var status = 'unknown';
    eventEmitter.emit('step-started', {
      status: status
    });

    if (bodyFn) {
      try {
        bodyFn.apply(world, matchedArgumentValues);
        status = 'passed';
      } catch (err) {
        status = 'failed';
      }
    } else {
      status = 'undefined';
    }

    eventEmitter.emit('step-finished', {
      status: status
    });
  }
};
