'use strict';
//browserify -t coffeeify  --extension=".coffee" -e lib/index.coffee -s BackgammonGame
module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      main: {
        src: ['lib/**/*.coffee'],
        dest: 'build/backgammon.js',
        options: {
          browserifyOptions: {
            entries: './lib/index.coffee',
            // debug: true,
            transform: ['coffeeify'],
            extensions: ['.coffee'],
            standalone: 'BackgammonGame'
          }
        }
      }
    },

    mochacli: {
      options: {
        // bail: true
      },
      all: ['test/*.coffee']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.registerTask('test', 'mochacli');
  grunt.registerTask('build', 'browserify');
  grunt.registerTask('default', ['test', 'build']);
};