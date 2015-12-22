var Fs = require('fire-fs');
var gulp = require('gulp');
var fb = require('gulp-fb');
var shell = require('gulp-shell');

var TimeOutInSeconds = 5;

gulp.task('unit-runner', function() {
    var js = paths.test.src;
    var dest = paths.outDir;
    var libs = [paths.test.dest];
    var title = 'Cocos2d-JS Test Suite';
    if (Fs.existsSync(paths.test.destEditorExtends)) {
        libs.push(paths.test.destEditorExtends);
        title += ' (Editor Extends Included)'
    }
    return gulp.src(js, { read: false, base: './' })
        .pipe(fb.toFileList())
        .pipe(fb.generateRunner(paths.test.runner, dest, title, libs))
        .pipe(gulp.dest(dest));
});

function test () {
    var qunit;
    try {
        qunit = require('gulp-qunit');
    }
    catch (e) {
        console.error('Please run "npm install gulp-qunit" before running "gulp test".');
        throw e;
    }
    return gulp.src('bin/qunit-runner.html', { read: false })
        .pipe(qunit({ timeout: TimeOutInSeconds }));
}

gulp.task('test', ['build-test', 'unit-runner'], test);
gulp.task('visual-test', ['build-test'], shell.task([
    'sh ./test/visual-tests/run.sh'
]));
gulp.task('rerun-test', test);
