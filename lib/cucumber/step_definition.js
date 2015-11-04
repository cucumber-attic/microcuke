var TestStep = require('./test_step');

module.exports = function StepDefinition(regexp, bodyFn, location) {
  this.location = location;

  /**
   * Maybe create a TestStep
   *
   * @param pickleStep compiled step
   * @returns TestStep if the pickleStep matches our regexp, null if not
   */
  this.createTestStep = function (pickleStep, path) {
    var match = regexp.exec(pickleStep.text);

    if (match) {
      var captureGroupCount = match.length - 1;
      if (captureGroupCount != bodyFn.length) {
        throw new Error('Arity mismatch. ' + regexp + ' has ' + captureGroupCount + ' capture group(s), but the body function takes ' + bodyFn.length + ' argument(s)');
      }

      var column = pickleStep.locations[pickleStep.locations.length - 1].column;
      var text = match[0];
      var offset = 0;

      var matchedArguments = [];
      for (var i = 1; i < match.length; i++) {
        var value = match[i];
        offset = text.indexOf(value, offset);
        matchedArguments.push({
          offset: column + offset,
          value: value
        });
      }

      // Create locations with path (Pickle location structs only have line and column) - TODO: FIX!
      var locations = pickleStep.locations.map(function (location) {
        return {
          path: path,
          line: location.line,
          column: location.column
        }
      }).concat(location);
      return new TestStep(locations, matchedArguments, bodyFn);
    } else {
      return null;
    }
  }
};