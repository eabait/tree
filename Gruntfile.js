module.exports = function(grunt) {
  'use strict';

  var Path = {
    LIB: 'src/**/*.js',
    SPECS: 'spec/*.spec.js'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // js linting options
    jshint: {
      all: ['Gruntfile.js', Path.LIB],
      jshintrc: '.jshintrc'
    },

    // Builds and run spec runner
    jasmine: {
      pivotal: {
        src: Path.LIB,
        options: {
          vendor: [
            'vendor/jquery/jquery-1.9.0.js',
            'vendor/underscore/lodash.js',
            'vendor/backbone/backbone.js',
            'vendor/handlebars/handlebars.js'
          ],
          specs: Path.SPECS,
          keepRunner: true,
          helpers: [
            'vendor/jasmine-jquery/jasmine-jquery.js',
            'vendor/jasmine-ajax/mock-ajax.js'
          ],
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'coverage/coverage.json',
            report: 'coverage',
            thresholds: {
              lines: 85,
              statements: 85,
              branches: 80,
              functions: 85
            }
          }
        }
      }
    }
  });

  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // default build task
  grunt.registerTask('default', 'test');

  // Dev task
  grunt.registerTask('test', ['jshint:all', 'jasmine:pivotal']);
};
