module.exports = function TestStep(matchedArgumentValues, bodyFn) {
  this.execute = function (eventEmitter, run) {
    var status;
    if (bodyFn) {
      try {
        var self = {};
        bodyFn.apply(self, matchedArgumentValues);
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
