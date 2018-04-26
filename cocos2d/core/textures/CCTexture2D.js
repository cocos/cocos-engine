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

const EventTarget = require('../event/event-target');
const sys = require('../platform/CCSys');
const JS = require('../platform/js');
const misc = require('../utils/misc');
const game = require('../CCGame');
require('../platform/_CCClass');
require('../platform/CCClass');

const GL_ALPHA = 6406;            // gl.ALPHA
const GL_RGB = 6407;              // gl.RGB
const GL_RGBA = 6408;             // gl.RGBA
const GL_LUMINANCE = 6409;        // gl.LUMINANCE
const GL_LUMINANCE_ALPHA = 6410;  // gl.LUMINANCE_ALPHA
const GL_UNSIGNED_BYTE = 5121;            // gl.UNSIGNED_BYTE
const GL_UNSIGNED_SHORT = 5123;           // gl.UNSIGNED_SHORT
const GL_UNSIGNED_INT = 5125;             // gl.UNSIGNED_INT
const GL_FLOAT = 5126;                    // gl.FLOAT
const GL_UNSIGNED_SHORT_5_6_5 = 33635;    // gl.UNSIGNED_SHORT_5_6_5
const GL_UNSIGNED_SHORT_4_4_4_4 = 32819;  // gl.UNSIGNED_SHORT_4_4_4_4
const GL_UNSIGNED_SHORT_5_5_5_1 = 32820;  // gl.UNSIGNED_SHORT_5_5_5_1

const GL_NEAREST = 9728;                // gl.NEAREST
const GL_LINEAR = 9729;                 // gl.LINEAR
const GL_REPEAT = 10497;                // gl.REPEAT
const GL_CLAMP_TO_EDGE = 33071;         // gl.CLAMP_TO_EDGE
const GL_MIRRORED_REPEAT = 33648;       // gl.MIRRORED_REPEAT

const _textureFmtGL = [
    // R5_G6_B5: 0
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_SHORT_5_6_5 },
    // R5_G5_B5_A1: 1
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_5_5_5_1 },
    // R4_G4_B4_A4: 2
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_4_4_4_4 },
    // RGB8: 3
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_BYTE },
    // RGBA8: 4
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_BYTE },
    // A8: 5
    { format: GL_ALPHA, internalFormat: GL_ALPHA, pixelType: GL_UNSIGNED_BYTE },
    // L8: 6
    { format: GL_LUMINANCE, internalFormat: GL_LUMINANCE, pixelType: GL_UNSIGNED_BYTE },
    // L8_A8: 7
    { format: GL_LUMINANCE_ALPHA, internalFormat: GL_LUMINANCE_ALPHA, pixelType: GL_UNSIGNED_BYTE }
];

/**
 * The texture pixel format, default value is RGBA8888
 * @enum Texture2D.PixelFormat
 */
const PixelFormat = cc.Enum({
    /**
     * 16-bit texture without Alpha channel, not supported yet
     * @property RGB565
     * @readonly
     * @type {Number}
     */
    RGB565: 0,
    /**
     * 16-bit textures: RGB5A1, not supported yet
     * @property RGB5A1
     * @readonly
     * @type {Number}
     */
    RGB5A1: 1,
    /**
     * 16-bit textures: RGBA4444, not supported yet
     * @property RGBA4444
     * @readonly
     * @type {Number}
     */
    RGBA4444: 2,
    /**
     * 24-bit texture: RGB888, not supported yet
     * @property RGB888
     * @readonly
     * @type {Number}
     */
    RGB888: 3,
    /**
     * 32-bit texture: RGBA8888
     * @property RGBA8888
     * @readonly
     * @type {Number}
     */
    RGBA8888: 4,
    /**
     * 8-bit textures used as masks, not supported yet
     * @property A8
     * @readonly
     * @type {Number}
     */
    A8: 5,
    /**
     * 8-bit intensity texture, not supported yet
     * @property I8
     * @readonly
     * @type {Number}
     */
    I8: 6,
    /**
     * 16-bit textures used as masks, not supported yet
     * @property AI88
     * @readonly
     * @type {Number}
     */
    AI8: 7
});

/**
 * The texture wrap mode
 * @enum Texture2D.WrapMode
 */
