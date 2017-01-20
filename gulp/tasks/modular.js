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
const Async = require('async');
const gulp = require('gulp');
const File = require('vinyl');
const concat = require('gulp-concat');
const es = require('event-stream');
const sourcemaps = require('gulp-sourcemaps');

var modules = {
    'Core': [
        './cocos2d/core/base-nodes/BaseNodesPropertyDefine.js',
        './cocos2d/core/base-nodes/CCSGNode.js',
        './cocos2d/core/base-nodes/CCSGNodeCanvasRenderCmd.js',
        './cocos2d/core/base-nodes/CCSGNodeWebGLRenderCmd.js',
        './cocos2d/core/scenes/CCSGScene.js',
        './cocos2d/core/CCConfiguration.js',
        './cocos2d/core/CCDrawingPrimitivesCanvas.js',
        './cocos2d/core/CCDrawingPrimitivesWebGL.js'
    ],

    'Sprite': [
        './cocos2d/core/sprites/SpritesPropertyDefine.js',
        './cocos2d/core/sprites/CCSGSprite.js',
        './cocos2d/core/sprites/CCSGSpriteCanvasRenderCmd.js',
        './cocos2d/core/sprites/CCSGSpriteWebGLRenderCmd.js',
        './cocos2d/core/sprites/CCScale9Sprite.js',
        './cocos2d/core/sprites/CCScale9SpriteCanvasRenderCmd.js',
        './cocos2d/core/sprites/CCScale9SpriteWebGLRenderCmd.js'
    ],

    'Label': [
        './cocos2d/core/label/CCTextUtils.js',
        './cocos2d/core/label/CCSGLabel.js',
        './cocos2d/core/label/CCSGLabelCanvasRenderCmd.js',
        './cocos2d/core/label/CCSGLabelWebGLRenderCmd.js'
    ],

    'Mask': [
        './cocos2d/shape-nodes/CCDrawNode.js',
        './cocos2d/shape-nodes/CCDrawNodeCanvasRenderCmd.js',
        './cocos2d/shape-nodes/CCDrawNodeWebGLRenderCmd.js',
        './cocos2d/clipping-nodes/CCClippingNode.js',
        './cocos2d/clipping-nodes/CCClippingNodeCanvasRenderCmd.js',
        './cocos2d/clipping-nodes/CCClippingNodeWebGLRenderCmd.js'
    ],

    'ParticleSystem': [
        './cocos2d/particle/CCSGParticleSystem.js',
        './cocos2d/particle/CCSGParticleSystemCanvasRenderCmd.js',
        './cocos2d/particle/CCSGParticleSystemWebGLRenderCmd.js',
        './cocos2d/particle/CCParticleBatchNode.js',
        './cocos2d/particle/CCParticleBatchNodeCanvasRenderCmd.js',
        './cocos2d/particle/CCParticleBatchNodeWebGLRenderCmd.js'
    ],

    'TiledMap': [
        './cocos2d/tilemap/CCSGTMXTiledMap.js',
        './cocos2d/tilemap/CCTMXXMLParser.js',
        './cocos2d/tilemap/CCSGTMXObjectGroup.js',
        './cocos2d/tilemap/CCSGTMXObject.js',
        './cocos2d/tilemap/CCSGTMXLayer.js',
        './cocos2d/tilemap/CCTMXLayerCanvasRenderCmd.js',
        './cocos2d/tilemap/CCTMXLayerWebGLRenderCmd.js'
    ],

    'EditorBox': [
        './cocos2d/core/editbox/CCSGEditBox.js'
    ],

    'VideoPlayer': [
        './cocos2d/core/videoplayer/CCSGVideoPlayer.js'
    ],

    'WebView': [
        './cocos2d/core/webview/CCSGWebView.js'
    ],

    'MotionStreak': [
        './cocos2d/motion-streak/CCSGMotionStreak.js',
        './cocos2d/motion-streak/CCSGMotionStreakWebGLRenderCmd.js',
        './cocos2d/render-texture/CCRenderTexture.js',
        './cocos2d/render-texture/CCRenderTextureCanvasRenderCmd.js',
        './cocos2d/render-texture/CCRenderTextureWebGLRenderCmd.js'
    ]

};

/**
 * 在生成合并文件的时候插入模块头尾
 * @returns {*}
 */
function wrapFile() {
    var cwd = process.cwd();
    var headerFile = new File({
        cwd: cwd, base: cwd, path: Path.resolve('header.js'),
        contents: new Buffer('(function (cc, ccui, ccs, cp) {\n')
    });
    var footerFile = new File({
        cwd: cwd, base: cwd, path: Path.resolve('footer.js'),
        contents: new Buffer('\n}).call(window, cc, ccui, ccs, cp);\n')
    });
    var isHeaderInserted = false;
    return es.through(function (file) {
        if (!isHeaderInserted) {
            this.emit('data', headerFile);
            isHeaderInserted = true;
        }
        //file.contents = Buffer.concat([header, file.contents, footer]);
        this.emit('data', file);
    }, function () {
        this.emit('data', footerFile);
        this.emit('end');
    });
}

exports.buildModular = function ( outFile, outDir, exModule, callback ) {

    var list = [];
    for (let name in modules) {
        if (exModule.indexOf(name) !== -1) continue;
        let files = modules[name];
        files.forEach((file) => {
            list.push(file);
        });
    }

    list = list.map(function (file) {
        return Path.join(__dirname, '../../', file);
    });

    return gulp.src(list)
        .pipe(wrapFile())
        .pipe(sourcemaps.init())
        .pipe(concat(outFile))
        .pipe(sourcemaps.write('./'))
        .pipe(es.through(function (file) {
            var content = file.contents.toString();
            content = content.replace(/\r\n/g, '\n');
            file.contents = new Buffer(content);
            this.emit('data', file);
        }))
        .pipe(gulp.dest(outDir))
        .on('end', callback);
};

exports.buildFileWithoutModular = function ( outDir, done ) {
    var list = [];

    for (let name in modules) {
        let files = modules[name];
        list.push({
            name: name,
            files: files
        });
    }

    outDir = Path.join(__dirname, '../../', outDir, 'modules');
    Async.eachSeries(list, function ( item, next ) {
        return gulp.src(item.files.map(function ( path ) {
            console.log(Path.join(__dirname, '../../', path));
                return Path.join(__dirname, '../../', path)
            }))
            .pipe(concat(item.name + '.js'))
            .pipe(gulp.dest(outDir))
            .on('end', next);
    }, function () {
        done();
    });
};
