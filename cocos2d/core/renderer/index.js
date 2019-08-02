/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
import config from '../../renderer/config';
import gfx from '../../renderer/gfx';

import InputAssembler from '../../renderer/core/input-assembler';
import Pass from '../../renderer/core/pass';

// const RenderFlow = require('./render-flow');

function _initBuiltins(device) {
    let defaultTexture = new gfx.Texture2D(device, {
        images: [],
        width: 128,
        height: 128,
        wrapS: gfx.WRAP_REPEAT,
        wrapT: gfx.WRAP_REPEAT,
        format: gfx.TEXTURE_FMT_RGB8,
        mipmap: false,
    });

    return {
        defaultTexture: defaultTexture,
        programTemplates: [],
        programChunks: {},
    };
}

/**
 * @module cc
 */

/**
 * !#en The renderer object which provide access to render system APIs, 
 * detailed APIs will be available progressively.
 * !#zh 提供基础渲染接口的渲染器对象，渲染层的基础接口将逐步开放给用户
 * @class renderer
 * @static
 */
cc.renderer = module.exports = {
    Texture2D: null,

    InputAssembler: InputAssembler,
    Pass: Pass,

    /**
     * !#en The render engine is available only after cc.game.EVENT_ENGINE_INITED event.<br/>
     * Normally it will be inited as the webgl render engine, but in wechat open context domain,
     * it will be inited as the canvas render engine. Canvas render engine is no longer available for other use case since v2.0.
     * !#zh 基础渲染引擎对象只在 cc.game.EVENT_ENGINE_INITED 事件触发后才可获取。<br/>
     * 大多数情况下，它都会是 WebGL 渲染引擎实例，但是在微信开放数据域当中，它会是 Canvas 渲染引擎实例。请注意，从 2.0 开始，我们在其他平台和环境下都废弃了 Canvas 渲染器。
     * @property renderEngine
     * @deprecated
     * @type {Object}
     */
    renderEngine: null,

    /*
     * !#en The canvas object which provides the rendering context
     * !#zh 用于渲染的 Canvas 对象
     * @property canvas
     * @type {HTMLCanvasElement}
     */
    canvas: null,
    /*
     * !#en The device object which provides device related rendering functionality, it divers for different render engine type.
     * !#zh 提供设备渲染能力的对象，它对于不同的渲染环境功能也不相同。
     * @property device
     * @type {renderer.Device}
     */
    device: null,
    scene: null,
    /**
     * !#en The total draw call count in last rendered frame.
     * !#zh 上一次渲染帧所提交的渲染批次总数。
     * @property drawCalls
     * @type {Number}
     */
    drawCalls: 0,
    // Render component handler
    _handle: null,
    _cameraNode: null,
    _camera: null,
    _forward: null,
    _flow: null,

    initWebGL (canvas, opts) {
        require('./webgl/assemblers');
        const ModelBatcher = require('./webgl/model-batcher');

        this.Texture2D = gfx.Texture2D;
        this.canvas = canvas;
        this._flow = cc.RenderFlow;
        
        if (CC_JSB && CC_NATIVERENDERER) {
            // native codes will create an instance of Device, so just use the global instance.
            this.device = gfx.Device.getInstance();
            this.scene = new renderer.Scene();
            let builtins = _initBuiltins(this.device);
            this._forward = new renderer.ForwardRenderer(this.device, builtins);
            let nativeFlow = new renderer.RenderFlow(this.device, this.scene, this._forward);
            this._flow.init(nativeFlow);
        }
        else {
            let Scene = require('../../renderer/scene/scene');
            let ForwardRenderer = require('../../renderer/renderers/forward-renderer');
            this.device = new gfx.Device(canvas, opts);
            this.scene = new Scene();
            let builtins = _initBuiltins(this.device);
            this._forward = new ForwardRenderer(this.device, builtins);
            this._handle = new ModelBatcher(this.device, this.scene);
            this._flow.init(this._handle, this._forward);
        }
        config.addStage('shadowcast');
        config.addStage('opaque');
        config.addStage('transparent');
    },

    initCanvas (canvas) {
        const canvasRenderer = require('./canvas');
        const Texture2D = require('./canvas/Texture2D');
        const Device = require('./canvas/Device');

        // It's actually running with original render engine
        this.Device = Device;

        this.Texture2D = Texture2D;

        this.canvas = canvas;
        this.device = new Device(canvas);
        this._camera = {
            a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0
        };
        this._handle = new canvasRenderer.RenderComponentHandle(this.device, this._camera);
        this._forward = new canvasRenderer.ForwardRenderer();
        this._flow = cc.RenderFlow;
        this._flow.init(this._handle, this._forward);
    },

    updateCameraViewport () {
        // TODO: remove HACK
        if (!CC_EDITOR && cc.director) {
            let ecScene = cc.director.getScene();
            if (ecScene) ecScene.setScale(1, 1, 1);
        }

        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            let vp = cc.view.getViewportRect();
            this.device.setViewport(vp.x, vp.y, vp.width, vp.height);
            this._camera.a = cc.view.getScaleX();
            this._camera.d = cc.view.getScaleY();
            this._camera.tx = vp.x;
            this._camera.ty = vp.y + vp.height;
        }
    },

    render (ecScene, dt) {
        this.device.resetDrawCalls();
        if (ecScene) {
            // walk entity component scene to generate models
            this._flow.render(ecScene, dt);
            this.drawCalls = this.device.getDrawCalls();
        }
    },

    clear () {
        this._handle.reset();
        this._forward.clear();
    }
};
