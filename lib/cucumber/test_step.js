module.exports = function TestStep(gherkinLocations, matchedArguments, bodyFn, bodyLocation) {

  // this object tracks the execution status as it goes
  var data = {
    status:           'unknown',
    gherkinLocation:  gherkinLocations[gherkinLocations.length - 1],
    bodyLocation:     bodyLocation,
    matchedArguments: matchedArguments
  }

  //  handles execution details
  var _execute = function (world, data) {
    var matchedArgumentValues = matchedArguments.map(
      function (arg) {return arg.value}
    );
    try {
      // Execute the step definition body
      result = bodyFn.apply(world, matchedArgumentValues);
      data.status = 'passed';
    } catch (err) {
      data.status = 'failed';
      data.error = err;
    } finally {
      return data;
    }
  }

  // main execution logic
  //
  //  Overview:
  //    1. startup
  //    2. execution
  //    3. completion
  this.execute = function(world, eventEmitter, run) {
    // 1. startup
    eventEmitter.emit('step-started', data);

    // 2. execution
    if (!bodyFn) {
      data.status = 'undefined';
    } else if (!run) {
      data.status = 'skipped';
    } else {
      data = _execute(world, data);
    }

    // 3. completion
    eventEmitter.emit('step-finished', data);
    return data.status === 'passed';
  }
};
