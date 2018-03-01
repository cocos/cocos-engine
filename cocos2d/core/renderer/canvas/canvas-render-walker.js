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

const js = require('../../platform/js');
const renderers = require('./renderers');
const rendererMap = renderers.map;
const postRendererMap = renderers.postMap;

let RenderComponentWalker = function (device, defaultCamera) {
    this._device = device;
    let vx = this._device._vx;
    let vy = this._device._vy;
    let vh = this._device._vh;
    this._camera = defaultCamera;
};

RenderComponentWalker.prototype = {
    constructor: RenderComponentWalker,
    
    reset() {},

    _handleRender (node) {
        let comp = node._renderComponent;
        let compName = js.getClassName(comp);
        if (compName && rendererMap[compName]) {
            rendererMap[compName](comp);
        }
    },

    _postHandleRender (node) {
        let comp = node._renderComponent;
        let compName = js.getClassName(comp);
        if (compName && postRendererMap[compName]) {
            postRendererMap[compName](comp);
        }
    },

    _render (comp, renderer) {
        let ctx = this._device._ctx;
        let cam = this._camera;
        ctx.setTransform(cam.a, cam.b, cam.c, cam.d, cam.tx, cam.ty);
        let drawCall = renderer(ctx, comp);
        this._device._stats.drawcalls += drawCall;
    },

    visit (scene) {
        this._device._stats.drawcalls = 0;
        scene.walk(this._handleRender, this._postHandleRender);
    }
}

module.exports = RenderComponentWalker;