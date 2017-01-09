/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

var EventTarget = require('../../core/event/event-target');
var sys = require('../../core/platform/CCSys');
var JS = require('../../core/platform/js');
var misc = require('../../core/utils/misc');
var game = require('../../core/CCGame');
require('../../core/platform/_CCClass');
require('../../core/platform/CCClass');

/**
 * The texture wrap mode
 * @enum Texture2D.WrapMode
 */
var WrapMode = cc.Enum({
    REPEAT: 0x2901,
    CLAMP_TO_EDGE: 0x812f,
    MIRRORED_REPEAT: 0x8370
});

var Texture = cc.Class(/** @lends cc.Texture2D# */{

    name: 'cc.Texture',
    extends: require('../../core/assets/CCRawAsset'),
    mixins: [EventTarget],

    statics: {
        WrapMode: WrapMode
    },

    ctor: function () {
        this.url = null;
        this._textureLoaded = false;
        this._htmlElementObj = null;
        this._contentSize = cc.size(0, 0);
        this._pixelWidth = 0;
        this._pixelHeight = 0;
        this._internalTexture = new cc3d.Texture(cc._renderContext);
        {
            this._pixelFormat = Texture.defaultPixelFormat;
            this._hasPremultipliedAlpha = false;
            this._hasMipmaps = false;

            this._webTextureObj = null;
        }
    },


    getPixelWidth: function () {
        return this._pixelWidth;
    },

    getPixelHeight: function () {
        return this._pixelHeight;
    },

    getContentSize: function () {
        return cc.size(this._contentSize.width, this._contentSize.height);
    },

    _getWidth: function () {
        return this._contentSize.width;
    },
    _getHeight: function () {
        return this._contentSize.height;
    },

    getContentSizeInPixels: function () {
        return this._contentSize;
    },

    getHtmlElementObj: function () {
        return this._htmlElementObj;
    },

    isLoaded: function () {
        return this._textureLoaded;
    },

    handleLoadedTexture: function () {
        var self = this;
        if (!self._htmlElementObj) {
            var img = cc.loader.getRes(self.url);
            if (!img) return;
            self.initWithElement(img);
        }
        if (!self._htmlElementObj.width || !self._htmlElementObj.height)
            return;

        var locElement = self._htmlElementObj;
        self._pixelWidth = self._contentSize.width = locElement.width;
        self._pixelHeight = self._contentSize.height = locElement.height;
        self._textureLoaded = true;

        //dispatch load event to listener.
        self.emit("load");
    },

    description: function () {
        return "<cc.Texture2D | Name = " + this.getName() + " | Dimensions = " + this.getPixelWidth() + " x " + this.getPixelHeight() + ">";
    },

    releaseTexture: function () {
        //todo add implementation here
        //if (this._webTextureObj)
        //    cc._renderContext.deleteTexture(this._webTextureObj);
        //cc.loader.release(this._uuid || this.url);
    },

    getName: function () {
        return this._webTextureObj || null;
    },

    getPixelFormat: function () {
        //support only in WebGl rendering mode
        return this._pixelFormat || null;
    },

    hasPremultipliedAlpha: function () {
        return this._hasPremultipliedAlpha || false;
    },

    hasMipmaps: function () {
        return this._hasMipmaps || false;
    },
    initWithData: function (data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
       //todo add implementation here
    },
    initWithImage: function (uiImage) {
        //todo add implementation here
    },

    initWithElement: function (element) {
        if (!element)
            return;
        this._htmlElementObj = element;
        this._pixelWidth = this._contentSize.width = element.width;
        this._pixelHeight = this._contentSize.height = element.height;
        this._textureLoaded = true;
        this._internalTexture.setSource(element);
    },

    // [premultiplied=false]
    handleLoadedTexture: function () {},

    setTexParameters: function (texParams, magFilter, wrapS, wrapT) {},

    setAntiAliasTexParameters: function () {},

    setAliasTexParameters: function () {},

    generateMipmap: function () {},

    stringForFormat: function () {
        return Texture._M[this._pixelFormat];
    },

    bitsPerPixelForFormat: function (format) {//TODO I want to delete the format argument, use this._pixelFormat
        format = format || this._pixelFormat;
        var value = Texture._B[format];
        if (value != null) return value;
        cc.log(cc._LogInfos.Texture2D.bitsPerPixelForFormat, format);
        return -1;
    },

});

