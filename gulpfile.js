var gulp = require('gulp');
var jshint =require('gulp-jshint');
var jasmine = require('gulp-jasmine');

gulp.task('jshint', function () {
	return gulp.src(['./**/*.js', '!./node_modules/**/*.*', '!./eveoj/**/*.*', '!./sdd2json/**/*.*'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('jasmine', function () {
	return gulp.src('./spec/**/*.js')
		.pipe(jasmine());
});

gulp.task('default', ['jshint', 'jasmine']);
