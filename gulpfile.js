const gulp = require('gulp');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso');
const exec = require('child_process').exec;

// Element build
gulp.task('element-build', callback => {
    exec('mkdir -p dist && node build/build.js', function(err, stdout, stderr) {
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.log(stderr);
        }
        callback(err);
    });
});

// Copy images
gulp.task('image', () => {
    return gulp.src('img/*').pipe(gulp.dest('dist/img'));
});

// Copy assets
gulp.task('assets', () => {
    return gulp.src('assets/*').pipe(gulp.dest('dist/assets'));
});

// Minify files
gulp.task('minify-js', () => {
    return gulp
        .src('assets/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets'));
});
gulp.task('minify-css', () => {
    return gulp
        .src('assets/*.css')
        .pipe(csso())
        .pipe(gulp.dest('dist/assets'));
});

// Default build
gulp.task(
    'default',
    gulp.series([
        'element-build',
        'assets',
        gulp.parallel(['image', 'minify-js', 'minify-css'])
    ])
);

// Watch when in development
gulp.task('watch', gulp.parallel(function watch () {
    gulp.watch('assets/*', gulp.parallel('assets'));
    gulp.watch('img/*', gulp.parallel('image'));
    gulp.watch('build/*', gulp.parallel('element-build'));
}));

// Development
gulp.task(
    'dev',
    gulp.series([
        'element-build',
        'assets',
        'image',
        'watch'
    ])
);
