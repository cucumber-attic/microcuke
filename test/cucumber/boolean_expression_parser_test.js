var assert = require('assert');
var BooleanExpressionParser = require('../../lib/cucumber/boolean_expression_parser');
var parser = new BooleanExpressionParser();

describe("TagExpressionParser", function () {
  describe("#parse", function () {

    [
      ["a and b", "( a and b )"],
      ["a or b", "( a or b )"],
      ["not a", "not ( a )"],
      ["( a and b ) or ( c and d )", "( ( a and b ) or ( c and d ) )"],
      ["not a or b and not c or not d or e and f", "( ( ( not ( a ) or ( b and not ( c ) ) ) or not ( d ) ) or ( e and f ) )"]
      // a or not b
    ].forEach(function (inOut) {
        it(inOut[0], function () {
          var tokens = inOut[0].split(' ');
          var expr = parser.parse(tokens);
          assert.equal(expr.toString(), inOut[1]);

          var roundtripTokens = expr.toString().split(' ');
          var roundtripExpr = parser.parse(roundtripTokens);
          assert.equal(roundtripExpr.toString(), inOut[1]);
        });
      });

    // evaluation

    it("evaluates not", function () {
      var expr = parser.parse("not x".split(' '));
      assert.equal(expr.evaluate(['x']), false);
      assert.equal(expr.evaluate(['y']), true);
    });

    it("evaluates and", function () {
      var expr = parser.parse("x and y".split(' '));
      assert.equal(expr.evaluate(['x', 'y']), true);
      assert.equal(expr.evaluate(['y']), false);
      assert.equal(expr.evaluate(['x']), false);
    });

    it("evaluates or", function () {
      var expr = parser.parse("x or y".split(' '));
      assert.equal(expr.evaluate([]), false);
      assert.equal(expr.evaluate(['y']), true);
      assert.equal(expr.evaluate(['x']), true);
    });

    // errors

    it("errors on extra close paren", function () {
      var tokens = '( a and b ) )'.split(' ');
      try {
        parser.parse(tokens);
        throw new Error("expected error")
      } catch (expected) {
        assert.equal(expected.message, "Unclosed (")
      }
    });

    it("errors on extra close paren", function () {
      var tokens = 'a not ( and )'.split(' ');
      try {
        parser.parse(tokens);
        throw new Error("expected error")
      } catch (expected) {
        assert.equal(expected.message, "empty stack")
      }
    });

    it("errors on unclosed paren", function () {
      var tokens = '( ( a and b )'.split(' ');
      try {
        parser.parse(tokens);
        throw new Error("expected error")
      } catch (expected) {
        assert.equal(expected.message, "Unclosed (")
      }
    });

    it("errors when there are several expressions", function () {
      var tokens = 'a b'.split(' ');
      try {
        var expr = parser.parse(tokens);
        console.log(expr.toString());
        throw new Error("expected error")
      } catch (expected) {
        assert.equal(expected.message, "Not empty")
      }
    });
  });
});