Texture.WrapMode = WrapMode;

var _c = Texture;

_c.PIXEL_FORMAT_RGBA8888 = 2;
_c.PIXEL_FORMAT_RGB888 = 3;
_c.PIXEL_FORMAT_RGB565 = 4;
_c.PIXEL_FORMAT_A8 = 5;
_c.PIXEL_FORMAT_I8 = 6;
_c.PIXEL_FORMAT_AI88 = 7;
_c.PIXEL_FORMAT_RGBA4444 = 8;
_c.PIXEL_FORMAT_RGB5A1 = 7;
_c.PIXEL_FORMAT_PVRTC4 = 9;
_c.PIXEL_FORMAT_PVRTC2 = 10;
_c.PIXEL_FORMAT_DEFAULT = _c.PIXEL_FORMAT_RGBA8888;
_c.defaultPixelFormat = _c.PIXEL_FORMAT_DEFAULT;

var _M = Texture._M = {};
_M[_c.PIXEL_FORMAT_RGBA8888] = "RGBA8888";
_M[_c.PIXEL_FORMAT_RGB888] = "RGB888";
_M[_c.PIXEL_FORMAT_RGB565] = "RGB565";
_M[_c.PIXEL_FORMAT_A8] = "A8";
_M[_c.PIXEL_FORMAT_I8] = "I8";
_M[_c.PIXEL_FORMAT_AI88] = "AI88";
_M[_c.PIXEL_FORMAT_RGBA4444] = "RGBA4444";
_M[_c.PIXEL_FORMAT_RGB5A1] = "RGB5A1";
_M[_c.PIXEL_FORMAT_PVRTC4] = "PVRTC4";
_M[_c.PIXEL_FORMAT_PVRTC2] = "PVRTC2";

var _B = Texture._B = {};
_B[_c.PIXEL_FORMAT_RGBA8888] = 32;
_B[_c.PIXEL_FORMAT_RGB888] = 24;
_B[_c.PIXEL_FORMAT_RGB565] = 16;
_B[_c.PIXEL_FORMAT_A8] = 8;
_B[_c.PIXEL_FORMAT_I8] = 8;
_B[_c.PIXEL_FORMAT_AI88] = 16;
_B[_c.PIXEL_FORMAT_RGBA4444] = 16;
_B[_c.PIXEL_FORMAT_RGB5A1] = 16;
_B[_c.PIXEL_FORMAT_PVRTC4] = 4;
_B[_c.PIXEL_FORMAT_PVRTC2] = 3;

var _p = Texture.prototype;

// Extended properties
/** @expose */
_p.name;
cc.defineGetterSetter(_p, "name", _p.getName);
/** @expose */
_p.pixelFormat;
cc.defineGetterSetter(_p, "pixelFormat", _p.getPixelFormat);
/** @expose */
_p.pixelWidth;
cc.defineGetterSetter(_p, "pixelWidth", _p.getPixelWidth);
/** @expose */
_p.pixelHeight;
cc.defineGetterSetter(_p, "pixelHeight", _p.getPixelHeight);
/** @expose */
_p.width;
cc.defineGetterSetter(_p, "width", _p._getWidth);
/** @expose */
_p.height;
cc.defineGetterSetter(_p, "height", _p._getHeight);

cc.game.once(cc.game.EVENT_RENDERER_INITED, function () {

    // Do nothing if it is not 3d
    if (cc._renderType !== cc.game.RENDER_TYPE_WEBGL || !cc.game._is3D) {
        return;
    }

    cc.Texture2D = Texture;
});
