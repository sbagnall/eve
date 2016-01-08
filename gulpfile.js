var gulp = require('gulp');
var jshint =require('gulp-jshint');
var jasmine = require('gulp-jasmine');

gulp.task('jshint', function () {
	return gulp.src([
			'./**/*.js', 
			'!./SDD_Proteus/**/*.*', 
			'!./node_modules/**/*.*', 
			'!./eveoj/**/*.*', 
			'!./spec/eveoj/**/*.*'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('jasmine', function () {
	return gulp.src(
			['./spec/**/*.js', 
			'!./spec/eveoj/**/*.*'])
		.pipe(jasmine({verbose:false, includeStackTrace:true}));
});

gulp.task('default', ['jshint', 'jasmine']);
