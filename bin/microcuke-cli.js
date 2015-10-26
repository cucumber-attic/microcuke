#!/usr/bin/env node
var EventEmitter = require('events').EventEmitter;
var Glue = require('../lib/cucumber/glue');
var GlueLoader = require('../lib/cucumber/glue_loader');
var PickleLoader = require('../lib/cucumber/pickle_loader');
var Runtime = require('../lib/cucumber/runtime');
var PrettyPlugin = require('../lib/cucumber/pretty_plugin');
var SourceReader = require('../lib/cucumber/source_reader');

var glueLoader = new GlueLoader();
var pickleLoader = new PickleLoader();

var glue = glueLoader.loadGlue("test-data", Glue);
var pickles = pickleLoader.loadPickles("test-data/hello.feature");
var testCases = pickles.map(glue.createTestCase);

var runtime = new Runtime(testCases);
var eventEmitter = new EventEmitter();

var plugin = new PrettyPlugin(process.stdout, new SourceReader());
plugin.subscribe(eventEmitter);

process.exit(runtime.execute(eventEmitter));

