/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

const Path = require('path');
const gulp = require('gulp');
const Del = require('del');
const Shell = require('gulp-shell');

const Modular = require('./gulp/tasks/modular');
const Engine = require('./gulp/tasks/engine');
const Test = require('./gulp/tasks/test');
const Watch = require('./gulp/tasks/watch');

///////////////
// modular //
///////////////

//gulp.task('build-file-without-module', function (done) {
//    Modular.buildFileWithoutModular(paths.outDir, done);
//});
gulp.task('build-all-modular', function (done) {
    Modular.buildModular('modular-cocos2d.js', './bin', [], done);
});
gulp.task('build-cut-modular', function (done) {
    Modular.buildModular('modular-cocos2d-cut.js', './bin', [], done);
});

gulp.task('build-modular-cocos2d', ['build-all-modular', 'build-cut-modular'], function (done) {
    Del(['./bin/cocos2d-js.js', './bin/cocos2d-js-min.js', './bin/.cache'], done);
});


/////////////
// engine //
/////////////

gulp.task('build-cocos2d-dev', ['build-modular-cocos2d'], function (done) {
    Engine.buildCocosJs('./index.js', './bin/cocos2d-js.js', ['./bin/modular-cocos2d-cut.js'], done);
});

gulp.task('build-cocos2d-min', ['build-modular-cocos2d'], function (done) {
    Engine.buildCocosJsMin('./index.js', './bin/cocos2d-js-min.js', ['./bin/modular-cocos2d-cut.js'], done);
});

gulp.task('build-html5', ['build-cocos2d-dev', 'build-cocos2d-min']);

gulp.task('build-preview', ['build-modular-cocos2d'], function (done) {
    Engine.buildPreview('./index.js', './bin/cocos2d-js-for-preview.js', done);
});

var jsbSkipModules = [
    '../../cocos2d/core/CCGame',
    '../../cocos2d/core/textures/CCTexture2D',
    '../../cocos2d/core/sprites/CCSpriteFrame',
    '../../cocos2d/core/event/event',
    '../../cocos2d/core/load-pipeline/audio-downloader',
    '../../cocos2d/audio/CCAudio',
    '../../extensions/spine/SGSkeleton',
    '../../extensions/spine/SGSkeletonAnimation',
    '../../extensions/spine/SGSkeletonCanvasRenderCmd',
    '../../extensions/spine/SGSkeletonWebGLRenderCmd',
    '../../extensions/spine/lib/spine',
    '../../extensions/dragonbones/lib/dragonBones',
    '../../extensions/dragonbones/CCFactory',
    '../../extensions/dragonbones/CCArmatureDisplay',
    '../../extensions/dragonbones/CCSlot',
    '../../extensions/dragonbones/CCTextureData',
    '../../external/box2d/box2d.js',
    '../../cocos2d/core/physics/platform/CCPhysicsDebugDraw.js',
    '../../cocos2d/core/physics/platform/CCPhysicsUtils.js',
    '../../cocos2d/core/physics/platform/CCPhysicsAABBQueryCallback.js',
    '../../cocos2d/core/physics/platform/CCPhysicsRayCastCallback.js',
    '../../cocos2d/core/physics/platform/CCPhysicsContactListner.js',
];

gulp.task('build-jsb-extends-dev', function (done) {
    Engine.buildJsb([
        './jsb/index.js',
        './extends.js'
    ], './bin/jsb_polyfill.dev.js', jsbSkipModules, done);
});

gulp.task('build-jsb-extends-min', function (done) {
    Engine.buildJsbMin([
        './jsb/index.js',
        './extends.js'
    ], './bin/jsb_polyfill.js', jsbSkipModules, done);
});

gulp.task('build-jsb', ['build-jsb-extends-dev', 'build-jsb-extends-min']);

gulp.task('build-min', ['build-html5', 'build-jsb']);


/////////
// test //
/////////

gulp.task('clean-test', function (done) {
    Test.clean([
        './bin/cocos2d-js-extends-for-test.js',
        './bin/cocos2d-js-for-test.js'
    ], done);
});

gulp.task('build-test', ['build-modular-cocos2d', 'clean-test'], function (done) {
    Test.build('./index.js', './bin/cocos2d-js-for-test.js',
               '../editor/test-utils/engine-extends-entry.js','./bin/cocos2d-js-extends-for-test.js',
               done);
});

gulp.task('unit-runner', ['build-test'], function (done) {
    Test.unit('./bin', [
        './bin/cocos2d-js-for-test.js'
    ], done);
});

gulp.task('test', ['build-test', 'unit-runner'], function (done) {
    Test.test(done);
});

gulp.task('visual-test', ['build-test'], Shell.task([
    'sh ./test/visual-tests/run.sh'
]));

gulp.task('test-no-build', function (done) {
    Test.test(done);
});

////////////
// global //
////////////

gulp.task('build-dev', ['build-preview', 'build-jsb'], function (done) {
    // make dist version dirty
    Del(['./bin/.cache'], done);
});

gulp.task('build', ['build-html5', 'build-preview', 'build-jsb'], function (done) {
    Del(['./bin/.cache'], done);
});

// default task
gulp.task('default', ['build']);

gulp.task('clean', function (done) {
    Del(Path.join('./bin', '**/*'), done);
});

////////////
// watch //
////////////

gulp.task('watch-preview', function () {
    Watch.preview('./index.js', './bin/cocos2d-js-for-preview.js');
});

gulp.task('watch-jsb-polyfill', function () {
    Watch.jsbPolyfill([
        './jsb/index.js',
        './extends.js'
    ], './bin/jsb_polyfill.dev.js', jsbSkipModules);
});

gulp.task('watch-dev-files', ['watch-preview', 'watch-jsb-polyfill']);
