var Path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var Spawn = require('child_process').spawn;
var Chalk = require('chalk');
var es = require('event-stream');
var sourcemaps = require('gulp-sourcemaps');

var srcs = [
    "./Base64Images.js",
    "./CCBoot.js",

    "./cocos2d/core/platform/CCCommon.js",
    "./cocos2d/core/platform/CCSAXParser.js",
    "./cocos2d/core/platform/CCLoaders.js",
    "./cocos2d/core/platform/CCConfig.js",
    "./cocos2d/core/platform/miniFramework.js",
    "./cocos2d/core/platform/CCEGLView.js",
    "./cocos2d/core/platform/CCScreen.js",
    "./cocos2d/core/platform/CCVisibleRect.js",

    "./cocos2d/core/support/CCPointExtension.js",
    "./cocos2d/core/support/CCVertex.js",
    "./cocos2d/core/support/TransformUtils.js",

    "./cocos2d/core/event-manager/CCTouch.js",
    "./cocos2d/core/event-manager/CCSystemEvent.js",
    "./cocos2d/core/event-manager/CCEventListener.js",
    "./cocos2d/core/event-manager/CCEventManager.js",

    "./cocos2d/core/renderer/RendererCanvas.js",
    "./cocos2d/core/renderer/RendererWebGL.js",

    "./cocos2d/core/base-nodes/BaseNodesPropertyDefine.js",
    "./cocos2d/core/base-nodes/CCNode.js",
    "./cocos2d/core/base-nodes/CCNodeCanvasRenderCmd.js",
    "./cocos2d/core/base-nodes/CCNodeWebGLRenderCmd.js",

    "./extensions/ccui/base-classes/CCProtectedNode.js",
    "./extensions/ccui/base-classes/CCProtectedNodeCanvasRenderCmd.js",
    "./extensions/ccui/base-classes/CCProtectedNodeWebGLRenderCmd.js",

    "./cocos2d/core/base-nodes/CCAtlasNode.js",
    "./cocos2d/core/base-nodes/CCAtlasNodeCanvasRenderCmd.js",
    "./cocos2d/core/base-nodes/CCAtlasNodeWebGLRenderCmd.js",

    "./cocos2d/core/scenes/CCScene.js",
    "./cocos2d/core/scenes/CCLoaderScene.js",

    "./cocos2d/core/layers/CCLayer.js",
    "./cocos2d/core/layers/CCLayerCanvasRenderCmd.js",
    "./cocos2d/core/layers/CCLayerWebGLRenderCmd.js",

    "./cocos2d/core/sprites/SpritesPropertyDefine.js",
    "./cocos2d/core/sprites/CCSprite.js",
    "./cocos2d/core/sprites/CCSpriteCanvasRenderCmd.js",
    "./cocos2d/core/sprites/CCSpriteWebGLRenderCmd.js",
    "./cocos2d/core/sprites/CCBakeSprite.js",
    "./cocos2d/core/sprites/CCAnimation.js",
    "./cocos2d/core/sprites/CCAnimationCache.js",
    "./cocos2d/core/sprites/CCSpriteFrameCache.js",
    "./cocos2d/core/sprites/CCSpriteBatchNode.js",
    "./cocos2d/core/sprites/CCSpriteBatchNodeCanvasRenderCmd.js",
    "./cocos2d/core/sprites/CCSpriteBatchNodeWebGLRenderCmd.js",

    "./cocos2d/core/CCConfiguration.js",
    "./cocos2d/core/CCCamera.js",
    "./cocos2d/core/CCScheduler.js",

    "./cocos2d/core/CCDrawingPrimitivesCanvas.js",
    "./cocos2d/core/CCDrawingPrimitivesWebGL.js",

    "./cocos2d/core/labelttf/LabelTTFPropertyDefine.js",
    "./cocos2d/core/labelttf/CCLabelTTF.js",
    "./cocos2d/core/labelttf/CCLabelTTFCanvasRenderCmd.js",
    "./cocos2d/core/labelttf/CCLabelTTFWebGLRenderCmd.js",

    "./cocos2d/core/CCActionManager.js",

    "./cocos2d/kazmath/utility.js",
    "./cocos2d/kazmath/vec2.js",
    "./cocos2d/kazmath/vec3.js",
    "./cocos2d/kazmath/vec4.js",
    "./cocos2d/kazmath/ray2.js",
    "./cocos2d/kazmath/mat3.js",
    "./cocos2d/kazmath/mat4.js",
    "./cocos2d/kazmath/plane.js",
    "./cocos2d/kazmath/quaternion.js",
    "./cocos2d/kazmath/aabb.js",
    "./cocos2d/kazmath/gl/mat4stack.js",
    "./cocos2d/kazmath/gl/matrix.js",

    "./cocos2d/shaders/CCShaders.js",
    "./cocos2d/shaders/CCShaderCache.js",
    "./cocos2d/shaders/CCGLProgram.js",
    "./cocos2d/shaders/CCGLStateCache.js",

    "./cocos2d/render-texture/CCRenderTexture.js",
    "./cocos2d/render-texture/CCRenderTextureCanvasRenderCmd.js",
    "./cocos2d/render-texture/CCRenderTextureWebGLRenderCmd.js",

    "./cocos2d/labels/CCLabelAtlas.js",
    "./cocos2d/labels/CCLabelAtlasCanvasRenderCmd.js",
    "./cocos2d/labels/CCLabelAtlasWebGLRenderCmd.js",
    "./cocos2d/labels/CCLabelBMFont.js",
    "./cocos2d/labels/CCLabelBMFontCanvasRenderCmd.js",
    "./cocos2d/labels/CCLabelBMFontWebGLRenderCmd.js",
    "./cocos2d/labels/CCLabel.js",
    "./cocos2d/labels/CCLabelCanvasRenderCmd.js",
    "./cocos2d/labels/CCLabelWebGLRenderCmd.js",
    "./cocos2d/shape-nodes/CCDrawNode.js",
    "./cocos2d/shape-nodes/CCDrawNodeCanvasRenderCmd.js",
    "./cocos2d/shape-nodes/CCDrawNodeWebGLRenderCmd.js",

    "./cocos2d/clipping-nodes/CCClippingNode.js",
    "./cocos2d/clipping-nodes/CCClippingNodeCanvasRenderCmd.js",
    "./cocos2d/clipping-nodes/CCClippingNodeWebGLRenderCmd.js",

    "./cocos2d/actions/CCAction.js",
    "./cocos2d/actions/CCActionInterval.js",
    "./cocos2d/actions/CCActionInstant.js",
    "./cocos2d/actions/CCActionEase.js",
    "./cocos2d/actions/CCActionCatmullRom.js",
    "./cocos2d/actions/CCActionTween.js",

    "./cocos2d/progress-timer/CCProgressTimer.js",
    "./cocos2d/progress-timer/CCProgressTimerCanvasRenderCmd.js",
    "./cocos2d/progress-timer/CCProgressTimerWebGLRenderCmd.js",
    "./cocos2d/progress-timer/CCActionProgressTimer.js",

    "./cocos2d/compression/ZipUtils.js",
    "./cocos2d/compression/base64.js",
    "./cocos2d/compression/gzip.js",
    "./cocos2d/compression/zlib.min.js",

    "./cocos2d/particle/CCPNGReader.js",
    "./cocos2d/particle/CCTIFFReader.js",
    "./cocos2d/particle/CCParticleSystem.js",
    "./cocos2d/particle/CCParticleSystemCanvasRenderCmd.js",
    "./cocos2d/particle/CCParticleSystemWebGLRenderCmd.js",
    "./cocos2d/particle/CCParticleExamples.js",
    "./cocos2d/particle/CCParticleBatchNode.js",
    "./cocos2d/particle/CCParticleBatchNodeCanvasRenderCmd.js",
    "./cocos2d/particle/CCParticleBatchNodeWebGLRenderCmd.js",

    "./cocos2d/text-input/CCIMEDispatcher.js",
    "./cocos2d/text-input/CCTextFieldTTF.js",

    "./cocos2d/menus/CCMenuItem.js",
    "./cocos2d/menus/CCMenu.js",

    "./cocos2d/tilemap/CCTGAlib.js",
    "./cocos2d/tilemap/CCTMXTiledMap.js",
    "./cocos2d/tilemap/CCTMXXMLParser.js",
    "./cocos2d/tilemap/CCTMXObjectGroup.js",
    "./cocos2d/tilemap/CCTMXLayer.js",
    "./cocos2d/tilemap/CCTMXLayerCanvasRenderCmd.js",
    "./cocos2d/tilemap/CCTMXLayerWebGLRenderCmd.js",

    "./cocos2d/parallax/CCParallaxNode.js",
    "./cocos2d/parallax/CCParallaxNodeRenderCmd.js",

    "./cocos2d/audio/CCAudio.js",

    "./extensions/ccui/system/CocosGUI.js",
    "./extensions/ccui/base-classes/UIWidget.js",
    "./extensions/ccui/base-classes/UIWidgetRenderCmd.js",
    "./extensions/ccui/base-classes/UIScale9Sprite.js",
    "./extensions/ccui/base-classes/UIScale9SpriteCanvasRenderCmd.js",
    "./extensions/ccui/base-classes/UIScale9SpriteWebGLRenderCmd.js",
    "./extensions/ccui/layouts/UILayout.js",
    "./extensions/ccui/layouts/UILayoutCanvasRenderCmd.js",
    "./extensions/ccui/layouts/UILayoutWebGLRenderCmd.js",
    "./extensions/ccui/layouts/UILayoutParameter.js",
    "./extensions/ccui/layouts/UILayoutManager.js",
    "./extensions/ccui/layouts/UIHBox.js",
    "./extensions/ccui/layouts/UIVBox.js",
    "./extensions/ccui/layouts/UIRelativeBox.js",
    "./extensions/ccui/system/UIHelper.js",
    "./extensions/ccui/uiwidgets/UIButton.js",
    "./extensions/ccui/uiwidgets/UICheckBox.js",
    "./extensions/ccui/uiwidgets/UIImageView.js",
    "./extensions/ccui/uiwidgets/UILoadingBar.js",
    "./extensions/ccui/uiwidgets/UISlider.js",
    "./extensions/ccui/uiwidgets/UIText.js",
    "./extensions/ccui/uiwidgets/UITextAtlas.js",
    "./extensions/ccui/uiwidgets/UITextBMFont.js",
    "./extensions/ccui/uiwidgets/UITextField.js",
    "./extensions/ccui/uiwidgets/UIWebView.js",
    "./extensions/ccui/uiwidgets/UIVideoPlayer.js",
    "./extensions/ccui/uiwidgets/UIRichText.js",
    "./extensions/ccui/uiwidgets/scroll-widget/UIScrollView.js",
    "./extensions/ccui/uiwidgets/scroll-widget/UIListView.js",
    "./extensions/ccui/uiwidgets/scroll-widget/UIPageView.js",
    "./extensions/ccui/uiwidgets/scroll-widget/UIScrollViewCanvasRenderCmd.js",
    "./extensions/ccui/uiwidgets/scroll-widget/UIScrollViewWebGLRenderCmd.js",
    "./extensions/cocostudio/components/CCComponent.js",
    "./extensions/ccui/layouts/UILayoutComponent.js",
    "./extensions/cocostudio/components/CCComponentContainer.js",

    "./extensions/spine/Spine.js",
    "./extensions/spine/CCSkeleton.js",
    "./extensions/spine/CCSkeletonCanvasRenderCmd.js",
    "./extensions/spine/CCSkeletonWebGLRenderCmd.js",
    "./extensions/spine/CCSkeletonAnimation.js",

    "./extensions/ccpool/CCPool.js"
];

