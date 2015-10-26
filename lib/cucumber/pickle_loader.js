var fs = require('fs');
var glob = require('glob').sync;
var Gherkin = require('gherkin');

var FILE_COLON_LINE_PATTERN = /^([\w\W]*?):([\d:]+)$/;

module.exports = function PickleLoader() {
  var parser = new Gherkin.Parser();
  var compiler = new Gherkin.Compiler();

  this.loadPickles = function (path) {
    var pickles = [];

    var filter, paths;
    if (exists(path) && fs.statSync(path).isDirectory()) {
      paths = glob(path + "/**/*.feature");
      filter = passthrough;
    } else {
      var pathWithLines = new PathWithLines(path);
      paths = pathWithLines.paths;
      filter = pathWithLines.filter;
    }

    paths.forEach(function (featurePath) {
      var gherkin = fs.readFileSync(featurePath, 'utf-8');
      var feature = parser.parse(gherkin);
      pickles = pickles.concat(compiler.compile(feature, featurePath));
    });

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
      this.filter = lineFilter(lineNumbers);
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

  function passthrough(pickle) {
    return true;
  }

  function lineFilter(lineNumbers) {
    return function (pickle) {
      var match = false;
      pickle.locations.forEach(function (location) {
        match = match || lineNumbers.indexOf(location.line) != -1;
      });
      return match;
    }
  }
};