/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const renderEngine = require('./render-engine');
const RenderComponentWalker = require('./render-component-walker');
const math = renderEngine.math;

let _pos = math.vec3.create();

function _initBuiltins(device) {
    let defaultTexture = new renderEngine.Texture2D(device, {
        images: [],
        width: 128,
        height: 128,
        wrapS: renderEngine.gfx.WRAP_REPEAT,
        wrapT: renderEngine.gfx.WRAP_REPEAT,
        format: renderEngine.gfx.TEXTURE_FMT_RGB8,
        mipmap: false,
    });
  
    return {
        defaultTexture: defaultTexture,
        programTemplates: renderEngine.shaders.templates,
        programChunks: renderEngine.shaders.chunks,
    };
}

module.exports = {
    renderEngine: renderEngine,
    Texture2D: null,

    canvas: null,
    device: null,
    scene: null,
    drawCalls: 0,
    _walker: null,
    _cameraNode: null,
    _camera: null,
    _forward: null,

    initWebGL (canvas, opts) {
        require('./assemblers');

        this.Texture2D = renderEngine.Texture2D;

        this.canvas = canvas;
        this.device = new renderEngine.Device(canvas, opts);
        this.scene = new renderEngine.Scene();

        this._walker = new RenderComponentWalker(this.device, this.scene);

        if (CC_EDITOR) {
            this._cameraNode = new cc.Node();

            this._camera = new renderEngine.Camera();
            this._camera.setColor(0, 0, 0, 1);
            this._camera.setFov(Math.PI * 60 / 180);
            this._camera.setNear(0.1);
            this._camera.setFar(1024);
            this._camera.setNode(this._cameraNode);

            let view = new renderEngine.View();
            this._camera.view = view;
            this._camera.dirty = true;
            
            if (CC_EDITOR) {
                this._camera.setColor(0, 0, 0, 0);
            }
            this._camera.setStages([
                'transparent'
            ]);
            this.scene.addCamera(this._camera);
        }

        let builtins = _initBuiltins(this.device);
        this._forward = new renderEngine.ForwardRenderer(this.device, builtins);
    },

    initCanvas (canvas) {
        let canvasRenderer = require('./canvas');
        
        this.Texture2D = renderEngine.canvas.Texture2D;

        this.canvas = canvas;
        this.device = new renderEngine.canvas.Device(canvas);
        this._camera = {
            a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0
        };
        this._walker = new canvasRenderer.RenderComponentWalker(this.device, this._camera);
        this._forward = new canvasRenderer.ForwardRenderer();
    },

    updateCameraViewport () {
        // TODO: remove HACK
        if (!CC_EDITOR && cc.director) {
            let ecScene = cc.director.getScene();
            ecScene.scaleX = ecScene.scaleY = 1;
        }

        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            let vp = cc.view.getViewportRect();
            this.device.setViewport(vp.x, vp.y, vp.width, vp.height);
            this._camera.a = cc.view.getScaleX();
            this._camera.d = cc.view.getScaleY();
            this._camera.tx = vp.x;
            this._camera.ty = vp.y + vp.height;
        }
        else if (CC_EDITOR && this.canvas) {
            let canvas = this.canvas;
            let scaleX = cc.view.getScaleX();
            let scaleY = cc.view.getScaleY();

            let node = this._cameraNode;
            _pos.x = node.x = canvas.width / scaleX / 2;
            _pos.y = node.y = canvas.height / scaleY / 2;
            _pos.z = 0;

            node.z = canvas.height / scaleY / 1.1566;
            node.lookAt(_pos);
            this._camera.dirty = true;
        }
    },

    render (ecScene) {
        this.device._stats.drawcalls = 0;
        if (ecScene) {
            // walk entity component scene to generate models
            this._walker.visit(ecScene);
            // Render models in renderer scene
            this._forward.render(this.scene);
            this.drawCalls = this.device._stats.drawcalls;
        }
    },

    clear () {
        this._walker.reset();
        this._forward._reset();
    }
};