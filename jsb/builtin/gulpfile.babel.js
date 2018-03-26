import gulp from 'gulp';
import sourcemaps from "gulp-sourcemaps";
import babelify from "babelify";
import browserify from 'browserify';
import source from "vinyl-source-stream";
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';

gulp.task("default", ()=>{
  return browserify('./index.js')
         .transform(babelify)
         .bundle()
         .pipe(source('jsb.js'))
         .pipe(buffer())
         // .pipe(sourcemaps.init({ loadMaps: true }))
         // .pipe(uglify()) // Use any gulp plugins you want now
         // .pipe(sourcemaps.write('./'))
         .pipe(gulp.dest('./dist'));
});