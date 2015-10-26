var assert = require('assert');
var PickleLoader = require('../../lib/cucumber/pickle_loader');

describe("PickleLoader", function () {
  describe("#loadPickles", function () {
    it("loads pickles from directory", function () {
      var pickleLoader = new PickleLoader();
      var pickles = pickleLoader.loadPickles('test-data');
      assert.equal(pickles.length, 2);
      assert.equal(pickles[0].steps[0].text, "first step");
    });

    it("loads pickles from file", function () {
      var pickleLoader = new PickleLoader();
      var pickles = pickleLoader.loadPickles('test-data/hello.feature');
      assert.equal(pickles.length, 2);
      assert.equal(pickles[0].steps[0].text, "first step");
    });

    it("filters pickles by line number", function () {
      var pickleLoader = new PickleLoader();
      var pickles = pickleLoader.loadPickles('test-data/hello.feature:5:55');
      assert.equal(pickles.length, 1);
      assert.equal(pickles[0].steps[0].text, "second step");
    });
  });
});
