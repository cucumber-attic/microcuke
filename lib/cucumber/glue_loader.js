var path = require('path');
var glob = require('glob').sync;
var StepDefinition = require('./step_definition');
var Hook = require('./hook');

module.exports = function GlueLoader() {
  this.loadGlue = function (gluePath, Constructor) {
    var stepDefinitions = [];
    var hooks = [];

    function registerStepdef(regexp, bodyFn) {
      stepDefinitions.push(new StepDefinition(regexp, bodyFn));
    }

    function registerBeforeHook(bodyFn) {
      hooks.push(new Hook(bodyFn, "before"));
    }

    var stepdefKeywords = ['Given', 'When', 'Then', 'And', 'But'];
    var originalGlobals = {};
    stepdefKeywords.forEach(function(keyword) {
      originalGlobals[keyword] = global[keyword];
      global[keyword] = registerStepdef;
    });

    var oldBefore = global.Before;
    global.Before = registerBeforeHook;

    glob(gluePath + "/**/*.js").forEach(function (glueFilePath) {
      var resolvedGlueFilePath = path.resolve(glueFilePath);
      require(path.resolve(resolvedGlueFilePath));
    });

    stepdefKeywords.forEach(function(keyword) {
      global[keyword] = originalGlobals[keyword];
    });

    global.Before = oldBefore;

    return new Constructor(stepDefinitions, hooks);
  };
};