const WrapMode = cc.Enum({
    /**
     * The constant variable equals gl.REPEAT for texture
     * @property REPEAT
     * @type {Number}
     * @readonly
     */
    REPEAT: GL_REPEAT,
    /**
     * The constant variable equals gl.CLAMP_TO_EDGE for texture
     * @property CLAMP_TO_EDGE
     * @type {Number}
     * @readonly
     */
    CLAMP_TO_EDGE: GL_CLAMP_TO_EDGE,
    /**
     * The constant variable equals gl.MIRRORED_REPEAT for texture
     * @property MIRRORED_REPEAT
     * @type {Number}
     * @readonly
     */
    MIRRORED_REPEAT: GL_MIRRORED_REPEAT
});

/**
 * The texture filter mode
 * @enum Texture2D.Filter
 */
const Filter = cc.Enum({
    /**
     * The constant variable equals gl.LINEAR for texture
     * @property LINEAR
     * @type {Number}
     * @readonly
     */
    LINEAR: GL_LINEAR,
    /**
     * The constant variable equals gl.NEAREST for texture
     * @property NEAREST
     * @type {Number}
     * @readonly
     */
    NEAREST: GL_NEAREST
});

/**
 * <p>
 * This class allows to easily create OpenGL or Canvas 2D textures from images, text or raw data.                                    <br/>
 * The created cc.Texture2D object will always have power-of-two dimensions.                                                <br/>
 * Depending on how you create the cc.Texture2D object, the actual image area of the texture might be smaller than the texture dimensions <br/>
 *  i.e. "contentSize" != (pixelsWide, pixelsHigh) and (maxS, maxT) != (1.0, 1.0).                                           <br/>
 * Be aware that the content of the generated textures will be upside-down! </p>

 * @class Texture2D
 * @uses EventTarget
 * @extends RawAsset
 */
