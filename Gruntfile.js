module.exports = function(grunt) {
  'use strict';


  var PATH_BUILD_LANGUAGES = 'deploy/languages';

  // ==========================================================================
  // Project configuration
  // ==========================================================================
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // js linting options
    jshint: {
      all: ['Gruntfile.js', 'src/*.js'],
      jshintrc: '.jshintrc'
    },

    jasmine: {
      pivotal: {
        src: 'src/**/*.js',
        options: {
          vendor: ['vendor/jquery/jquery-1.9.0.js', 'vendor/underscore/lodash.js', 'vendor/backbone/backbone.js',
          'vendor/handlebars/handlebars.js'],
          specs: 'spec/*.spec.js',
          keepRunner: true,
          helpers: 'vendor/jasmine-jquery/jasmine-jquery.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // default build task
  grunt.registerTask('default', 'test');

  // build task
  grunt.registerTask('test', ['jshint:all', 'jasmine:pivotal']);
};
