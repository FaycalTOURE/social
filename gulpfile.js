'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', ['sass'], function() {
    browserSync.init({
        // server: {
        //     baseDir: "./"
        // },
        proxy: {
            target: "localhost:8080",
            ws: true
        }
    });
});

gulp.task('sass', function () {
    return gulp.src('./public/css/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('serve', ['browser-sync'], function () {
    gulp.watch("./public/css/scss/**/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});