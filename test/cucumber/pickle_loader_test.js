var assert = require('assert');
var PickleLoader = require('../../lib/cucumber/pickle_loader');
var tagFilter = require('../../lib/cucumber/tag_filter');

function passthrough(pickle) {
  return true;
}

describe("PickleLoader", function () {
  describe("#loadPickles", function () {
    it("loads pickles from directory", function () {
      var pickleLoader = new PickleLoader(passthrough);
      var pickles = pickleLoader.loadPickles('test-data');
      assert.equal(pickles.length, 2);
      assert.equal(pickles[0].steps[0].text, "first step");
    });

    it("loads pickles from file", function () {
      var pickleLoader = new PickleLoader(passthrough);
      var pickles = pickleLoader.loadPickles('test-data/hello.feature');
      assert.equal(pickles.length, 2);
      assert.equal(pickles[0].steps[0].text, "first step");
    });

    it("filters pickles by line number", function () {
      var pickleLoader = new PickleLoader(passthrough);
      var pickles = pickleLoader.loadPickles('test-data/hello.feature:6');
      assert.equal(pickles.length, 1);
      assert.equal(pickles[0].steps[0].text, "second step");
    });

    it("filters pickles by tag expressions", function () {
      var filter = tagFilter("not @wip");

      var pickleLoader = new PickleLoader(filter);
      var pickles = pickleLoader.loadPickles('test-data/hello.feature');
      assert.equal(pickles.length, 1);
      assert.equal(pickles[0].steps[0].text, "second step");
    });
  });
});
