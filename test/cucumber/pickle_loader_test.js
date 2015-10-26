var assert = require('assert');
var PickleLoader = require('../../lib/cucumber/pickle_loader');

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
      var pickles = pickleLoader.loadPickles('test-data/hello.feature:99:5');
      assert.equal(pickles.length, 1);
      assert.equal(pickles[0].steps[0].text, "second step");
    });

    it("accepts additional filters", function () {
      function otherFilter(pickle) {
        return pickle.steps[0].text == 'second step';
      }

      var pickleLoader = new PickleLoader(otherFilter);
      var pickles = pickleLoader.loadPickles('test-data/hello.feature');
      assert.equal(pickles.length, 1);
      assert.equal(pickles[0].steps[0].text, "second step");
    });
  });
});
