var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');

/*gulp.task('build', function() {
	return browserify({ entries: './src/build/RoomsView', extensions: ['.jsx'], debug: true })
		.transform('babelify', { presets: ['es2015', 'react'] })
		.bundle()
		.pipe(source('bundleRooms.js'))
		.pipe(gulp.dest('./src/build'));
	})*/

/*gulp.task('build1', function() {
	return browserify({ entries: './src/build/ConnectionBox', extensions: ['.jsx'], debug: true })
		.transform('babelify', { presets: ['es2015', 'react'] })
		.bundle()
		.pipe(source('bundleConBox.js'))
		.pipe(gulp.dest('./src/build'));
	})*/

/*gulp.task('build2', function() {
	return browserify({ entries: './src/clientRecord', extensions: ['.js'], debug: true})
		.transform('babelify', { presets: ['es2015'] })
		.bundle()
		.pipe(source('finalP2Ptest.js'))
		.pipe(gulp.dest('./src'))
	})*/

gulp.task('build3', function() {
	return browserify({ entries: './src/rooms', extensions: ['.js'], debug: true})
		.transform('babelify', { presets: ['es2015', 'react'] })
		.bundle()
		.pipe(source('roomsFinal.js'))
		.pipe(gulp.dest('./src/build'))
	})

gulp.task('default', ['build3']);
