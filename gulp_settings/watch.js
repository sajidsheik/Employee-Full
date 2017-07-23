'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

gulp.task('watch', ['inject'], function () {
    gulp.watch([
        paths.src + '/*.html',
        paths.src + '/{assets,components}/**/*.less',
        paths.src + '/**/*.js',
        '!' + paths.src + '/**/*.spec.js',
        'bower.json',
        '!' + 'slimapp/**'
    ], ['inject']);
});
