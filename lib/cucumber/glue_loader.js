var glob = require('glob').sync;
var StepDefinition = require('./step_deinition');

module.exports = function LoadGlue() {
  this.loadGlue = function (path, Constructor) {
    var stepDefinitions = [];

    function registerStepdef(regexp, bodyFn) {
      stepDefinitions.push(new StepDefinition(regexp, bodyFn));
    }

    var oldGiven = global.Given;
    global.Given = registerStepdef;

    glob(path + "/**/*.js").forEach(function (glueFile) {
      require(glueFile);
    });

    global.Given = oldGiven;

    return new Constructor(stepDefinitions);
  };
};