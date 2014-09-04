/* jshint node: true */
'use strict';
var gulp = require('gulp'),
  g = require('gulp-load-plugins')({
    lazy: false
  }),
  noop = g.util.noop,
  lazypipe = require('lazypipe'),
  stylish = require('jshint-stylish');

  /**
   * JS Hint
   */
  gulp.task('jshint', function() {
    return gulp.src([
      './gulpfile.js',
      './lib/*.js'
    ])
      .pipe(g.cached('jshint'))
      .pipe(jshint('./.jshintrc'));
  });

/**
 * Jshint with stylish reporter
 */

function jshint(jshintfile) {
  return lazypipe()
    .pipe(g.jshint, jshintfile)
    .pipe(g.jshint.reporter, stylish)();
}

gulp.task('watch', function() {
  gulp.watch('./lib/*.js', ['jshint']);
});
