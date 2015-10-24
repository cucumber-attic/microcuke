module.exports = function TestStep(bodyFn) {
  this.execute = function (eventEmitter, run) {
    var status;
    try {
      bodyFn();
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