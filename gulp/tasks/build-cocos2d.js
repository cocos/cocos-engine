'use strict';

var Path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var es = require('event-stream');
var sourcemaps = require('gulp-sourcemaps');

var srcs = [
    './Base64Images.js',
    './CCBoot.js',

    './cocos2d/core/platform/CCCommon.js',
    './cocos2d/core/platform/CCSAXParser.js',
    './cocos2d/core/platform/CCLoaders.js',
    './cocos2d/core/platform/CCConfig.js',
    './cocos2d/core/platform/miniFramework.js',
    './cocos2d/core/platform/CCEGLView.js',
    './cocos2d/core/platform/CCScreen.js',
    './cocos2d/core/platform/CCVisibleRect.js',

    './cocos2d/core/support/CCVertex.js',
    './cocos2d/core/support/TransformUtils.js',

    './cocos2d/core/event-manager/CCTouch.js',
    './cocos2d/core/event-manager/CCSystemEvent.js',
    './cocos2d/core/event-manager/CCEventListener.js',
    './cocos2d/core/event-manager/CCEventManager.js',

    './cocos2d/core/renderer/RendererCanvas.js',
    './cocos2d/core/renderer/RendererWebGL.js',

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
    './cocos2d/core/sprites/CCAnimation.js',
    './cocos2d/core/sprites/CCAnimationCache.js',
    './cocos2d/core/sprites/CCSpriteFrameCache.js',
    './cocos2d/core/sprites/CCSpriteBatchNode.js',
    './cocos2d/core/sprites/CCSpriteBatchNodeCanvasRenderCmd.js',
    './cocos2d/core/sprites/CCSpriteBatchNodeWebGLRenderCmd.js',

    './cocos2d/core/sprites/CCScale9Sprite.js',
    './cocos2d/core/sprites/CCScale9SpriteCanvasRenderCmd.js',
    './cocos2d/core/sprites/CCScale9SpriteWebGLRenderCmd.js',

    './cocos2d/core/CCConfiguration.js',
    './cocos2d/core/CCCamera.js',
    './cocos2d/core/CCScheduler.js',

    './cocos2d/core/CCDrawingPrimitivesCanvas.js',
    './cocos2d/core/CCDrawingPrimitivesWebGL.js',

    './cocos2d/core/label/FNTLoader.js',
    './cocos2d/core/label/CCSGLabel.js',
    './cocos2d/core/label/CCSGLabelCanvasRenderCmd.js',
    './cocos2d/core/label/CCSGLabelWebGLRenderCmd.js',

    './cocos2d/core/editbox/CCSGEditBox.js',
    './cocos2d/core/editBox/CCdomNode.js',

    './cocos2d/kazmath/utility.js',
    './cocos2d/kazmath/vec2.js',
    './cocos2d/kazmath/vec3.js',
    './cocos2d/kazmath/vec4.js',
    './cocos2d/kazmath/ray2.js',
    './cocos2d/kazmath/mat3.js',
    './cocos2d/kazmath/mat4.js',
    './cocos2d/kazmath/plane.js',
    './cocos2d/kazmath/quaternion.js',
    './cocos2d/kazmath/aabb.js',
    './cocos2d/kazmath/gl/mat4stack.js',
    './cocos2d/kazmath/gl/matrix.js',

    './cocos2d/shaders/CCShaders.js',
    './cocos2d/shaders/CCShaderCache.js',
    './cocos2d/shaders/CCGLProgram.js',
    './cocos2d/shaders/CCGLStateCache.js',

    './cocos2d/render-texture/CCRenderTexture.js',
    './cocos2d/render-texture/CCRenderTextureCanvasRenderCmd.js',
    './cocos2d/render-texture/CCRenderTextureWebGLRenderCmd.js',

    './cocos2d/shape-nodes/CCDrawNode.js',
    './cocos2d/shape-nodes/CCDrawNodeCanvasRenderCmd.js',
    './cocos2d/shape-nodes/CCDrawNodeWebGLRenderCmd.js',

    './cocos2d/clipping-nodes/CCClippingNode.js',
    './cocos2d/clipping-nodes/CCClippingNodeCanvasRenderCmd.js',
    './cocos2d/clipping-nodes/CCClippingNodeWebGLRenderCmd.js',

    './cocos2d/core/CCActionManager.js',
    './cocos2d/actions/CCAction.js',
    './cocos2d/actions/CCActionInterval.js',
    './cocos2d/actions/CCActionInstant.js',
    './cocos2d/actions/CCActionEase.js',
    './cocos2d/actions/CCActionCatmullRom.js',

    './cocos2d/progress-timer/CCProgressTimer.js',
    './cocos2d/progress-timer/CCProgressTimerCanvasRenderCmd.js',
    './cocos2d/progress-timer/CCProgressTimerWebGLRenderCmd.js',
    './cocos2d/progress-timer/CCActionProgressTimer.js',

    './cocos2d/compression/ZipUtils.js',
    './cocos2d/compression/base64.js',
    './cocos2d/compression/gzip.js',
    './cocos2d/compression/zlib.min.js',

    './cocos2d/particle/CCPNGReader.js',
    './cocos2d/particle/CCTIFFReader.js',
    './cocos2d/particle/CCSGParticleSystem.js',
    './cocos2d/particle/CCSGParticleSystemCanvasRenderCmd.js',
    './cocos2d/particle/CCSGParticleSystemWebGLRenderCmd.js',
    './cocos2d/particle/CCSGParticleExamples.js',
    './cocos2d/particle/CCParticleBatchNode.js',
    './cocos2d/particle/CCParticleBatchNodeCanvasRenderCmd.js',
    './cocos2d/particle/CCParticleBatchNodeWebGLRenderCmd.js',

    './cocos2d/menus/CCMenuItem.js',
    './cocos2d/menus/CCMenu.js',

    './cocos2d/tilemap/CCTGAlib.js',
    './cocos2d/tilemap/CCSGTMXTiledMap.js',
    './cocos2d/tilemap/CCTMXXMLParser.js',
    './cocos2d/tilemap/CCTMXObjectGroup.js',
    './cocos2d/tilemap/CCSGTMXLayer.js',
    './cocos2d/tilemap/CCTMXLayerCanvasRenderCmd.js',
    './cocos2d/tilemap/CCTMXLayerWebGLRenderCmd.js',

    './cocos2d/parallax/CCParallaxNode.js',
    './cocos2d/parallax/CCParallaxNodeRenderCmd.js',

    './extensions/ccpool/CCPool.js',

    './cocos2d/physics/CCPhysicsDebugNode.js',
    './cocos2d/physics/CCPhysicsDebugNodeCanvasRenderCmd.js',
    './cocos2d/physics/CCPhysicsDebugNodeWebGLRenderCmd.js',

    './external/chipmunk/chipmunk.js'
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
