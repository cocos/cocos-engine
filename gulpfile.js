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

var gulp = require('gulp');
var requireDir = require('require-dir');
var Path = require('path');

MinifyOriginCocos2d = false;     // true - compile by closure, false - just concat

// specify game project paths for tasks.
paths = {
    src: './src',
    jsEntry: './index.js',
    outDir: './bin',
    outFileDev: 'cocos2d-js.js',
    outFile: 'cocos2d-js-min.js',

    jsb: {
        entries: [
            './jsb/index.js',
            './extends.js'
        ],
        outFile: 'jsb_polyfill.js',
        outFileDev: 'jsb_polyfill.dev.js',
        skipModules: [
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
        ],
    },

    test: {
        src: 'test/qunit/unit/**/*.js',
        runner: 'test/qunit/lib/qunit-runner.html',
        jsEntryEditorExtends: '../editor/test-utils/engine-extends-entry.js',     // only available in editor
        dest: 'bin/cocos2d-js-for-test.js',
        destEditorExtends: 'bin/cocos2d-js-extends-for-test.js'
    },

    preview: {
        dest: 'bin/cocos2d-js-for-preview.js',
    },

    modularCocos2d: './bin/modular-cocos2d.js',
};

// require all tasks in gulp/tasks, including sub-folders
requireDir('./gulp/tasks', { recurse: true });

// default task
gulp.task('default', ['build']);
