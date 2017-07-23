'use strict';

var gulp = require('gulp'),
    shell = require('gulp-shell'),
    runSequence = require('run-sequence');

gulp.paths = {
  src: 'src',
  dist: 'build',
  tmp: '.tmp',
  spec: 'spec'
};

require('require-dir')('./gulp_settings');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Aliases
gulp.task('b', ['build']);
gulp.task('s', function (callback) {
    runSequence('clean', ['serve'], callback);
});
gulp.task('server', ['serve']);
gulp.task('t', ['cucumber']); // example: "gulp t --tags @ms-signUp,~@ms-signIn" OR "gulp t --tags @ms-signUp --tags ~@ms-signIn"
gulp.task('ta', ['tests-all']);
gulp.task('tns', ['tests-no-screenshots']); // run test without screenshots
gulp.task('tms', ['tests-make-screenshots']);
gulp.task('tcs', ['tests-compare-screenshots']);
gulp.task('u', ['unit']);
gulp.task('uw', ['unit-watch']);
// gulp.task('webdriver', ['webdriver-update', 'webdriver-standalone']);
