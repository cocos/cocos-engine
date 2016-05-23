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

var Path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var es = require('event-stream');
var sourcemaps = require('gulp-sourcemaps');

var srcs = [

    './cocos2d/core/base-nodes/BaseNodesPropertyDefine.js',
    './cocos2d/core/base-nodes/CCSGNode.js',
    './cocos2d/core/base-nodes/CCSGNodeCanvasRenderCmd.js',
    './cocos2d/core/base-nodes/CCSGNodeWebGLRenderCmd.js',

    './cocos2d/core/scenes/CCSGScene.js',
    './cocos2d/core/scenes/CCLoaderScene.js',

    './cocos2d/core/layers/CCLayer.js',
    './cocos2d/core/layers/CCLayerCanvasRenderCmd.js',
    './cocos2d/core/layers/CCLayerWebGLRenderCmd.js',

    './cocos2d/core/sprites/SpritesPropertyDefine.js',
    './cocos2d/core/sprites/CCSGSprite.js',
    './cocos2d/core/sprites/CCSGSpriteCanvasRenderCmd.js',
    './cocos2d/core/sprites/CCSGSpriteWebGLRenderCmd.js',
    './cocos2d/core/sprites/CCBakeSprite.js',
    './cocos2d/core/sprites/CCSpriteBatchNode.js',
    './cocos2d/core/sprites/CCSpriteBatchNodeCanvasRenderCmd.js',
    './cocos2d/core/sprites/CCSpriteBatchNodeWebGLRenderCmd.js',

    './cocos2d/core/sprites/CCScale9Sprite.js',
    './cocos2d/core/sprites/CCScale9SpriteCanvasRenderCmd.js',
    './cocos2d/core/sprites/CCScale9SpriteWebGLRenderCmd.js',

    './cocos2d/core/CCConfiguration.js',

    './cocos2d/core/CCDrawingPrimitivesCanvas.js',
    './cocos2d/core/CCDrawingPrimitivesWebGL.js',

    './cocos2d/core/label/CCSGLabel.js',
    './cocos2d/core/label/CCSGLabelCanvasRenderCmd.js',
    './cocos2d/core/label/CCSGLabelWebGLRenderCmd.js',

    './cocos2d/core/editbox/CCSGEditBox.js',
    './cocos2d/core/editBox/CCdomNode.js',

    './cocos2d/core/videoplayer/CCSGVideoPlayer.js',

    './cocos2d/render-texture/CCRenderTexture.js',
    './cocos2d/render-texture/CCRenderTextureCanvasRenderCmd.js',
    './cocos2d/render-texture/CCRenderTextureWebGLRenderCmd.js',

    './cocos2d/shape-nodes/CCDrawNode.js',
    './cocos2d/shape-nodes/CCDrawNodeCanvasRenderCmd.js',
    './cocos2d/shape-nodes/CCDrawNodeWebGLRenderCmd.js',

    './cocos2d/clipping-nodes/CCClippingNode.js',
    './cocos2d/clipping-nodes/CCClippingNodeCanvasRenderCmd.js',
    './cocos2d/clipping-nodes/CCClippingNodeWebGLRenderCmd.js',

    './cocos2d/particle/CCSGParticleSystem.js',
    './cocos2d/particle/CCSGParticleSystemCanvasRenderCmd.js',
    './cocos2d/particle/CCSGParticleSystemWebGLRenderCmd.js',
    // './cocos2d/particle/CCSGParticleExamples.js',
    './cocos2d/particle/CCParticleBatchNode.js',
    './cocos2d/particle/CCParticleBatchNodeCanvasRenderCmd.js',
    './cocos2d/particle/CCParticleBatchNodeWebGLRenderCmd.js',

    './cocos2d/tilemap/CCSGTMXTiledMap.js',
    './cocos2d/tilemap/CCTMXXMLParser.js',
    './cocos2d/tilemap/CCTMXObjectGroup.js',
    './cocos2d/tilemap/CCSGTMXLayer.js',
    './cocos2d/tilemap/CCTMXLayerCanvasRenderCmd.js',
    './cocos2d/tilemap/CCTMXLayerWebGLRenderCmd.js',

    './cocos2d/parallax/CCParallaxNode.js',
    './cocos2d/parallax/CCParallaxNodeRenderCmd.js',

    './cocos2d/physics/CCPhysicsDebugNode.js',
    './cocos2d/physics/CCPhysicsDebugNodeCanvasRenderCmd.js',
    './cocos2d/physics/CCPhysicsDebugNodeWebGLRenderCmd.js',

    './cocos2d/motion-streak/CCSGMotionStreak.js',
    './cocos2d/motion-streak/CCSGMotionStreakWebGLRenderCmd.js'

];

var header = new Buffer('(function (cc, ccui, ccs, cp) {\n');
var footer = new Buffer('\n}).call(window, cc, ccui, ccs, cp);\n');

//function wrap (header, footer) {
//    return es.through(function (file) {
//        file.contents = Buffer.concat([header, file.contents, footer]);
//        this.emit('data', file);
//    });
//}

var File = require('vinyl');
function wrapFile (header, footer) {
    var headerFile = new File({
        cwd: process.cwd(),
        base: process.cwd(),
        path: Path.resolve('header.js'),
        contents: header
    });
    var footerFile = new File({
        cwd: process.cwd(),
        base: process.cwd(),
        path: Path.resolve('footer.js'),
        contents: footer
    });
    var isHeaderInserted = false;
    return es.through(
        function (file) {
            if (!isHeaderInserted) {
                this.emit('data', headerFile);
                isHeaderInserted = true;
            }
            //file.contents = Buffer.concat([header, file.contents, footer]);
            this.emit('data', file);
        },
        function () {
            this.emit('data', footerFile);
            this.emit('end');
        }
    );
}

gulp.task('build-modular-cocos2d', function () {
    return gulp.src(srcs)
        .pipe(wrapFile(header, footer))
        .pipe(sourcemaps.init())
            .pipe(concat(Path.basename(paths.modularCocos2d)))
        .pipe(sourcemaps.write('./'))
        //.pipe(wrap(header, footer))

        .pipe(es.through(
            function (file) {
                var content = file.contents.toString();
                content = content.replace(/\r\n/g , '\n');
                file.contents = new Buffer(content);
                this.emit('data', file);
            }
        ))

        .pipe(gulp.dest(Path.dirname(paths.modularCocos2d)));
});
