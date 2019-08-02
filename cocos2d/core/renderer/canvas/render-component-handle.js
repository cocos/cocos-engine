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

const utils = require('./renderers/utils')

let RenderComponentHandle = function (device, defaultCamera) {
    this._device = device;
    // let vx = this._device._vx;
    // let vy = this._device._vy;
    // let vh = this._device._vh;
    this._camera = defaultCamera;

    this.parentOpacity = 1;
    this.parentOpacityDirty = 0;
    this.worldMatDirty = 0;
    this.walking = false;
};

RenderComponentHandle.prototype = {
    constructor: RenderComponentHandle,
    
    reset() {
        let ctx = this._device._ctx;
        let canvas = this._device._canvas;
        var color = cc.Camera.main ? cc.Camera.main.backgroundColor : cc.color();
        let rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a/255})`;
        ctx.fillStyle = rgba;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this._device._stats.drawcalls = 0;
        //reset cache data
        utils.context.reset();
    },

    terminate () {

    }
};

module.exports = RenderComponentHandle;