var fs = require('fs');
var glob = require('glob').sync;
var Gherkin = require('gherkin');

var FILE_COLON_LINE_PATTERN = /^([\w\W]*?):([\d:]+)$/;

// TODO: move otherFilter to path
module.exports = function PickleLoader(otherFilter) {
  var parser = new Gherkin.Parser();
  var compiler = new Gherkin.Compiler();

  this.loadPickles = function (path) {
    var pickles = [];

    var lineFilter, paths;
    if (exists(path) && fs.statSync(path).isDirectory()) {
      paths = glob(path + "/**/*.feature");
      lineFilter = passthrough;
    } else {
      var pathWithLines = new PathWithLines(path);
      paths = pathWithLines.paths;
      lineFilter = pathWithLines.filter;
    }

    paths.forEach(function (featurePath) {
      var gherkin = fs.readFileSync(featurePath, 'utf-8');
      var gherkinDocument = parser.parse(gherkin);
      pickles = pickles.concat(compiler.compile(gherkinDocument, featurePath));
    });

    var filter = andFilters(lineFilter, otherFilter);
    pickles = pickles.filter(filter);

    return pickles;
  };

  function PathWithLines(path) {
    var match = FILE_COLON_LINE_PATTERN.exec(path);
    if (match) {
      this.paths = [match[1]];

      var lineNumbers = match[2].split(':').map(function (n) {
        return parseInt(n);
      });
      this.filter = lineFilterFor(lineNumbers);
    } else {
      this.paths = [path];
      this.filter = passthrough;
    }
  }

  function exists(path) {
    try {
      fs.statSync(path);
      return true;
    } catch (err) {
      return false;
    }
  }

  function andFilters(filterA, filterB) {
    return function (pickle) {
      return filterA(pickle) && filterB(pickle);
    }
  }

  function passthrough(pickle) {
    return true;
  }

  function lineFilterFor(lineNumbers) {
    return function (pickle) {
      var match = false;
      pickle.locations.forEach(function (location) {
        match = match || lineNumbers.indexOf(location.line) != -1;
      });
      return match;
    }
  }
};
