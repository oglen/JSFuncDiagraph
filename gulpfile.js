/**
 * Copyright 2006-2015 GrapeCity inc
 * Author: isaac.fang@grapecity.com
 */

var gulp = require('gulp'),
    util = require('gulp-util'),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    nodemon = require('gulp-nodemon'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    amdOptimize = require('amd-optimize'),
    rename = require('gulp-rename'),
    copy2 = require('gulp-copy2'),
    gulpIf = require('gulp-if');

// region lint

gulp.task('lint', function () {
    return gulp.src([
        'app.js',
        'client/*.js',
        'client/app/*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// endregion lint
// region less

gulp.task('less', function () {
    return gulp.src('client/css/main.less')
        .pipe(less())
        .on('error', function (err) {
            util.log(util.colors.red(err));
            this.emit('end');
        })
        .pipe(gulp.dest('client/css/'));
});

gulp.task('less:bower', ['bower'], function () {
    return gulp.src('client/css/main.less')
        .pipe(less())
        .on('error', function (err) {
            util.log(util.colors.red(err));
        })
        .pipe(gulp.dest('client/css/'));
});

// endregion less
// region nodemon

gulp.task('nodemon', function () {
    nodemon({
        script: 'app.js',
        ext: 'js json',
        ignore: ['node_modules/*', 'client/*', 'dist/*', 'gulpfile.js'],
        env: {'NODE_ENV': 'DEVELOPMENT'}
    }).on('restart', function () {
        util.log(util.colors.cyan('nodemon restarted'));
    });
});

// endregion nodemon
// region watch

gulp.task('watch', function () {
    gulp.watch('./client/css/main.less', ['less']);
    gulp.watch('./githook.hb', ['git-hook']);
});

// endregion watch
// region bower

gulp.task('bower', ['clean'], function (done) {
    return bower();
});

// endregion bower

gulp.task('sprites', function () {
    var sprite = require('css-sprite').stream;
    return gulp.src('./client/img/slice/*.png')
        .pipe(sprite({
            name: 'buttons',
            style: 'buttons.less',
            cssPath: '../img/',
            processor: 'less'
        }))
        .pipe(gulpIf('*.png', gulp.dest('./client/img/'), gulp.dest('./client/css/')))
});

// region minify-css

gulp.task('css', ['less:bower'], function () {
    return gulp.src('client/css/main.css')
        //.pipe(minifyCss({
        //    keepSpecialComments: 0
        //}))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('css:minify', ['less:bower'], function () {
    return gulp.src('client/css/main.css')
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('dist/css/'));
});

// endregion minify-css
// region git-hook

gulp.task('git-hook', function (done) {
    gulp.src('githook.hb')
        .pipe(rename('pre-commit'))
        .pipe(gulp.dest('.git/hooks/'))
        .on('end', done);
});

// endregion git-hook
// region clean

gulp.task('clean', function (cb) {
    return del([
        './dist/**'
    ], cb);
});

// endregion clean
// region compress

gulp.task('compress:requirejs', ['bower'], function () {
    gulp.src('client/lib/requirejs/require.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/lib/requirejs/'));
});

gulp.task('compress:app', ['bower'], function () {
    return gulp.src('client/*').
        pipe(amdOptimize('init', {
            baseUrl: 'client/',
            configFile: 'client/build-config.js'
        }))
        .pipe(concat('init.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('concat:app', ['bower'], function () {
    return gulp.src('client/*').
        pipe(amdOptimize('init', {
            baseUrl: 'client/',
            configFile: 'client/build-config.js'
        }))
        .pipe(concat('init.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress-all', ['compress:requirejs', 'compress:app']);

// endregion compress
// region copy

gulp.task('copy', ['clean'], function () {
    return copy2([
        {src: 'client/index.html', dest: 'dist/'},
        {src: 'client/favicon.ico', dest: 'dist/'},
        {src: 'client/img/*.*', dest: 'dist/img/'}
    ]);
});

gulp.task('copy:requirejs', ['clean'], function () {
    return copy2([
        {src: 'client/lib/requirejs/require.js', dest: 'dist/lib/requirejs/'}
    ]);
});

// endregion copy
// region integration

gulp.task('develop', ['nodemon', 'watch', 'git-hook']);

gulp.task('build:without-compress', ['copy', 'css', 'concat:app', 'copy:requirejs']);

gulp.task('build', ['copy', 'css:minify', 'compress-all']);

// endregion integration