'use strict';

var gulp = require('gulp'),
    paths = gulp.paths,
    $ = require('gulp-load-plugins')();

gulp.task('styles', function () {

  var lessOptions = {
    paths: [
      'bower_components',
      paths.src + '/assets',
      paths.src + '/components'
    ]
  };

  var injectFiles = gulp.src([
    paths.src + '/{assets,components}/**/*.less',
    '!' + paths.src + '/assets/index.less',
    '!' + paths.src + '/assets/vendor.less'
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(paths.src + '/assets/', '');
      filePath = filePath.replace(paths.src + '/components/', '../components/');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  var indexFilter = $.filter('index.less');

  return gulp.src([
    paths.src + '/assets/index.less',
    paths.src + '/assets/vendor.less'
  ])
    .pipe(indexFilter)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(indexFilter.restore())
    .pipe($.less())

  .pipe($.autoprefixer())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.tmp + '/serve/assets/'));
});
