var TestStep = require('./test_step');

module.exports = function StepDefinition(regexp, bodyFn) {
  this.createTestStep = function(pickleStep) {
    var match = regexp.exec(pickleStep.text);
    if(match) {
      return new TestStep();
    } else {
      return null;
    }
  }
};