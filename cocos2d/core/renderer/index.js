/****************************************************************************
 Copyright (c) 2013-2017 Chukong Technologies Inc.

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
 
const renderEngine = require('./render-engine');
const RenderComponentWalker = require('./render-component-walker');
require('./RendererWebGL');

function _initBuiltins(device) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
  
    // default texture
    canvas.width = canvas.height = 128;
    context.fillStyle = '#ddd';
    context.fillRect(0, 0, 128, 128);
    context.fillStyle = '#555';
    context.fillRect(0, 0, 64, 64);
    context.fillStyle = '#555';
    context.fillRect(64, 64, 64, 64);
  
    let defaultTexture = new renderEngine.Texture2D(device, {
        images: [canvas],
        width: 128,
        height: 128,
        wrapS: renderEngine.gfx.WRAP_REPEAT,
        wrapT: renderEngine.gfx.WRAP_REPEAT,
        format: renderEngine.gfx.TEXTURE_FMT_RGB8,
        mipmap: true,
    });
  
    return {
        defaultTexture: defaultTexture,
        programTemplates: renderEngine.shaders.templates,
        programChunks: renderEngine.shaders.chunks,
    };
}

module.exports = {
    canvas: null,
    device: null,
    scene: null,
    materialUtil: null,
    _walker: null,
    _cameraNode: null,
    _camera: null,
    _forward: null,

    init (canvas, opts) {
        this.canvas = canvas;
        this.device = new renderEngine.Device(canvas, opts);
        this.scene = new renderEngine.Scene();
        this.materialUtil = new renderEngine.MaterialUtil();

        this._walker = new RenderComponentWalker(this.device, this.scene);

        this._cameraNode = new cc.Node();
        this._camera = new renderEngine.Camera({
            x: 0, y: 0, w: canvas.width, h: canvas.height
        });
        this._camera._cullingByID = true;
        this._camera._id = -1;

        if (CC_EDITOR) {
            this._camera.setColor(0, 0, 0, 0);
        }
        this._camera.setStages([
            'transparent'
        ]);
        this.scene.addCamera(this._camera);

        let builtins = _initBuiltins(this.device);
        this._forward = new renderEngine.ForwardRenderer(this.device, builtins);
    },

    updateCameraViewport () {
        if (!CC_EDITOR) {
            var ecScene = cc.director.getScene();
            ecScene.scaleX = ecScene.scaleY = 1;
        }

        let cameras = this.scene._cameras;
        for (let i = 0; i < cameras.length; i++) {
            let camera = cameras._data[i];

            camera._rect.w = this.canvas.width;
            camera._rect.h = this.canvas.height;
            camera.setViewport();
        }
        
        this._cameraNode.scaleX = 1 / cc.view.getScaleX();
        this._cameraNode.scaleY = 1 / cc.view.getScaleY();
        this._camera.setNode(this._cameraNode);
    },

    render () {
        var ecScene = cc.director.getScene();
        if (ecScene) {
            // walk entity component scene to generate models
            this._walker.visit(ecScene);
            // Render models in renderer scene
            this._forward.render(this.scene);
        }
    }
};