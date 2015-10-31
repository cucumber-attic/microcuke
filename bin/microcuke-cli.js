#!/usr/bin/env node
var EventEmitter = require('events').EventEmitter;
var Glue = require('../lib/cucumber/glue');
var GlueLoader = require('../lib/cucumber/glue_loader');
var PickleLoader = require('../lib/cucumber/pickle_loader');
var Runtime = require('../lib/cucumber/runtime');
var PrettyPlugin = require('../lib/cucumber/pretty_plugin');
var SourceReader = require('../lib/cucumber/source_reader');
var tagFilter = require('../lib/cucumber/tag_filter');

var glueLoader = new GlueLoader();

var filter = process.env.TAGS ? tagFilter(process.env.TAGS) : function () {return true;};
var pickleLoader = new PickleLoader(filter);

var glue = glueLoader.loadGlue("features", Glue);
var pickles = pickleLoader.loadPickles("features");
var testCases = pickles.map(glue.createTestCase);

var runtime = new Runtime(testCases);
var eventEmitter = new EventEmitter();

var plugin = new PrettyPlugin(process.stdout, new SourceReader());
plugin.subscribe(eventEmitter);

process.exit(runtime.execute(eventEmitter));

