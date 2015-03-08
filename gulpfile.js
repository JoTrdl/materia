var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');

gulp.task('compile_css', function () {
    gulp.src('./sass/materia.scss')
        .pipe(sass({ errLogToConsole: true }))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'IE 8'],
            cascade: false
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function () {
	gulp.watch('./sass/**/*.scss', ['compile_css']);
});

gulp.task('connect', function() {
  connect.server();
});

gulp.task('build', ['compile_css'], function() {
	 gulp.src('dist/')
 		.pipe(clean({force: true}));

  	gulp.src('./materia.css')
    	.pipe(minifyCSS())
    	.pipe(gulp.dest('./dist/'));

    gulp.src(['fonts/**/*']).pipe(gulp.dest('dist/fonts'));

    gulp.src([
    		'js/jquery.min.js',
    		'js/jquery.easing.js',
    		'js/bootstrap.min.js',
    		'js/jquery.mtr*.js'
    	])
    	.pipe(concat('materia.js'))
    	.pipe(uglify())
    	.pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['compile_css', 'watch']);