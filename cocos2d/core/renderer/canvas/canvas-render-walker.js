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

const js = require('../../platform/js');
const renderers = require('./renderers');

let RenderComponentWalker = function (device, defaultCamera) {
    this._device = device;
    // let vx = this._device._vx;
    // let vy = this._device._vy;
    // let vh = this._device._vh;
    this._camera = defaultCamera;
    this._renderHandler = this._handleRender.bind(this);
    this._postRenderHandler = this._postHandleRender.bind(this);
};

RenderComponentWalker.prototype = {
    constructor: RenderComponentWalker,
    
    reset() {},

    _handleRender (node) {
        let comp = node._renderComponent;
        let opacity = node.opacity;
        let assembler = comp && comp.constructor._assembler;
        if (opacity && assembler) {
            this._render(comp, assembler);
        }
    },

    _postHandleRender (node) {
        let comp = node._renderComponent;
        let opacity = node.opacity;
        let postAssembler = comp && comp.constructor._postAssembler;
        if (opacity && postAssembler) {
            this._render(comp, postAssembler);
        }
    },

    _render (comp, renderer) {
        let ctx = this._device._ctx;
        let cam = this._camera;
        ctx.setTransform(cam.a, cam.b, cam.c, cam.d, cam.tx, cam.ty);
        let drawCall = renderer.draw(ctx, comp);
        this._device._stats.drawcalls += drawCall;
    },

    visit (scene) {
        let ctx = this._device._ctx;
        let canvas = this._device._canvas;
        let background = cc.Camera.main.backgroundColor;
        ctx.fillStyle = 'rgba(' + background.r + ', ' + background.g + ', ' + background.b + ', ' + background.a + ')';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this._device._stats.drawcalls = 0;
        scene.walk(this._renderHandler, this._postRenderHandler);
    }
}

module.exports = RenderComponentWalker;