var browserify  = require('browserify'),
    cover	    = require('gulp-coverage'),
    gulp	    = require('gulp'),
    gutil	    = require('gulp-util'),
    jshint      = require('gulp-jshint'),
    mocha	    = require('gulp-mocha'),
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
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter(''))
})

gulp.task('test', function(){
    return gulp.src(['test/test*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            }
        }))
})


gulp.task('cover', function(){
    return gulp.src(['test/test*.js'], { read: false })
        .pipe(cover.instrument({
            pattern: [
                'src/**'
            ]
        }))
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            }
        }))
        .pipe(cover.report({
            outFile: 'coverage.html',
            reporter: 'html'
        }))
})
