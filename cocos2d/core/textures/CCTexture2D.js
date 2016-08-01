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

var EventTarget = require('../event/event-target');
var sys = require('../platform/CCSys');
var JS = require('../platform/js');
var misc = require('../utils/misc');
var game = require('../CCGame');
require('../platform/_CCClass');
require('../platform/CCClass');

/**
 * The texture wrap mode
 * @enum Texture2D.WrapMode
 */
var WrapMode = cc.Enum({
    /**
     * The constant variable equals gl.REPEAT for texture
     * @property REPEAT
     * @type {Number}
     * @readonly
     */
    REPEAT: 0x2901,
    /**
     * The constant variable equals gl.CLAMP_TO_EDGE for texture
     * @property CLAMP_TO_EDGE
     * @type {Number}
     * @readonly
     */
    CLAMP_TO_EDGE: 0x812f,
    /**
     * The constant variable equals gl.MIRRORED_REPEAT for texture
     * @property MIRRORED_REPEAT
     * @type {Number}
     * @readonly
     */
    MIRRORED_REPEAT: 0x8370
});

/**
 * <p>
 * This class allows to easily create OpenGL or Canvas 2D textures from images, text or raw data.                                    <br/>
 * The created cc.Texture2D object will always have power-of-two dimensions.                                                <br/>
 * Depending on how you create the cc.Texture2D object, the actual image area of the texture might be smaller than the texture dimensions <br/>
 *  i.e. "contentSize" != (pixelsWide, pixelsHigh) and (maxS, maxT) != (1.0, 1.0).                                           <br/>
 * Be aware that the content of the generated textures will be upside-down! </p>

 * @class Texture2D
 * @extends RawAsset
 */
