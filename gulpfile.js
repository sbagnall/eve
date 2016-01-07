var gulp = require('gulp');
var jshint =require('gulp-jshint');
var jasmine = require('gulp-jasmine');

gulp.task('jshint', function () {
	return gulp.src(['./**/*.js', '!./SDD_Proteus/**/*.*', '!./node_modules/**/*.*', '!./eveoj/**/*.*'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('jasmine', function () {
	return gulp.src('./spec/app/**/*.js')
		.pipe(jasmine());
});

gulp.task('default', ['jshint', 'jasmine']);
