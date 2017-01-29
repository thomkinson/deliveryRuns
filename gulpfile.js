(() => {
    'use strict';

    const args = require('yargs').argv,
          gulp = require('gulp'),
          $ = require('gulp-load-plugins')({ rename: { 'gulp-if': 'gulpif' } }),
          es = require('event-stream'),
          del = require('del'),
          util = require('gulp-util'),
          cleanCSS = require('gulp-clean-css'),
          browserSync = require('browser-sync'),
          fs = require('fs'),
          config = require('./gulp.config')();

    const reload = browserSync.reload;

    /**
     * Log a message or series of messages using chalk's blue color.
     * Can pass in a string, object or array.
     */
    function log(msg) {
        if (typeof (msg) === 'object') {
            for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
            }
        } else {
            $.util.log($.util.colors.blue(msg));
        }
    }

    /**
     * Delete all files in a given path
     * @param  {Array}   path - array of paths to delete
     * @param  {Function} done - callback when complete
     */
    function clean(path, done) {
        log('Cleaning: ' + $.util.colors.blue(path));
        del(path, done);
    }

    /**
     * Remove all styles from the build and temp folders
     * @param  {Function} done - callback when complete
     */
    gulp.task('clean-styles', del.bind(null, [config.lib + '**/*.css', config.lib + '**/*.css.map']));

    /**
     * Compile sass to css
     * @return {Stream}
     */
    gulp.task('styles', function() {
        log('Compiling SASS --> CSS');

        return gulp
            .src(config.sass)
            .pipe($.plumber()) // exit gracefully if something fails after this
            .pipe($.sourcemaps.init())
            .pipe($.sass().on('error', $.sass.logError))
            .pipe($.autoprefixer({browsers: ['last 1 version']}))
            .pipe($.rename({ suffix: '.min' }))
            .pipe(gulp.dest(config.lib + 'bootstrap'))
            .pipe(cleanCSS({ compatibility: '*' }))
            .pipe($.sourcemaps.write('.'))            
            .pipe(gulp.dest(config.lib + 'bootstrap'));
    });

    /**
     * Remove all js from the lib folder
     * @param  {Function} done - callback when complete
     */
    gulp.task('clean-code', del.bind(null, [config.lib + '**/*.js', config.lib + '**/*.js.map']));

    // Build JavaScript files 
    gulp.task('bootstrap', function() {
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
            .pipe(gulp.dest('src/client/lib/bootstrap'));
    });

    gulp.task('angularjs', function() {
        return gulp.src(['./bower_components/angular/angular.js'])
            .pipe($.sourcemaps.init())
            .pipe($.plumber())
            .pipe($.uglify({ preserveComments: 'license' }))
            .pipe($.rename({ suffix: '.min' }))
            .pipe($.sourcemaps.write('maps'))
            .pipe(gulp.dest('src/client/lib/ng'));
    });


    gulp.task('code', ['bootstrap', 'angularjs']);

    // Watch tasks

    gulp.task('watch', function() {     
        gulp.watch('scss/*.scss', ['styles']);
        gulp.watch('js/src/*.js', ['scripts']);
    });

    gulp.task('clean', ['clean-code', 'clean-styles']);

    gulp.task('dist', ['styles', 'code']);

    gulp.task('build',['clean'], function() {
        gulp.start('dist');
    });
})();