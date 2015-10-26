var fs = require('fs');

module.exports = function SourceReader() {
  this.readSource = function (path) {
    return fs.readFileSync(path, 'utf-8');
  };
};


