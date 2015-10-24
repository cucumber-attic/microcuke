var path = require('path');
var glob = require('glob').sync;
var StepDefinition = require('./step_definition');

module.exports = function GlueLoader() {
  this.loadGlue = function (gluePath, Constructor) {
    var stepDefinitions = [];

    function registerStepdef(regexp, bodyFn) {
      stepDefinitions.push(new StepDefinition(regexp, bodyFn));
    }

    var oldGiven = global.Given;
    global.Given = registerStepdef;

    glob(gluePath + "/**/*.js").forEach(function (glueFilePath) {
      var resolvedGlueFilePath = path.resolve(glueFilePath);
      require(path.resolve(resolvedGlueFilePath));
    });

    global.Given = oldGiven;

    return new Constructor(stepDefinitions);
  };
};