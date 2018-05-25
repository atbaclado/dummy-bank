// requirejs will load the modules and the spec files
var requirejs = require("requirejs"),

// fs is used to list the files to load
fs = require("fs"),

// jasmine-node is the test runner
jasmine = require("jasmine-node"),

// this lib will format the tests result to be readable
TerminalReporter = require("jasmine-node/lib/jasmine-node/reporter").jasmineNode.TerminalReporter;

requirejs.config({
	nodeRequire: require
});

// All we have to do is to load all modules and spec files.
["spec"].forEach(function (path) {
	 fs.readdirSync(path).forEach(function (file) {
		 requirejs(path+"/"+file);
	 });
 });

// Declare the reporter and execute tests
jasmine.getEnv().addReporter(new TerminalReporter({}));
jasmine.getEnv().execute();