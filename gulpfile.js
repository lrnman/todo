var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sourceMap = require('gulp-sourcemaps');
var sequence = require('run-sequence');
var del = require('del');
var cleanCss = require('gulp-clean-css');
var webServer = require('gulp-webserver');

gulp.task('uglifyJs', function(cb){
	pump([
		gulp.src('dist/js/all.js'),
		sourceMap.init(),
		uglify(),
		rename({extname: '.min.js'}),
		sourceMap.write('./'),
		gulp.dest('./dist/js')
	], cb);
});

gulp.task('concatJs', function(cb){
	pump([
		gulp.src(['js/main.js', 'js/models/*.js', 
		'js/collections/*.js', 'js/views/TodoItemView.js', 'js/views/TodoAppView.js', 'js/routes/Router.js']),
		concat('all.js'),
		gulp.dest('./dist/js')
	], cb);
});

gulp.task('del_js', function(){
	del.sync('dist/js');
});

gulp.task('js', function(){
	sequence('del_js', 'concatJs', 'uglifyJs');
});

gulp.task('cleanCss', function(cb){
	pump([
		gulp.src('dist/css/all.css'),
		sourceMap.init(),
		cleanCss(),
		rename({extname: '.min.css'}),
		sourceMap.write('./'),
		gulp.dest('dist/css')
	], cb);
});

gulp.task('concatCss', function(cb){
	pump([
		gulp.src(['css/load.css', 'css/index.css']),
		concat('all.css'),
		gulp.dest('dist/css')
	], cb);
});

gulp.task('del_css', function(){
	del.sync('dist/css');
});

gulp.task('css', function(){
	sequence('del_css', 'concatCss', 'cleanCss');
});

gulp.task('watcher', ['webServer'], function(){
	gulp.watch('js/**/*.*', ['js']);
	gulp.watch('css/*.*', ['css']);
});

gulp.task('webServer', function(cb){
	pump([
		gulp.src('./'), 
		webServer({ 
	        livereload: true,
	        open: true
    	})
	], cb);
});
