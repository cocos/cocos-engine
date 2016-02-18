var gulp = require('gulp');
var requireDir = require('require-dir');
var Path = require('path');

MinifyOriginCocos2d = false;     // true - compile by closure, false - just concat

// specify game project paths for tasks.
paths = {
    src: './src',
    jsEntry: './index.js',
    JSBEntries: [
        './jsb/index.js',
        './extends.js'
    ],
    outDir: './bin',
    outFile: 'cocos2d-js.js',
    JSBOutFile: 'jsb.js',

    JSBSkipModules: [
        '../../cocos2d/core/CCGame',
        '../../cocos2d/core/textures/CCTexture2D',
        '../../cocos2d/core/sprites/CCSpriteFrame',
        '../../cocos2d/core/platform/CCLoader',
        '../../cocos2d/core/platform/CCLoaders',
        '../../cocos2d/core/event/event',
        '../../extensions/spine/SGSkeleton',
        '../../extensions/spine/SGSkeletonAnimation',
        '../../extensions/spine/SGSkeletonCanvasRenderCmd',
        '../../extensions/spine/SGSkeletonWebGLRenderCmd',
        '../../extensions/spine/lib/spine',
    ],

    test: {
        src: 'test/qunit/unit/**/*.js',
        runner: 'test/qunit/lib/qunit-runner.html',
        jsEntryEditorExtends: '../editor/test-utils/engine-extends-entry.js',     // only available in editor
        dest: 'bin/cocos2d-js-for-test.js',
        destEditorExtends: 'bin/cocos2d-js-extends-for-test.js'
    },

    modularCocos2d: './bin/modular-cocos2d.js',
};

// require all tasks in gulp/tasks, including sub-folders
requireDir('./gulp/tasks', { recurse: true });

// default task
gulp.task('default', ['build']);
