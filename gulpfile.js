(() => {
    'use strict';

    const args = require('yargs').argv,
          gulp = require('gulp'),
          $ = require('gulp-load-plugins')({ rename: { 'gulp-if': 'gulpif' } }),
          es = require('event-stream'),
          del = require('del'),
          gutil = require('gulp-util'),
          browserSync = require('browser-sync'),
          fs = require('fs');

    var cleanCSS = require('gulp-clean-css');

    const reload = browserSync.reload;

    // Remove existing docs and dist build
    gulp.task('clean', del.bind(null, ['docs/dist', 'dist']));

    // Build LibSass files
    gulp.task('styles', function() {
        gulp.src('./bower_components/bootstrap/scss/bootstrap.scss')
            .pipe($.plumber())
            .pipe($.sourcemaps.init())
            .pipe($.sass().on('error', $.sass.logError))
            .pipe($.autoprefixer({browsers: ['last 1 version']}))
            .pipe($.rename({ suffix: '.min' }))
            .pipe(gulp.dest('css'))
            .pipe(cleanCSS({ compatibility: '*' }))
            .pipe($.sourcemaps.write('.'))            
            .pipe(gulp.dest('css'));
    });

    // Build JavaScript files 
    gulp.task('scripts', function() {
        return gulp.src(['./bower_components/bootstrap/js/src/util.js', 
                         './bower_components/bootstrap/js/src/alert.js', 
                         './bower_components/bootstrap/js/src/button.js', 
                         './bower_components/bootstrap/js/src/carousel.js', 
                         './bower_components/bootstrap/js/src/collapse.js', 
                         './bower_components/bootstrap/js/src/dropdown.js', 
                         './bower_components/bootstrap/js/src/modal.js', 
                         './bower_components/bootstrap/js/src/scrollspy.js', 
                         './bower_components/bootstrap/js/src/tab.js', 
                         './bower_components/bootstrap/js/src/tooltip.js', 
                         './bower_components/bootstrap/js/src/popover.js',
                         './bower_components/bootstrap/dist/js/bootstrap.js'])
            .pipe($.babel({ presets: ['es2015']}))
            .pipe($.sourcemaps.init())
            .pipe($.plumber())
            .pipe($.uglify({ preserveComments: 'license' }))
            .pipe($.rename({ suffix: '.min' }))
            .pipe($.sourcemaps.write('maps'))
            .pipe(gulp.dest('js'));
    });

    // Watch tasks

    gulp.task('watch', function() {     
        gulp.watch('scss/*.scss', ['styles']);
        gulp.watch('js/src/*.js', ['scripts']);
    });

    gulp.task('dist', ['styles', 'scripts']);

    gulp.task('default', ['clean'], () => {
        gulp.start('dist');
    });
})();