var fs = require('fs');
var chalk = require('chalk');

var colors = {
  failed: chalk.red,
  passed: chalk.green,
  skipped: chalk.cyan,
  undefined: chalk.yellow
};

function stepColor(step) {
  return colors[step.status];
}

module.exports = function PrettyPlugin(out, sourceReader) {
  var self = this;
  var sourcePrinters = {};
  var sourcePrinter; // Assumes sequential execution.

  this.subscribe = function (eventEmitter) {
    eventEmitter.on('scenario-started', function (test) {
      sourcePrinter = sourcePrinterFor(test);
      sourcePrinter.printUntilIncluding(test.location);
    });

    eventEmitter.on('step-started', function (step) {
      if (step.location) { // Hook steps don't have a location - ignore them
        sourcePrinter.printUntilExcluding(step.location);
      }
    });

    eventEmitter.on('step-finished', function (step) {
      if (step.location) {
        sourcePrinter.printStep(step);
      }
      if (step.status == 'failed') {
        var indentedError = step.error.stack.replace(/^(.*)/gm, "      $1");
        var color = stepColor(step);
        out.write(color(indentedError) + "\n");
      }
    });
  };

  function sourcePrinterFor(scenario) {
    var sourcePrinter = sourcePrinters[scenario.path];
    if (!sourcePrinter) {
      var source = sourceReader.readSource(scenario.path);
      sourcePrinter = sourcePrinters[scenario.path] = new SourcePrinter(source);
    }
    return sourcePrinter;
  }

  function SourcePrinter(source) {
    var lines = source.split(/\n/);
    var line = 0;

    this.printUntilExcluding = function (location) {
      while (line < location.line - 1) {
        out.write(lines[line] + "\n");
        line++;
      }
    };

    this.printUntilIncluding = function (location) {
      while (line < location.line) {
        out.write(lines[line] + "\n");
        line++;
      }
    };

    this.printStep = function (step) {
      var color = stepColor(step);

      var textStart = 0;
      var textLine = lines[line];
      var formattedLine = '';
      step.matchedArguments.forEach(function (matchedArgument) {
        var text = textLine.substring(textStart, matchedArgument.offset - 1);
        formattedLine += color(text);
        formattedLine += color.bold(matchedArgument.value);

        textStart = matchedArgument.offset - 1 + matchedArgument.value.length;
      });
      if (textStart != textLine.length) {
        var text = textLine.substring(textStart, textLine.length);
        formattedLine += color(text);
      }
      out.write(formattedLine + "\n");
      line++;
    };
  }
};
