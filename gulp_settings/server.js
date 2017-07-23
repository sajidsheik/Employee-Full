'use strict';

var gulp = require('gulp'),
    paths = gulp.paths,
    util = require('util'),
    browserSync = require('browser-sync'),
    middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === paths.src || (util.isArray(baseDir) && baseDir.indexOf(paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  browserSync.instance = browserSync.init(files, {
    ui: false,
    startPath: '/',
    localOnly: true,
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    notify: false,
    browser: browser
  });
}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    paths.tmp + '/serve',
    paths.src
  ], [
    paths.tmp + '/serve/{assets,components}/**/*.css',
    paths.src + '/{assets,components,shared}/**/*.js',
    '!' + paths.src + '/{assets,components,shared}/**/*.spec.js',
    paths.src + '/serve/assets/images/**/*',
    paths.tmp + '/serve/*.html',
    paths.tmp + '/serve/{assets,components}/**/*.html',
    paths.src + '/{assets,components,shared}/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([paths.tmp + '/serve', paths.src], null, []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(paths.dist, null, []);
});
