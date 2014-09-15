var browserify  = require('browserify'),
    cover	    = require('gulp-coverage'),
    gulp	    = require('gulp'),
    gutil	    = require('gulp-util'),
    gulpif	    = require('gulp-if'),
    jshint      = require('gulp-jshint'),
    minimist    = require('minimist'),
    mocha	    = require('gulp-mocha'),
    source	    = require('vinyl-source-stream'),
    through2	= require('through2')

var args = minimist(process.argv.slice(3), {
    default: {
        cover: true,
        html: false
    }
})

var processCover = through2.obj(function (stats, enc, done) {
        var lines = stats.coverage.sloc
        var total = stats.coverage.coverage
        total = isNaN(parseFloat(total)) ? 0 : total
        gutil.log(
            'Test coverage:',
            gutil.colors.magenta(total),
            gutil.colors.magenta('%'),
            '(',
            gutil.colors.magenta(lines),
            gutil.colors.magenta('lines'),
            ')'
        )
        if (stats.coverage.uncovered.length) {
            gutil.log('Untestd files:', stats.coverage.uncovered)
        }
        done()
    },
    function (done) {
        // keep on piping!
        done()
})

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
        .pipe(gulpif(args.cover, cover.instrument({
            pattern: [
                'src/**'
            ]
        })))
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            }
        }))
        .pipe(gulpif(args.cover, cover.gather()))
        .pipe(gulpif(args.cover, processCover))
        .pipe(gulpif(args.cover && args.html, cover.report({
            outFile: 'coverage.html',
            reporter: 'html'
        })))
})
