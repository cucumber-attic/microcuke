#!/usr/bin/env node
var EventEmitter = require('events').EventEmitter;
var Glue = require('../lib/cucumber/glue');
var GlueLoader = require('../lib/cucumber/glue_loader');
var PickleLoader = require('../lib/cucumber/pickle_loader');
var Runtime = require('../lib/cucumber/runtime');

var glueLoader = new GlueLoader();
var pickleLoader = new PickleLoader();

var glue = glueLoader.loadGlue("test-data", Glue);
var pickles = pickleLoader.loadPickles("test-data");
var testCases = pickles.map(glue.createTestCase);

var runtime = new Runtime(testCases);
var eventEmitter = new EventEmitter();
process.exit(runtime.execute(eventEmitter));

