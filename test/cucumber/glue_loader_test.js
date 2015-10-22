var path = require('path');
var assert = require('assert');
var GlueLoader = require('../../lib/cucumber/glue_loader');

function StubGlue(stepDefinitions) {
  this.stepDefinitions = stepDefinitions;
}

describe("GlueLoader", function () {
  describe("#loadGlue", function () {
    it("loads step definitions", function () {
      var glueLoader = new GlueLoader();
      var stubGlue = glueLoader.loadGlue(path.join(__dirname, '../../test-data'), StubGlue);
      assert.equal(stubGlue.stepDefinitions.length, 1);
    });

    it("cleans up temporary polution of global namespace", function () {
      assert.equal(global.Given, undefined);
    });
  });
});