gulp.task('compile-cocos2d', function (done) {
    console.log('Spawn ant in ' + paths.originCocos2dCompileDir);

    var spawn = require('child_process').spawn;
    var cmdStr = process.platform === 'win32' ? 'ant.bat' : 'ant';
    var child = Spawn(cmdStr, {
        cwd: paths.originCocos2dCompileDir,
        stdio: [0, 1, 'pipe']
    });
    child.on('error', function (err) {
        var ANT = Chalk.inverse('ant');
        if (err.code === 'ENOENT') {
            console.error(Chalk.red('You should install %s to build cocos2d-html5'), ANT);
        }
        else {
            console.error(Chalk.red('Failed to start %s') + ': %s', ANT, err.code);
        }
        process.exit(1);
    });
    child.stderr.on('data', function (data) {
        process.stderr.write(Chalk.red(data.toString()));
    });
    child.on('exit', function (code) {
        if (code === 0) {
            done();
        }
        else {
            process.exit(1);
        }
    });
});

var header = new Buffer('(function (cc, ccui, ccs, sp, cp) {\n');
var footer = new Buffer('\n}).call(window, cc, ccui, ccs, sp, cp);\n');

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

if (MinifyOriginCocos2d) {
    gulp.task('build-modular-cocos2d', ['compile-cocos2d'], function () {
        return gulp.src(paths.originCocos2dDev)
            .pipe(wrap(header, footer))
            .pipe(rename(Path.basename(paths.modularCocos2d)))
            .pipe(gulp.dest(Path.dirname(paths.modularCocos2d)));
        // gulp.src(paths.originCocos2d)
        //     .pipe(wrap(header, footer))
        //     .pipe(rename(Path.basename(paths.modularCocos2d)))
        //     .pipe(gulp.dest(Path.dirname(paths.modularCocos2d)));
        // gulp.src(paths.originSourcemap)
        //     .pipe(gulp.dest(Path.dirname(paths.modularCocos2d)));
    });
}
else {
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
}
