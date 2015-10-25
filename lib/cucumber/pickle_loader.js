var fs = require('fs');
var glob = require('glob').sync;
var Gherkin = require('gherkin');

module.exports = function PickleLoader() {
  var parser = new Gherkin.Parser();
  var compiler = new Gherkin.Compiler();

  this.loadPickles = function (path) {
    var pickles = [];

    var paths = fs.statSync(path).isDirectory() ? glob(path + "/**/*.feature") : [path];

    paths.forEach(function (featurePath) {
      var gherkin = fs.readFileSync(featurePath, 'utf-8');
      var feature = parser.parse(gherkin);
      pickles = pickles.concat(compiler.compile(feature, featurePath));
    });

    return pickles;
  }
};