var Texture2D = cc.Class(/** @lends cc.Texture2D# */{

    name: 'cc.Texture2D',
    extends: require('../assets/CCRawAsset'),
    mixins: [EventTarget],

    properties: {
        _hasMipmap: false,
        _format: PixelFormat.RGBA8888,
        _compressed: false,
        _premultiplyAlpha: false,
        _minFilter: Filter.LINEAR,
        _magFilter: Filter.LINEAR,
        _wrapS: WrapMode.CLAMP_TO_EDGE,
        _wrapT: WrapMode.CLAMP_TO_EDGE
    },

    statics: {
        PixelFormat: PixelFormat,
        WrapMode: WrapMode,
        Filter: Filter
    },

    ctor: function (gl) {
        /**
         * !#en
         * The url of the texture, this coule be empty if the texture wasn't created via a file.
         * !#zh
         * 贴图文件的 url，当贴图不是由文件创建时值可能为空
         * @property url
         * @type {String}
         */
        this.url = null;
        /**
         * !#en
         * Whether the texture is loaded or not
         * !#zh
         * 贴图是否已经成功加载
         * @property loaded
         * @type {Boolean}
         */
        this.loaded = false;
        /**
         * !#en
         * Texture width in pixel
         * !#zh
         * 贴图像素宽度
         * @property width
         * @type {Number}
         */
        this.width = 0;
        /**
         * !#en
         * Texture height in pixel
         * !#zh
         * 贴图像素高度
         * @property height
         * @type {Number}
         */
        this.height = 0;

        this._image = null;

        if (cc._renderType === game.RENDER_TYPE_CANVAS) {
            this._pattern = "";
            // hack for gray effect
            this._grayElementObj = null;
            this._backupElement = null;
            this._isGray = false;
        }
        else if (cc._renderType === game.RENDER_TYPE_WEBGL) {
            this._gl = gl || cc._renderContext;
            this._glID = null;
        }
    },

    /**
     * Update texture options, not available in Canvas render mode. 
     * image, format, premultiplyAlpha can not be updated in native.
     * @method update
     * @param {Object} options
     * @param {DOMImageElement} options.image
     * @param {Boolean} options.mipmap
     * @param {PixelFormat} options.format
     * @param {Filter} options.minFilter
     * @param {Filter} options.magFilter
     * @param {WrapMode} options.wrapS
     * @param {WrapMode} options.wrapT
     * @param {Boolean} options.premultiplyAlpha
     */
    update(options) {
    },

    /**
     * Get width in pixels.
     * @method getPixelWidth
     * @return {Number}
     * @deprecated use width or height property instead
     */
    getPixelWidth: function () {
        return this.width;
    },

    /**
     * Get height of in pixels.
     * @method getPixelHeight
     * @return {Number}
     * @deprecated use width or height property instead
     */
    getPixelHeight: function () {
        return this.height;
    },

    /**
     * Get content size.
     * @method getContentSize
     * @returns {Size}
     * @deprecated use width or height property instead
     */
    getContentSize: function () {
        return cc.size(this.width, this.height);
    },

    /**
     * Get content size in pixels.
     * @method getContentSizeInPixels
     * @returns {Size}
     * @deprecated use width or height property instead
     */
    getContentSizeInPixels: function () {
        return this.getContentSize();
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
        this._image = element;
        this.width = element.width;
        this.height = element.height;
        this.loaded = true;
    },

    /**
     * Intializes with a texture2d with data.
     * @method initWithData
     * @param {TypedArray} data
     * @param {Number} pixelFormat
     * @param {Number} pixelsWidth
     * @param {Number} pixelsHeight
     * @param {Size} contentSize contentSize is deprecated and ignored
     * @return {Boolean}
     */
    initWithData: function (data, pixelFormat, pixelsWidth, pixelsHeight, contentSize) {
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
     * HTMLElement Object getter, available only on web.
     * In most case, it will return null, because we are recycling the dom image element for better loading performance and lower image cache memory usage.
     * @method getHtmlElementObj
     * @return {HTMLImageElement|HTMLCanvasElement}
     */
    getHtmlElementObj: function () {
        return this._image;
    },

    /**
     * Check whether texture is loaded.
     * @method isLoaded
     * @returns {Boolean}
     * @deprecated use loaded property instead
     */
    isLoaded: function () {
        return this.loaded;
    },

    /**
     * Handler of texture loaded event.
     * @method handleLoadedTexture
     * @param {Boolean} [premultiplied]
     */
    handleLoadedTexture: function () {
        if (!this._image || !this._image.width || !this._image.height)
            return;

        var locElement = this._image;
        this.width = locElement.width;
        this.height = locElement.height;
        this.loaded = true;

        //dispatch load event to listener.
        this.emit("load");
    },

    /**
     * Description of cc.Texture2D.
     * @method description
     * @returns {String}
     */
    description: function () {
        return "<cc.Texture2D | Name = " + this.url + " | Dimensions = " + this.width + " x " + this.height + ">";
    },

    /**
     * Release texture.
     * @method releaseTexture
     */
    releaseTexture: function () {
        if (this._gl && this._glID !== null) {
            this._gl.deleteTexture(this._glID);
        }
    },

    /**
     * Pixel format of the texture.
     * @method getPixelFormat
     * @return {Number}
     */
    getPixelFormat: function () {
        //support only in WebGl rendering mode
        return this._format;
    },

    /**
     * Whether or not the texture has their Alpha premultiplied,
     * support only in WebGl rendering mode.
     * @method hasPremultipliedAlpha
     * @return {Boolean}
     */
    hasPremultipliedAlpha: function () {
        return this._premultiplyAlpha || false;
    },

    /**
     * Whether or not use mipmap, support only in WebGl rendering mode.
     * @method hasMipmaps
     * @return {Boolean}
     */
    hasMipmaps: function () {
        return this._hasMipmap || false;
    },

    /**
     * Sets the min filter, mag filter, wrap s and wrap t texture parameters. <br/>
     * If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
     * @method setTexParameters
     * @param {Object|Number} texParams texParams object or minFilter
     * @param {Number} [magFilter]
     * @param {Texture2D.WrapMode} [wrapS]
     * @param {Texture2D.WrapMode} [wrapT]
     * @deprecated use update function with filter and wrap options instead
     */
    setTexParameters: function (texParams, magFilter, wrapS, wrapT) {
        if (magFilter !== undefined)
            texParams = {minFilter: texParams, magFilter: magFilter, wrapS: wrapS, wrapT: wrapT};

        if (texParams.wrapS === WrapMode.REPEAT && texParams.wrapT === WrapMode.REPEAT) {
            this._pattern = "repeat";
            return;
        }
        if (texParams.wrapS === WrapMode.REPEAT ) {
            this._pattern = "repeat-x";
            return;
        }
        if (texParams.wrapT === WrapMode.REPEAT) {
            this._pattern = "repeat-y";
            return;
        }
        this._pattern = "";
    },

    /**
     * sets antialias texture parameters:              <br/>
     *  - GL_TEXTURE_MIN_FILTER = GL_NEAREST           <br/>
     *  - GL_TEXTURE_MAG_FILTER = GL_NEAREST           <br/>
     * supported only in native or WebGl rendering mode
     * @method setAntiAliasTexParameters
     * @deprecated use update function with filter options instead
     */
    setAntiAliasTexParameters: function () {
        //support only in WebGl rendering mode
    },

    /**
     * Sets alias texture parameters:                 <br/>
     *   GL_TEXTURE_MIN_FILTER = GL_NEAREST           <br/>
     *   GL_TEXTURE_MAG_FILTER = GL_NEAREST           <br/>
     * supported only in native or WebGl rendering mode
     * @method setAliasTexParameters
     * @deprecated use update function with filter options instead
     */
    setAliasTexParameters: function () {
        //support only in WebGl rendering mode
    }
});

var _p = Texture2D.prototype;

// Extended properties
/** @expose */
_p.pixelFormat;
cc.defineGetterSetter(_p, "pixelFormat", _p.getPixelFormat);
/** @expose */
_p.pixelWidth;
cc.defineGetterSetter(_p, "pixelWidth", _p.getPixelWidth);
/** @expose */
_p.pixelHeight;
cc.defineGetterSetter(_p, "pixelHeight", _p.getPixelHeight);

game.once(game.EVENT_RENDERER_INITED, function () {
    if (cc._renderType === game.RENDER_TYPE_CANVAS) {
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

        _p._generateTextureCacheForColor = function(){
            if (this.channelCache)
                return this.channelCache;

            var textureCache = [
                document.createElement("canvas"),
                document.createElement("canvas"),
                document.createElement("canvas"),
                document.createElement("canvas")
            ];
            //todo texture onload
            renderToCache(this._image, textureCache);
            return this.channelCache = textureCache;
        };

        _p._switchToGray = function(toGray){
            if(!this.loaded || this._isGray === toGray)
                return;
            this._isGray = toGray;
            if(this._isGray){
                this._backupElement = this._image;
                if(!this._grayElementObj)
                    this._grayElementObj = generateGrayTexture(this._image);
                this._image = this._grayElementObj;
            } else {
                if(this._backupElement !== null)
                    this._image = this._backupElement;
            }
        };

        _p._generateGrayTexture = function() {
            if(!this.loaded)
                return null;
            var grayElement = generateGrayTexture(this._image);;
            var newTexture = new Texture2D();
            newTexture.initWithElement(grayElement);
            newTexture.handleLoadedTexture();
            return newTexture;
        };

        //change color function
        _p._generateColorTexture = sys._supportCanvasNewBlendModes ? function(r, g, b, rect, canvas) {
            var onlyCanvas = false;
            if(canvas)
                onlyCanvas = true;
            else
                canvas = document.createElement("canvas");
            var textureImage = this._image;
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
            var textureImage = this._image;
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
        };

    } else if (cc._renderType === game.RENDER_TYPE_WEBGL) {

        function _glTextureFmt (pixelFormat) {
            var glFmt = _textureFmtGL[pixelFormat];
            cc.assertID(glFmt, 3113);
            return glFmt;
        }

        function _isPow2 (v) {
            return !(v & (v - 1)) && (!!v);
        }

        var _sharedOpts = {
            width: undefined,
            height: undefined,
            minFilter: undefined,
            magFilter: undefined,
            wrapS: undefined,
            wrapT: undefined,
            format: undefined,
            mipmap: undefined,
            image: undefined,
            premultiplyAlpha: undefined
        };
        function _getSharedOptions () {
            for (var key in _sharedOpts) {
                _sharedOpts[key] = undefined;
            }
            return _sharedOpts;
        }

        _p.update = function (options) {
            var genMipmap = this._hasMipmap;
            var gl = this._gl;
            var updateImage = false;

            if (options) {
                if (options.width !== undefined) {
                    this.width = options.width;
                }
                if (options.height !== undefined) {
                    this.height = options.height;
                }
                if (options.minFilter !== undefined) {
                    this._minFilter = options.minFilter;
                }
                if (options.magFilter !== undefined) {
                    this._magFilter = options.magFilter;
                }
                if (options.wrapS !== undefined) {
                    this._wrapS = options.wrapS;
                }
                if (options.wrapT !== undefined) {
                    this._wrapT = options.wrapT;
                }
                if (options.format !== undefined) {
                    this._format = options.format;
                    updateImage = true;
                }
                if (options.premultiplyAlpha !== undefined) {
                    this._premultiplyAlpha = options.premultiplyAlpha;
                    updateImage = true;
                }
                if (options.image !== undefined) {
                    this._image = options.image;
                    updateImage = true;
                }
                if (options.mipmap !== undefined) {
                    genMipmap = this._hasMipmap = options.mipmap;
                }
            }

            if (this._image) {
                if (updateImage) {
                    // Release previous gl texture if existed
                    this.releaseTexture();
                    this._glID = gl.createTexture();
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, this._glID);
                    this._setImage(this._image, this.width, this.height, _glTextureFmt(this._format), this._premultiplyAlpha);
                }
                else {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, this._glID);
                }
                this._setTexInfo();

                if (genMipmap) {
                    cc.assertID(_isPow2(this.width) && _isPow2(this.height), 3117);
                    gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
                    gl.generateMipmap(gl.TEXTURE_2D);
                }
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
        };

        _p._setImage = function (img, width, height, glFmt, premultiplyAlpha) {
            var gl = this._gl;
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
            if (
                (sys.platform === sys.WECHAT_GAME && !(img instanceof Uint8Array)) ||
                sys.platform === sys.QQ_PLAY ||
                img instanceof HTMLCanvasElement ||
                img instanceof HTMLImageElement ||
                img instanceof HTMLVideoElement
            ) {
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    glFmt.internalFormat,
                    glFmt.format,
                    glFmt.pixelType,
                    img
                );
            } else {
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    glFmt.internalFormat,
                    width,
                    height,
                    0,
                    glFmt.format,
                    glFmt.pixelType,
                    img
                );
            }
        };
        
        _p._setTexInfo = function () {
            var gl = this._gl;
            var pot = _isPow2(this.width) && _isPow2(this.height);
        
            // WebGL1 doesn't support all wrap modes with NPOT textures
            if (!pot && (this._wrapS !== WrapMode.CLAMP_TO_EDGE || this._wrapT !== WrapMode.CLAMP_TO_EDGE)) {
                cc.warnID(3116);
                this._wrapS = WrapMode.CLAMP_TO_EDGE;
                this._wrapT = WrapMode.CLAMP_TO_EDGE;
            }
        
            if (this._minFilter === Filter.LINEAR) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._hasMipmap ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._hasMipmap ? gl.NEAREST_MIPMAP_NEAREST : gl.NEAREST);
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._magFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT);
        };

        _p.initWithData = function (data, pixelFormat, pixelsWidth, pixelsHeight, contentSize) {
            if (contentSize) {
                cc.warnID(3118);
            }
            var opts = _getSharedOptions();
            opts.image = data;
            opts.format = pixelFormat;
            opts.width = pixelsWidth;
            opts.height = pixelsHeight;
            this.update(opts);
            this.width = pixelsWidth;
            this.height = pixelsHeight;
            this.loaded = true;
            this.emit("load");
            return true;
        };

        _p.initWithElement = function (element) {
            if (!element || element.width === 0 || element.height === 0)
                return;
            
            this._image = element;
            return true;
        };

        // [premultiplied=false]
        _p.handleLoadedTexture = function (premultiplied) {
            if (!this._image || !this._image.width || !this._image.height) {
                return;
            }

            var opts = _getSharedOptions();
            opts.image = this._image;
            opts.format = PixelFormat.RGBA8888;
            opts.width = this._image.width;
            opts.height = this._image.height;
            opts.premultiplyAlpha = !!premultiplied;
            var filter = cc.view._antiAliasEnabled ? Filter.LINEAR : Filter.NEAREST;
            opts.minFilter = opts.magFilter = filter;
            this.update(opts);

            this.loaded = true;
            this.emit("load");
        };

        _p.setTexParameters = function (texParams, magFilter, wrapS, wrapT) {
            if (magFilter !== undefined)
                texParams = {minFilter: texParams, magFilter: magFilter, wrapS: wrapS, wrapT: wrapT};
            this.update(texParams);
        };

        _p.setAntiAliasTexParameters = function () {
            var opts = _getSharedOptions();
            opts.minFilter = Filter.LINEAR;
            opts.magFilter = Filter.LINEAR;
            this.update(opts);
        };

        _p.setAliasTexParameters = function () {
            var opts = _getSharedOptions();
            opts.minFilter = Filter.NEAREST;
            opts.magFilter = Filter.NEAREST;
            this.update(opts);
        };
    }
});

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
 * @deprecated please use width instead
 */

/**
 * Height in pixels.
 * @property pixelHeight
 * @type {Number}
 * @readonly
 * @deprecated please use height instead
 */

cc.Texture2D = module.exports = Texture2D;