var Texture2D = cc.Class(/** @lends cc.Texture2D# */{

    name: 'cc.Texture2D',
    extends: require('../assets/CCRawAsset'),
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

        if (cc._renderType === game.RENDER_TYPE_CANVAS) {
            this._pattern = "";
            // hack for gray effect
            this._grayElementObj = null;
            this._backupElement = null;
            this._isGray = false;
        }
        else if (cc._renderType === game.RENDER_TYPE_WEBGL) {
            this._hasPremultipliedAlpha = false;
            this._pixelFormat = Texture2D.defaultPixelFormat;
            this._hasPremultipliedAlpha = false;
            this._hasMipmaps = false;

            this._webTextureObj = null;
        }
    },

    /**
     * Get width in pixels.
     * @method getPixelWidth
     * @return {Number}
     */
    getPixelWidth: function () {
        return this._pixelWidth;
    },

    /**
     * Get height of in pixels.
     * @method getPixelHeight
     * @return {Number}
     */
    getPixelHeight: function () {
        return this._pixelHeight;
    },

    /**
     * Get content size.
     * @method getContentSize
     * @returns {Size}
     */
    getContentSize: function () {
        return cc.size(this._contentSize.width, this._contentSize.height);
    },

    _getWidth: function () {
        return this._contentSize.width;
    },
    _getHeight: function () {
        return this._contentSize.height;
    },

    /**
     * Get content size in pixels.
     * @method getContentSizeInPixels
     * @returns {Size}
     */
    getContentSizeInPixels: function () {
        return this._contentSize;
    },

    /**
     * Init with HTML element.
     * @method initWithElement
     * @param {HTMLImageElement|HTMLCanvasElement} element
     * @example
     * var img = new Image();
     * img.src = dataURL;
     * texture.initWithElement(img);
     * texture.handleLoadedTexture();
     */
    initWithElement: function (element) {
        if (!element)
            return;
        this._htmlElementObj = element;
        this._pixelWidth = this._contentSize.width = element.width;
        this._pixelHeight = this._contentSize.height = element.height;
        this._textureLoaded = true;
    },

    /**
     * Intializes with a texture2d with data.
     * @method initWithData
     * @param {Array} data
     * @param {Number} pixelFormat
     * @param {Number} pixelsWide
     * @param {Number} pixelsHigh
     * @param {Size} contentSize
     * @return {Boolean}
     */
    initWithData: function (data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
        //support only in WebGl rendering mode
        return false;
    },

    /**
     * Initializes a texture from a UIImage object.
     * Extensions to make it easy to create a CCTexture2D object from an image file.
     * Note that RGBA type textures will have their alpha premultiplied - use the blending mode (gl.ONE, gl.ONE_MINUS_SRC_ALPHA).
     * @method initWithImage
     * @param {HTMLImageElement} uiImage
     * @return {Boolean}
     */
    initWithImage: function (uiImage) {
        //support only in WebGl rendering mode
        return false;
    },

    /**
     * HTMLElement Object getter.
     * @method getHtmlElementObj
     * @return {HTMLImageElement|HTMLCanvasElement}
     */
    getHtmlElementObj: function () {
        return this._htmlElementObj;
    },

    /**
     * Check whether texture is loaded.
     * @method isLoaded
     * @returns {Boolean}
     */
    isLoaded: function () {
        return this._textureLoaded;
    },

    /**
     * Handler of texture loaded event.
     * @method handleLoadedTexture
     * @param {Boolean} [premultiplied]
     */
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

        // anti-alias
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            if (cc.view._antiAliasEnabled) {
                self.setAntiAliasTexParameters();
            }
            else {
                self.setAliasTexParameters();
            }
        }

        //dispatch load event to listener.
        self.emit("load");
    },

    /**
     * Description of cc.Texture2D.
     * @method description
     * @returns {String}
     */
    description: function () {
        return "<cc.Texture2D | Name = " + this.getName() + " | Dimensions = " + this.getPixelWidth() + " x " + this.getPixelHeight() + ">";
    },

    /**
     * Release texture.
     * @method releaseTexture
     */
    releaseTexture: function () {
        if (this._webTextureObj)
            cc._renderContext.deleteTexture(this._webTextureObj);
        cc.loader.release(this._uuid || this.url);
    },

    getName: function () {
        return this._webTextureObj || null;
    },

    /**
     * Pixel format of the texture.
     * @method getPixelFormat
     * @return {Number}
     */
    getPixelFormat: function () {
        //support only in WebGl rendering mode
        return this._pixelFormat || null;
    },

    /**
     * Whether or not the texture has their Alpha premultiplied,
     * support only in WebGl rendering mode.
     * @method hasPremultipliedAlpha
     * @return {Boolean}
     */
    hasPremultipliedAlpha: function () {
        return this._hasPremultipliedAlpha || false;
    },

    /**
     * Whether or not use mipmap, support only in WebGl rendering mode.
     * @method hasMipmaps
     * @return {Boolean}
     */
    hasMipmaps: function () {
        return this._hasMipmaps || false;
    },

    /**
     * Sets the min filter, mag filter, wrap s and wrap t texture parameters. <br/>
     * If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
     * @method setTexParameters
     * @param {Object|Number} texParams texParams object or minFilter
     * @param {Number} [magFilter]
     * @param {Texture2D.WrapMode} [wrapS]
     * @param {Texture2D.WrapMode} [wrapT]
     */
    setTexParameters: function (texParams, magFilter, wrapS, wrapT) {
        if(magFilter !== undefined)
            texParams = {minFilter: texParams, magFilter: magFilter, wrapS: wrapS, wrapT: wrapT};

        if(texParams.wrapS === WrapMode.REPEAT && texParams.wrapT === WrapMode.REPEAT){
            this._pattern = "repeat";
            return;
        }

        if(texParams.wrapS === WrapMode.REPEAT ){
            this._pattern = "repeat-x";
            return;
        }

        if(texParams.wrapT === WrapMode.REPEAT){
            this._pattern = "repeat-y";
            return;
        }

        this._pattern = "";
    },

    /**
     * sets antialias texture parameters:              <br/>
     *  - GL_TEXTURE_MIN_FILTER = GL_NEAREST           <br/>
     *  - GL_TEXTURE_MAG_FILTER = GL_NEAREST
     */
    setAntiAliasTexParameters: function () {
        //support only in WebGl rendering mode
    },

    /**
     * Sets alias texture parameters:
     *   GL_TEXTURE_MIN_FILTER = GL_NEAREST
     *   GL_TEXTURE_MAG_FILTER = GL_NEAREST
     */
    setAliasTexParameters: function () {
        //support only in WebGl rendering mode
    },

    /**
     *  Generates mipmap images for the texture.<br/>
     *  It only works if the texture size is POT (power of 2).
     */
    generateMipmap: function () {
        //support only in WebGl rendering mode
    },

    /**
     * returns the pixel format.
     * @return {String}
     */
    stringForFormat: function () {
        //support only in WebGl rendering mode
        return "";
    },

    /**
     * returns the bits-per-pixel of the in-memory OpenGL texture
     * @return {Number}
     */
    bitsPerPixelForFormat: function (format) {
        //support only in WebGl rendering mode
        return -1;
    }
});

