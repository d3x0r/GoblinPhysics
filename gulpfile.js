var gulp = require( 'gulp' ),
	uglify = require('gulp-uglify' ),
	concat = require( 'gulp-concat' ),
	jshint = require( 'gulp-jshint' );

gulp.task('lint', function(){
	return gulp.src([
		'src/classes/**/*.js'
	])
	.pipe( jshint() )
	.pipe( jshint.reporter( 'default' ) );
});

gulp.task('build', gulp.series(  'lint', function(){	
	 return gulp.src([
		'src/intro.js',
		'src/classes/Math/**.js',
		'src/libglobals.js',
		'src/classes/EventEmitter.js',
		'src/classes/RigidBody.js',
		'src/classes/ForceGenerator.js',
		'src/classes/**/*.js',
		'src/outro.js'
	])
	.pipe( concat( 'goblin.js' ) )
	.pipe( gulp.dest( 'build' ) );
}));

gulp.task('build-minified', gulp.series('lint', function(){
	return gulp.src([
		'src/intro.js',
		'src/classes/Math/**.js',
		'src/libglobals.js',
		'src/classes/EventEmitter.js',
		'src/classes/RigidBody.js',
		'src/classes/ForceGenerator.js',
		'src/classes/**/*.js',
		'src/outro.js'
	])
	.pipe( concat( 'goblin.min.js' ) )
	.pipe( uglify() )
	.pipe( gulp.dest( 'build' ) );
}));

gulp.task('default', gulp.series( 'build', gulp.series( 'build-minified', function(done){done()})));