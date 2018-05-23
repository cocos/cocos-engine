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
const RenderFlow = require('../render-flow');

let RenderComponentWalker = function (device, defaultCamera) {
    this._device = device;
    // let vx = this._device._vx;
    // let vy = this._device._vy;
    // let vh = this._device._vh;
    this._camera = defaultCamera;

    this.worldMatDirty = 0;
    
    RenderFlow.init(this);
};

RenderComponentWalker.prototype = {
    constructor: RenderComponentWalker,
    
    reset() {},

    _commitComp (comp, assembler, cullingMask) {
        let ctx = this._device._ctx;
        let cam = this._camera;
        ctx.setTransform(cam.a, cam.b, cam.c, cam.d, cam.tx, cam.ty);
        assembler.draw(ctx, comp);
    },

    visit (scene) {
        let ctx = this._device._ctx;
        let canvas = this._device._canvas;
        let background = cc.Camera.main.backgroundColor;
        ctx.fillStyle = 'rgba(' + background.r + ', ' + background.g + ', ' + background.b + ', ' + background.a + ')';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this._device._stats.drawcalls = 0;

        RenderFlow.render(scene);
    }
}

module.exports = RenderComponentWalker;