module.exports = function TestStep() {

};

module.exports.Undefined = function Undefined() {
  this.execute = function (eventEmitter, run) {
    eventEmitter.emit('step-finished', {
      status: 'undefined'
    });
    return false;
  }
};