Texture2D.WrapMode = WrapMode;

var _c = Texture2D;

/**
 * 32-bit texture: RGBA8888
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_RGBA8888
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_RGBA8888 = 2;

/**
 * 24-bit texture: RGBA888
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_RGB888
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_RGB888 = 3;

/**
 * 16-bit texture without Alpha channel
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_RGB565
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_RGB565 = 4;

/**
 * 8-bit textures used as masks
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_A8
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_A8 = 5;

/**
 * 8-bit intensity texture
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_I8
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_I8 = 6;

/**
 * 16-bit textures used as masks
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_AI88
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_AI88 = 7;

/**
 * 16-bit textures: RGBA4444
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_RGBA4444
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_RGBA4444 = 8;

/**
 * 16-bit textures: RGB5A1
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_RGB5A1
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_RGB5A1 = 7;

/**
 * 4-bit PVRTC-compressed texture: PVRTC4
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_PVRTC4
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_PVRTC4 = 9;

/**
 * 2-bit PVRTC-compressed texture: PVRTC2
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_PVRTC2
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_PVRTC2 = 10;

/**
 * Default texture format: RGBA8888
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_DEFAULT
 * @static
 * @constant
 * @type {Number}
 */
_c.PIXEL_FORMAT_DEFAULT = _c.PIXEL_FORMAT_RGBA8888;

/**
 * The default pixel format
 * @memberOf cc.Texture2D
 * @name PIXEL_FORMAT_PVRTC2
 * @static
 * @type {Number}
 */
_c.defaultPixelFormat = _c.PIXEL_FORMAT_DEFAULT;

var _M = Texture2D._M = {};
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

var _B = Texture2D._B = {};
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

var _p = Texture2D.prototype;

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

