var browserify  = require('browserify'),
    gulp	    = require('gulp'),
    jshint      = require('gulp-jshint'),
    source	    = require('vinyl-source-stream')


gulp.task('build', function() {
    var b = browserify({
        entries: [
            'index.js'
        ],
        paths: [
            'src/'
        ]
    })
    .ignore('backbone')
    .ignore('underscore')
    .ignore('jquery')
    .bundle()
    .pipe(source('kinView.js'))
    .pipe(gulp.dest('./'))
})

gulp.task('lint', function(){
    return gulp.src([
            'src/**/*.js'
        ])
        .on('error', err)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter(''))
})
