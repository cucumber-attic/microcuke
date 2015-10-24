module.exports = function TestStep(matchedArgumentValues, bodyFn) {
  this.execute = function (eventEmitter, run) {
    var status;
    try {
      var self = {};
      bodyFn.apply(self, matchedArgumentValues);
      status = 'passed';
    } catch (err) {
      status = 'failed';
    }
    eventEmitter.emit('step-finished', {
      status: status
    });
  }
};

module.exports.Undefined = function Undefined() {
  this.execute = function (eventEmitter, run) {
    eventEmitter.emit('step-finished', {
      status: 'undefined'
    });
    return false;
  }
};