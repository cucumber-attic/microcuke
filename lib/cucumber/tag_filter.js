var BooleanExpressionParser = require('./boolean_expression_parser');
var parser = new BooleanExpressionParser();

module.exports = function tagFilter(expression) {
  var expr = parser.parse(expression.split(' '));

  return function (pickle) {
    var tagNames = pickle.tags.map(function (tag) {
      return tag.name;
    });
    return expr.evaluate(tagNames);
  }
};