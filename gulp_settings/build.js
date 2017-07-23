'use strict';

var gulp = require('gulp'),
    runSequence = require( 'run-sequence'),
    paths = gulp.paths,
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
    });

gulp.task('partials', function () {
  return gulp.src([
    paths.src + '/**/*.html',
    paths.tmp + '/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'app'
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html'),
      jsFilter = $.filter('**/*.js'),
      cssFilter = $.filter('**/*.css'),
      assets;

  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('bower_components/bootstrap/fonts', 'fonts'))
    .pipe($.replace('../img/flags.png', '../styles/img/flags.png'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src([paths.src + '/assets/img/**/*', 'bower_components/intl-tel-input/build/img/*'])
    .pipe(gulp.dest(paths.dist + '/assets/img/'));
});

gulp.task('imagesmore', function () {
  return gulp.src(paths.src + '/landing/img/**/*')
    .pipe(gulp.dest(paths.dist + '/landing/img/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('fontawesome', function () {
    return gulp.src('bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}')
     .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('bsfonts', function () {
    return gulp.src('bower_components/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')
     .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('replaceCss', function () {
  return gulp.src(paths.dist + '/styles/*.css')
      .pipe($.replace('/bower_components/font-awesome/fonts/', '../fonts/'))
      .pipe(gulp.dest(paths.dist + '/styles'));
});

gulp.task('replace', ['replaceCss']);

gulp.task( 'build', function ( callback ) {
  runSequence( ['html', 'images', 'imagesmore', 'fonts', 'fontawesome', 'bsfonts', 'misc'], 'replace', callback );
});