game.once(game.EVENT_RENDERER_INITED, function () {
    if(cc._renderType === game.RENDER_TYPE_CANVAS) {

        var renderToCache = function(image, cache){
            var w = image.width;
            var h = image.height;

            cache[0].width = w;
            cache[0].height = h;
            cache[1].width = w;
            cache[1].height = h;
            cache[2].width = w;
            cache[2].height = h;
            cache[3].width = w;
            cache[3].height = h;

            var cacheCtx = cache[3].getContext("2d");
            cacheCtx.drawImage(image, 0, 0);
            var pixels = cacheCtx.getImageData(0, 0, w, h).data;

            var ctx;
            for (var rgbI = 0; rgbI < 4; rgbI++) {
                ctx = cache[rgbI].getContext("2d");

                var to = ctx.getImageData(0, 0, w, h);
                var data = to.data;
                for (var i = 0; i < pixels.length; i += 4) {
                    data[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
                    data[i + 1] = (rgbI === 1) ? pixels[i + 1] : 0;
                    data[i + 2] = (rgbI === 2) ? pixels[i + 2] : 0;
                    data[i + 3] = pixels[i + 3];
                }
                ctx.putImageData(to, 0, 0);
            }
            image.onload = null;
        };

        var generateGrayTexture = function(texture, rect, renderCanvas){
            if (texture === null)
                return null;
            renderCanvas = renderCanvas || document.createElement("canvas");
            rect = rect || cc.rect(0, 0, texture.width, texture.height);
            renderCanvas.width = rect.width;
            renderCanvas.height = rect.height;

            var context = renderCanvas.getContext("2d");
            context.drawImage(texture, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
            var imgData = context.getImageData(0, 0, rect.width, rect.height);
            var data = imgData.data;
            for (var i = 0, len = data.length; i < len; i += 4) {
                data[i] = data[i + 1] = data[i + 2] = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            }
            context.putImageData(imgData, 0, 0);
            return renderCanvas;
        };

        JS.mixin(Texture2D.prototype, {
            _generateTextureCacheForColor: function(){
                if (this.channelCache)
                    return this.channelCache;

                var textureCache = [
                    document.createElement("canvas"),
                    document.createElement("canvas"),
                    document.createElement("canvas"),
                    document.createElement("canvas")
                ];
                //todo texture onload
                renderToCache(this._htmlElementObj, textureCache);
                return this.channelCache = textureCache;
            },

            _switchToGray: function(toGray){
                if(!this._textureLoaded || this._isGray === toGray)
                    return;
                this._isGray = toGray;
                if(this._isGray){
                    this._backupElement = this._htmlElementObj;
                    if(!this._grayElementObj)
                        this._grayElementObj = generateGrayTexture(this._htmlElementObj);
                    this._htmlElementObj = this._grayElementObj;
                } else {
                    if(this._backupElement !== null)
                        this._htmlElementObj = this._backupElement;
                }
            },

            _generateGrayTexture: function() {
                if(!this._textureLoaded)
                    return null;
                var grayElement = generateGrayTexture(this._htmlElementObj);;
                var newTexture = new Texture2D();
                newTexture.initWithElement(grayElement);
                newTexture.handleLoadedTexture();
                return newTexture;
            },

            //change color function
            _generateColorTexture: sys._supportCanvasNewBlendModes ? function(r, g, b, rect, canvas) {
                var onlyCanvas = false;
                if(canvas)
                    onlyCanvas = true;
                else
                    canvas = document.createElement("canvas");
                var textureImage = this._htmlElementObj;
                if(!rect)
                    rect = cc.rect(0, 0, textureImage.width, textureImage.height);

                canvas.width = rect.width;
                canvas.height = rect.height;

                if(rect.width && rect.height) {
                    var context = canvas.getContext("2d");
                    context.globalCompositeOperation = "source-over";
                    context.fillStyle = "rgb(" + (r|0) + "," + (g|0) + "," + (b|0) + ")";
                    context.fillRect(0, 0, rect.width, rect.height);
                    context.globalCompositeOperation = "multiply";
                    context.drawImage(
                        textureImage,
                        rect.x, rect.y, rect.width, rect.height,
                        0, 0, rect.width, rect.height
                    );
                    context.globalCompositeOperation = "destination-atop";
                    context.drawImage(
                        textureImage,
                        rect.x, rect.y, rect.width, rect.height,
                        0, 0, rect.width, rect.height
                    );
                }

                if(onlyCanvas)
                    return canvas;
                var newTexture = new Texture2D();
                newTexture.initWithElement(canvas);
                newTexture.handleLoadedTexture();
                return newTexture;
            } : function(r, g, b, rect, canvas){
                var onlyCanvas = false;
                if(canvas)
                    onlyCanvas = true;
                else
                    canvas = document.createElement("canvas");
                var textureImage = this._htmlElementObj;
                if(!rect)
                    rect = cc.rect(0, 0, textureImage.width, textureImage.height);

                canvas.width = rect.width;
                canvas.height = rect.height;

                if(rect.width && rect.height) {
                    var context = canvas.getContext("2d");
                    context.drawImage(
                        textureImage,
                        rect.x, rect.y, rect.width, rect.height,
                        0, 0, rect.width, rect.height
                    );

                    var imageData = context.getImageData(0,0,canvas.width, canvas.height);
                    var data = imageData.data;
                    r = r/255;
                    g = g/255;
                    b = b/255;
                    for (var i = 0; i < data.length; i += 4) {
                        data[i]     = data[i] * r;
                        data[i + 1] = data[i+1] * g;
                        data[i + 2] = data[i+2] * b;
                    }

                    context.putImageData(imageData, 0, 0);
                }

                if(onlyCanvas)
                    return canvas;
                var newTexture = new Texture2D();
                newTexture.initWithElement(canvas);
                newTexture.handleLoadedTexture();
                return newTexture;
            }
        });

    } else if (cc._renderType === game.RENDER_TYPE_WEBGL) {
        JS.mixin(Texture2D.prototype, {

            initWithData: function (data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
                var self = this, tex2d = Texture2D;
                var gl = cc._renderContext;
                var format = gl.RGBA, type = gl.UNSIGNED_BYTE;

                var bitsPerPixel = Texture2D._B[pixelFormat];

                var bytesPerRow = pixelsWide * bitsPerPixel / 8;
                if (bytesPerRow % 8 === 0) {
                    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 8);
                } else if (bytesPerRow % 4 === 0) {
                    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
                } else if (bytesPerRow % 2 === 0) {
                    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
                } else {
                    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
                }

                self._webTextureObj = gl.createTexture();
                cc.gl.bindTexture2D(self);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                // Specify OpenGL texture image
                switch (pixelFormat) {
                    case tex2d.PIXEL_FORMAT_RGBA8888:
                        format = gl.RGBA;
                        break;
                    case tex2d.PIXEL_FORMAT_RGB888:
                        format = gl.RGB;
                        break;
                    case tex2d.PIXEL_FORMAT_RGBA4444:
                        type = gl.UNSIGNED_SHORT_4_4_4_4;
                        break;
                    case tex2d.PIXEL_FORMAT_RGB5A1:
                        type = gl.UNSIGNED_SHORT_5_5_5_1;
                        break;
                    case tex2d.PIXEL_FORMAT_RGB565:
                        type = gl.UNSIGNED_SHORT_5_6_5;
                        break;
                    case tex2d.PIXEL_FORMAT_AI88:
                        format = gl.LUMINANCE_ALPHA;
                        break;
                    case tex2d.PIXEL_FORMAT_A8:
                        format = gl.ALPHA;
                        break;
                    case tex2d.PIXEL_FORMAT_I8:
                        format = gl.LUMINANCE;
                        break;
                    default:
                        cc.assert(0, cc._LogInfos.Texture2D.initWithData);
                }
                gl.texImage2D(gl.TEXTURE_2D, 0, format, pixelsWide, pixelsHigh, 0, format, type, data);


                self._contentSize.width = contentSize.width;
                self._contentSize.height = contentSize.height;
                self._pixelWidth = pixelsWide;
                self._pixelHeight = pixelsHigh;
                self._pixelFormat = pixelFormat;

                self._hasPremultipliedAlpha = false;
                self._hasMipmaps = false;

                self._textureLoaded = true;

                return true;
            },

            initWithImage: function (uiImage) {
                if (uiImage == null) {
                    cc.log(cc._LogInfos.Texture2D.initWithImage);
                    return false;
                }

                var imageWidth = uiImage.getWidth();
                var imageHeight = uiImage.getHeight();

                var maxTextureSize = cc.configuration.getMaxTextureSize();
                if (imageWidth > maxTextureSize || imageHeight > maxTextureSize) {
                    cc.log(cc._LogInfos.Texture2D.initWithImage_2, imageWidth, imageHeight, maxTextureSize, maxTextureSize);
                    return false;
                }
                this._textureLoaded = true;

                // always load premultiplied images
                return this._initPremultipliedATextureWithImage(uiImage, imageWidth, imageHeight);
            },

            initWithElement: function (element) {
                if (!element)
                    return;
                this._webTextureObj = cc._renderContext.createTexture();
                this._htmlElementObj = element;
                this._textureLoaded = true;
            },

            // [premultiplied=false]
            handleLoadedTexture: function (premultiplied) {
                premultiplied = !!premultiplied;
                var self = this;
                // Not sure about this ! Some texture need to be updated even after loaded
                if (!game._rendererInitialized)
                    return;
                if (!self._htmlElementObj) {
                    var img = cc.loader.getRes(self.url);
                    if (!img) return;
                    self.initWithElement(img);
                }
                if (!self._htmlElementObj.width || !self._htmlElementObj.height)
                    return;

                //upload image to buffer
                var gl = cc._renderContext;

                cc.gl.bindTexture2D(self);

                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
                if(premultiplied)
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                // Specify OpenGL texture image
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self._htmlElementObj);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                cc.gl.bindTexture2D(null);
                if(premultiplied)
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

                var pixelsWide = self._htmlElementObj.width;
                var pixelsHigh = self._htmlElementObj.height;

                self._pixelWidth = self._contentSize.width = pixelsWide;
                self._pixelHeight = self._contentSize.height = pixelsHigh;
                self._pixelFormat = Texture2D.PIXEL_FORMAT_RGBA8888;

                self._hasPremultipliedAlpha = premultiplied;
                self._hasMipmaps = false;
                self._textureLoaded = true;

                //dispatch load event to listener.
                self.emit("load");
            },

            setTexParameters: function (texParams, magFilter, wrapS, wrapT) {
                var _t = this;
                var gl = cc._renderContext;

                if(magFilter !== undefined)
                    texParams = {minFilter: texParams, magFilter: magFilter, wrapS: wrapS, wrapT: wrapT};

                cc.assert((_t._pixelWidth === misc.NextPOT(_t._pixelWidth) && _t._pixelHeight === misc.NextPOT(_t._pixelHeight)) ||
                    (texParams.wrapS === gl.CLAMP_TO_EDGE && texParams.wrapT === gl.CLAMP_TO_EDGE),
                    "WebGLRenderingContext.CLAMP_TO_EDGE should be used in NPOT textures");

                cc.gl.bindTexture2D(_t);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texParams.minFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texParams.magFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texParams.wrapS);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texParams.wrapT);
            },

            setAntiAliasTexParameters: function () {
                var gl = cc._renderContext;

                cc.gl.bindTexture2D(this);
                if (!this._hasMipmaps)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                else
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            },

            setAliasTexParameters: function () {
                var gl = cc._renderContext;

                cc.gl.bindTexture2D(this);
                if (!this._hasMipmaps)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                else
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            },

            generateMipmap: function () {
                var _t = this;
                cc.assert(_t._pixelWidth === misc.NextPOT(_t._pixelWidth) && _t._pixelHeight === misc.NextPOT(_t._pixelHeight), "Mimpap texture only works in POT textures");

                cc.gl.bindTexture2D(_t);
                cc._renderContext.generateMipmap(cc._renderContext.TEXTURE_2D);
                _t._hasMipmaps = true;
            },

            stringForFormat: function () {
                return Texture2D._M[this._pixelFormat];
            },

            bitsPerPixelForFormat: function (format) {//TODO I want to delete the format argument, use this._pixelFormat
                format = format || this._pixelFormat;
                var value = Texture2D._B[format];
                if (value != null) return value;
                cc.log(cc._LogInfos.Texture2D.bitsPerPixelForFormat, format);
                return -1;
            },

            _initPremultipliedATextureWithImage: function (uiImage, width, height) {
                var tex2d = Texture2D;
                var tempData = uiImage.getData();
                var inPixel32 = null;
                var inPixel8 = null;
                var outPixel16 = null;
                var hasAlpha = uiImage.hasAlpha();
                var imageSize = cc.size(uiImage.getWidth(), uiImage.getHeight());
                var pixelFormat = tex2d.defaultPixelFormat;
                var bpp = uiImage.getBitsPerComponent();
                var i;

                // compute pixel format
                if (!hasAlpha) {
                    if (bpp >= 8) {
                        pixelFormat = tex2d.PIXEL_FORMAT_RGB888;
                    } else {
                        cc.log(cc._LogInfos.Texture2D._initPremultipliedATextureWithImage);
                        pixelFormat = tex2d.PIXEL_FORMAT_RGB565;
                    }
                }

                // Repack the pixel data into the right format
                var length = width * height;

                if (pixelFormat === tex2d.PIXEL_FORMAT_RGB565) {
                    if (hasAlpha) {
                        // Convert "RRRRRRRRRGGGGGGGGBBBBBBBBAAAAAAAA" to "RRRRRGGGGGGBBBBB"
                        tempData = new Uint16Array(width * height);
                        inPixel32 = uiImage.getData();

                        for (i = 0; i < length; ++i) {
                            tempData[i] =
                                ((((inPixel32[i] >> 0) & 0xFF) >> 3) << 11) | // R
                                    ((((inPixel32[i] >> 8) & 0xFF) >> 2) << 5) | // G
                                    ((((inPixel32[i] >> 16) & 0xFF) >> 3) << 0);    // B
                        }
                    } else {
                        // Convert "RRRRRRRRRGGGGGGGGBBBBBBBB" to "RRRRRGGGGGGBBBBB"
                        tempData = new Uint16Array(width * height);
                        inPixel8 = uiImage.getData();

                        for (i = 0; i < length; ++i) {
                            tempData[i] =
                                (((inPixel8[i] & 0xFF) >> 3) << 11) | // R
                                    (((inPixel8[i] & 0xFF) >> 2) << 5) | // G
                                    (((inPixel8[i] & 0xFF) >> 3) << 0);    // B
                        }
                    }
                } else if (pixelFormat === tex2d.PIXEL_FORMAT_RGBA4444) {
                    // Convert "RRRRRRRRRGGGGGGGGBBBBBBBBAAAAAAAA" to "RRRRGGGGBBBBAAAA"
                    tempData = new Uint16Array(width * height);
                    inPixel32 = uiImage.getData();

                    for (i = 0; i < length; ++i) {
                        tempData[i] =
                            ((((inPixel32[i] >> 0) & 0xFF) >> 4) << 12) | // R
                                ((((inPixel32[i] >> 8) & 0xFF) >> 4) << 8) | // G
                                ((((inPixel32[i] >> 16) & 0xFF) >> 4) << 4) | // B
                                ((((inPixel32[i] >> 24) & 0xFF) >> 4) << 0);  // A
                    }
                } else if (pixelFormat === tex2d.PIXEL_FORMAT_RGB5A1) {
                    // Convert "RRRRRRRRRGGGGGGGGBBBBBBBBAAAAAAAA" to "RRRRRGGGGGBBBBBA"
                    tempData = new Uint16Array(width * height);
                    inPixel32 = uiImage.getData();

                    for (i = 0; i < length; ++i) {
                        tempData[i] =
                            ((((inPixel32[i] >> 0) & 0xFF) >> 3) << 11) | // R
                                ((((inPixel32[i] >> 8) & 0xFF) >> 3) << 6) | // G
                                ((((inPixel32[i] >> 16) & 0xFF) >> 3) << 1) | // B
                                ((((inPixel32[i] >> 24) & 0xFF) >> 7) << 0);  // A
                    }
                } else if (pixelFormat === tex2d.PIXEL_FORMAT_A8) {
                    // Convert "RRRRRRRRRGGGGGGGGBBBBBBBBAAAAAAAA" to "AAAAAAAA"
                    tempData = new Uint8Array(width * height);
                    inPixel32 = uiImage.getData();

                    for (i = 0; i < length; ++i) {
                        tempData[i] = (inPixel32 >> 24) & 0xFF;  // A
                    }
                }

                if (hasAlpha && pixelFormat === tex2d.PIXEL_FORMAT_RGB888) {
                    // Convert "RRRRRRRRRGGGGGGGGBBBBBBBBAAAAAAAA" to "RRRRRRRRGGGGGGGGBBBBBBBB"
                    inPixel32 = uiImage.getData();
                    tempData = new Uint8Array(width * height * 3);

                    for (i = 0; i < length; ++i) {
                        tempData[i * 3] = (inPixel32 >> 0) & 0xFF; // R
                        tempData[i * 3 + 1] = (inPixel32 >> 8) & 0xFF; // G
                        tempData[i * 3 + 2] = (inPixel32 >> 16) & 0xFF; // B
                    }
                }

                this.initWithData(tempData, pixelFormat, width, height, imageSize);

                if (tempData != uiImage.getData())
                    tempData = null;

                this._hasPremultipliedAlpha = uiImage.isPremultipliedAlpha();
                return true;
            }
        });
    }
});

/**
 * WebGLTexture Object.
 * @property name
 * @type {WebGLTexture}
 * @readonly
 */

/**
 * Pixel format of the texture.
 * @property pixelFormat
 * @type {Number}
 * @readonly
 */

/**
 * Width in pixels.
 * @property pixelWidth
 * @type {Number}
 * @readonly
 */

/**
 * Height in pixels.
 * @property pixelHeight
 * @type {Number}
 * @readonly
 */

/**
 * Content width in points.
 * @property width
 * @type {Number}
 */

/**
 * Content height in points.
 * @property height
 * @type {Number}
 */

cc.Texture2D = module.exports = Texture2D;