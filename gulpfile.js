var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('hello', () => {
    console.log('Hello Carlos!');
});

gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: 'app'
        }
    })
});

gulp.task('sass', () => {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});


gulp.task('useref', () => {

    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true,
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', () => {
    return del.sync('dist').then((callback) => {
        return cache.clearAll(callback);
    });
});

gulp.task('clean:dist', () => {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('default', (callback) => {
    runSequence(['sass', 'browserSync'], 'watch',
        callback
    );
});

gulp.task('build', (callback) => {
    runSequence(
        'clean:dist',
        'sass',
        ['useref', 'images', 'fonts'],
        callback
    );
});