var TestStep = require('./test_step');

module.exports = function StepDefinition(regexp, bodyFn) {


  this.createTestStep = function (pickleStep) {
    var match = regexp.exec(pickleStep.text);

    if (match) {
      var captureGroupCount = match.length - 1;
      if (captureGroupCount != bodyFn.length) {
        throw new Error('Arity mismatch. ' + regexp + ' has ' + captureGroupCount + ' capture group(s), but the body function takes ' + bodyFn.length + ' argument(s)');
      }
      return new TestStep(bodyFn);
    } else {
      return null;
    }
  }
};