var TestStep = require('./test_step');

module.exports = function Hook(bodyFn, bodyLocation, scope) {
  this.scope = scope;

  this.createTestStep = function (pickle) {
    return new TestStep([], [], bodyFn, bodyLocation);
  }
};