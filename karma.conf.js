// Karma configuration
// Generated on Fri May 25 2018 03:45:05 GMT+0800 (+08)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],

    middleware: ['node-modules'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/requirejs/require.js',
      'node_modules/karma-requirejs/lib/adapter.js',
      { pattern: 'spec/spec-main.js',    included: true},
      { pattern: 'spec/*[sS]pec.js', included: false },
      { pattern: 'routes/*.js', included: false },
      { pattern: '*.js', included: false }
    ],

    // list of files / patterns to exclude
    exclude: [
      'index.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // 'spec/*[sS]pec.js': ['common_js']
    },

    common_js: {
      // Array of globs to auto require when the tests run. You can use
      // this to control the entry point for your tests.
      autoRequire: [
        'spec/*[sS]pec.js'
      ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
