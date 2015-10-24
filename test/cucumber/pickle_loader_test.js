var assert = require('assert');
var PickleLoader = require('../../lib/cucumber/pickle_loader');

describe("PickleLoader", function () {
  describe("#loadPickles", function () {
    it("builds executable TestCase object from Gherkin sources and Glue code", function () {
      var pickleLoader = new PickleLoader();
      var pickles = pickleLoader.loadPickles('test-data');
      assert.equal(pickles.length, 2);
      assert.equal(pickles[0].steps[0].text, "first step");
    });
  });
});
