var path = require('path');
var assert = require('assert');
var glob = require('glob').sync;
var GlueLoader = require('../../lib/cucumber/glue_loader');

function glueFactory(stepDefinitions, hooks) {
  return {
    stepDefinitions: stepDefinitions,
    hooks: hooks
  }
}

var testDataDir = path.join(__dirname, '../../test-data');

describe("GlueLoader", function () {
  describe("#loadGlue", function () {
    beforeEach(function () {
      glob(testDataDir + "/**/*.js").forEach(function (glueFilePath) {
        var resolvedGlueFilePath = path.resolve(glueFilePath);
        delete require.cache[resolvedGlueFilePath];
      });
    });

    afterEach(function () {
      // Verify that we clean up temporary polution of global namespace
      assert.equal(global.Given, undefined);
    });

    it("loads step definitions", function () {
      var glueLoader = new GlueLoader();
      var stubGlue = glueLoader.loadGlue(testDataDir, glueFactory);
      assert.equal(stubGlue.stepDefinitions.length, 1);
      assert.deepEqual(stubGlue.stepDefinitions[0].bodyLocation, {
        path: 'test-data/glue/stepdefs.js',
        // The reported line number is mangled if we're running with code coverage on (ISTANBUL is set)
        line: process.env.ISTANBUL ? 9 : 2,
        column: process.env.ISTANBUL ? 39 : 1
      });
    });

    it("loads hooks", function () {
      var glueLoader = new GlueLoader();
      var stubGlue = glueLoader.loadGlue(testDataDir, glueFactory);
      var hookScopes = stubGlue.hooks.map(function (hook) {
        return hook.scope
      });
      assert.deepEqual(hookScopes, ['before', 'after']);
    });
  });
});
