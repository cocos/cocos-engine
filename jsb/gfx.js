/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
 
let {enums, glTextureFmt} = require("./enums");
let VertexFormat = require("./vertex-format-jsb");

window.device = gfx.Device.getInstance();
window.device._gl = window.gl;

//FIXME:
window.device._stats = { vb: 0 };
window.device._caps = {
    maxVextexTextures: 16,
    maxFragUniforms: 1024,
    maxTextureUints: 8,
    maxVertexAttributes: 16,
    maxDrawBuffers: 8,
    maxColorAttatchments: 8
};

device.setBlendColor32 = device.setBlendColor;

_p = gfx.Program.prototype;
_p._ctor = function(device, options) {
    this.init(device, options.vert, options.frag);
};

_p = gfx.VertexBuffer.prototype;
_p._ctor = function(device, format, usage, data, numVertices) {
    this.init(device, format._nativeObj, usage, data, numVertices);
    this._nativePtr = this.self();
};
cc.defineGetterSetter(_p, "count", _p.getCount);

_p = gfx.IndexBuffer.prototype;
_p._ctor = function(device, format, usage, data, numIndices) {
    this.init(device, format, usage, data, numIndices);
    this._nativePtr = this.self();
};
cc.defineGetterSetter(_p, "count", _p.getCount);

gfx.VertexFormat = VertexFormat;
Object.assign(gfx, enums);

function convertImages(images) {
    if (images) {
        for (let i = 0, len = images.length; i < len; ++i) {
            let image = images[i];
            if (image !== null) {
                if (image instanceof window.HTMLCanvasElement) {
                    if (image._data) {
                        images[i] = image._data._data;
                    }
                    else {
                        images[i] = null;
                    }
                }
                else if (image instanceof window.HTMLImageElement) {
                    images[i] = image._data;
                }
            }
        }
    }
}

_p = gfx.Texture2D.prototype;
_p._ctor = function(device, options) {
    convertImages(options.images);
    this.init(device, options);
};
_p.destroy = function() { 
};
_p.update = function(options) {
    convertImages(options.images);
    this.updateBinding(options);
};
cc.defineGetterSetter(_p, "_width", _p.getWidth);
cc.defineGetterSetter(_p, "_height", _p.getHeight);

_p = gfx.FrameBuffer.prototype;
_p._ctor = function(device, width, height, options) {
    this.init(device, width, height, options);
};

var TextHAlignment = {
    LEFT : 0,
    CENTER : 1,
    RIGHT : 2
};

var TextVAlignment = {
    TOP : 0,
    CENTER : 1,
    BOTTOM : 2
};

var DeviceTextAlign = {
    CENTER        : 0x33, /** Horizontal center and vertical center. */
    TOP           : 0x13, /** Horizontal center and vertical top. */
    TOP_RIGHT     : 0x12, /** Horizontal right and vertical top. */
    RIGHT         : 0x32, /** Horizontal right and vertical center. */
    BOTTOM_RIGHT  : 0x22, /** Horizontal right and vertical bottom. */
    BOTTOM        : 0x23, /** Horizontal center and vertical bottom. */
    BOTTOM_LEFT   : 0x21, /** Horizontal left and vertical bottom. */
    LEFT          : 0x31, /** Horizontal left and vertical center. */
    TOP_LEFT      : 0x11 /** Horizontal left and vertical top. */
}

gfx.RB_FMT_D16 = 0x81A5; // GL_DEPTH_COMPONENT16 hack for JSB
