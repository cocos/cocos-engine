var Path = require('path');
var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function (done) {
    del(Path.join(paths.outDir, '**/*'));
    del(paths.originCocos2d, done);
});
