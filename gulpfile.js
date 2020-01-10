"use strict";

let gulp = require("gulp"),
    csso = require("gulp-csso"),
	httpServ = require('http-server'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	cp = require("child_process");


// HTTP server
gulp.task("serve", function() {
	return cp.spawn("npx http-server -o -c-1", { stdio: "inherit", shell: true });
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("sass", function() {
	return gulp.src( 'sass/**/*.scss')
		.pipe( sass().on('error', sass.logError))
		.pipe( csso())
		.pipe( gulp.dest( './css/' ))
        .pipe(browserSync.stream())
	;
});

gulp.task("watch", function() {
	gulp.watch( 'sass/**/*.scss', gulp.series('sass') );
	gulp.watch('css/*.css').on('change',browserSync.reload);
	gulp.watch('*.html').on('change',browserSync.reload);
	gulp.watch('*.js').on('change',browserSync.reload);
});

gulp.task("default", gulp.series('sass', 'watch'));