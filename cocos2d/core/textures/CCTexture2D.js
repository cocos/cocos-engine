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
const renderEngine = require('../renderer/render-engine');
const renderer = require('../renderer');
require('../platform/CCClass');

const gfx = renderEngine.gfx;
const TextureImpl = renderEngine.Texture2D;
const renderMode = renderEngine.renderMode;

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

/**
 * The texture pixel format, default value is RGBA8888, 
 * you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,
 * other formats are supported by compressed file types or raw data.
 * @enum Texture2D.PixelFormat
 */
const PixelFormat = cc.Enum({
    /**
     * 16-bit texture without Alpha channel
     * @property RGB565
     * @readonly
     * @type {Number}
     */
    RGB565: gfx.TEXTURE_FMT_R5_G6_B5,
    /**
     * 16-bit textures: RGB5A1
     * @property RGB5A1
     * @readonly
     * @type {Number}
     */
    RGB5A1: gfx.TEXTURE_FMT_R5_G5_B5_A1,
    /**
     * 16-bit textures: RGBA4444
     * @property RGBA4444
     * @readonly
     * @type {Number}
     */
    RGBA4444: gfx.TEXTURE_FMT_R4_G4_B4_A4,
    /**
     * 24-bit texture: RGB888
     * @property RGB888
     * @readonly
     * @type {Number}
     */
    RGB888: gfx.TEXTURE_FMT_RGB8,
    /**
     * 32-bit texture: RGBA8888
     * @property RGBA8888
     * @readonly
     * @type {Number}
     */
    RGBA8888: gfx.TEXTURE_FMT_RGBA8,
    /**
     * 8-bit textures used as masks
     * @property A8
     * @readonly
     * @type {Number}
     */
    A8: gfx.TEXTURE_FMT_A8,
    /**
     * 8-bit intensity texture
     * @property I8
     * @readonly
     * @type {Number}
     */
    I8: gfx.TEXTURE_FMT_L8,
    /**
     * 16-bit textures used as masks
     * @property AI88
     * @readonly
     * @type {Number}
     */
    AI8: gfx.TEXTURE_FMT_L8_A8
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

const FilterIndex = {
    GL_NEAREST: 0,
    GL_LINEAR: 1,
};

let _emptyOpts = {};

let _sharedOpts = {
    width: undefined,
    height: undefined,
    minFilter: undefined,
    magFilter: undefined,
    wrapS: undefined,
    wrapT: undefined,
    format: undefined,
    mipmap: undefined,
    images: undefined,
    image: undefined,
    flipY: undefined,
    premultiplyAlpha: undefined
};
function _getSharedOptions () {
    for (var key in _sharedOpts) {
        _sharedOpts[key] = undefined;
    }
    _sharedOpts.flipY = false;
    return _sharedOpts;
}

/**
 * This class allows to easily create OpenGL or Canvas 2D textures from images or raw data.
 *
 * @class Texture2D
 * @uses EventTarget
 * @extends Asset
 */
var Texture2D = cc.Class({
    name: 'cc.Texture2D',
    extends: require('../assets/CCAsset'),
    mixins: [EventTarget],

    properties: {
        _hasMipmap: false,
        _format: PixelFormat.RGBA8888,
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

    ctor () {
        /**
         * !#en
         * The url of the texture, this could be empty if the texture wasn't created via a file.
         * !#zh
         * 贴图文件的 url，当贴图不是由文件创建时值可能为空
         * @property url
         * @type {String}
         * @readonly
         */
        this.url = "";

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

        this._texture = null;
    },

    getImpl () {
        return this._texture;
    },

    properties: {
        _nativeAsset: {
            get () {
                // maybe returned to pool in webgl
                return this._image;
            },
            set (image) {
                this.initWithElement(image);
                this.handleLoadedTexture();
            },
            override: true
        },
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
        WrapMode: WrapMode,
        PixelFormat: PixelFormat,
        Filter: Filter,
        // predefined most common extnames
        extnames: ['.png', '.jpg', '.jpeg', '.bmp', '.webp']
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
    update (options) {
        if (options) {
            if (options.width !== undefined) {
                this.width = options.width;
            }
            if (options.height !== undefined) {
                this.height = options.height;
            }
            if (options.minFilter !== undefined) {
                this._minFilter = options.minFilter;
                options.minFilter = FilterIndex[options.minFilter];
            }
            if (options.magFilter !== undefined) {
                this._magFilter = options.magFilter;
                options.magFilter = FilterIndex[options.magFilter];
            }
            if (options.wrapS !== undefined) {
                this._wrapS = options.wrapS;
            }
            if (options.wrapT !== undefined) {
                this._wrapT = options.wrapT;
            }
            if (options.format !== undefined) {
                this._format = options.format;
            }
            if (options.premultiplyAlpha !== undefined) {
                this._premultiplyAlpha = options.premultiplyAlpha;
            }
            if (options.image !== undefined) {
                this._image = options.image;
                if (renderMode.supportWebGL) {
                    // webgl texture 2d uses images
                    options.images = [options.image];
                }
            }
            if (options.mipmap !== undefined) {
                this._hasMipmap = options.mipmap;
            }
        }
        
        this._texture.update(options);
    },

    /**
     * Init with HTML element.
     * @method initWithElement
     * @param {HTMLImageElement|HTMLCanvasElement} element
     * @example
     * var img = new Image();
     * img.src = dataURL;
     * texture.initWithElement(img);
     */
    initWithElement (element) {
        if (!element)
            return;
        this._image = element;
        if (element.complete || element instanceof HTMLCanvasElement) {
            this.handleLoadedTexture();
        }
        else {
            var self = this;
            element.addEventListener('load', function () {
                self.handleLoadedTexture();
            });
            element.addEventListener('error', function (err) {
                cc.warnID(3118, err.message);
            });
        }
    },

    /**
     * Intializes with a texture2d with data in Uint8Array.
     * @method initWithData
     * @param {TypedArray} data
     * @param {Number} pixelFormat
     * @param {Number} pixelsWidth
     * @param {Number} pixelsHeight
     * @return {Boolean}
     */
    initWithData (data, pixelFormat, pixelsWidth, pixelsHeight) {
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
    },

    /**
     * HTMLElement Object getter, available only on web.
     * In most case, it will return null, because we are recycling the dom image element for better loading performance and lower image cache memory usage.
     * @method getHtmlElementObj
     * @return {HTMLImageElement|HTMLCanvasElement}
     */
    getHtmlElementObj () {
        return this._image;
    },
    
    /**
     * !#en
     * Destory this texture and immediately release its video memory. (Inherit from cc.Object.destroy)<br>
     * After destroy, this object is not usable any more.
     * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
     * !#zh
     * 销毁该贴图，并立即释放它对应的显存。（继承自 cc.Object.destroy）<br/>
     * 销毁后，该对象不再可用。您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
     * @method destroy
     */
    destroy () {
        this._image = null;
        this._texture.destroy();
        // TODO cc.textureUtil ?
        // cc.textureCache.removeTextureForKey(this.url);  // item.rawUrl || item.url
        this._super();
    },

    /**
     * Pixel format of the texture.
     * @method getPixelFormat
     * @return {Number}
     */
    getPixelFormat () {
        //support only in WebGl rendering mode
        return this._format;
    },

    /**
     * Whether or not the texture has their Alpha premultiplied,
     * support only in WebGl rendering mode.
     * @method hasPremultipliedAlpha
     * @return {Boolean}
     */
    hasPremultipliedAlpha () {
        return this._premultiplyAlpha || false;
    },

    /**
     * Whether or not use mipmap, support only in WebGl rendering mode.
     * @method hasMipmap
     * @return {Boolean}
     */
    hasMipmap () {
        return this._hasMipmap || false;
    },

    /**
     * Handler of texture loaded event.
     * @method handleLoadedTexture
     * @param {Boolean} [premultiplied]
     */
    handleLoadedTexture () {
        if (!this._image || !this._image.width || !this._image.height)
            return;
        
        this.width = this._image.width;
        this.height = this._image.height;
        let opts = _getSharedOptions();
        opts.image = this._image;
        if (renderMode.supportWebGL) {
            // webgl texture 2d uses images
            opts.images = [opts.image];
        }
        opts.flipY = false;
        opts.width = this.width;
        opts.height = this.height;
        opts.hasMipmap = this._hasMipmap;
        opts.format = this._format;
        opts.premultiplyAlpha = this._premultiplyAlpha;
        opts.minFilter = FilterIndex[this._minFilter];
        opts.magFilter = FilterIndex[this._magFilter];
        opts.wrapS = this._wrapS;
        opts.wrapT = this._wrapT;
        
        if (!this._texture) {
            this._texture = new TextureImpl(renderer.device, opts);
        }
        else {
            this._texture.update(opts);
        }

        //dispatch load event to listener.
        this.loaded = true;
        this.emit("load");
    },

    /**
     * Description of cc.Texture2D.
     * @method description
     * @returns {String}
     */
    description () {
        return "<cc.Texture2D | Name = " + this.url + " | Dimensions = " + this.width + " x " + this.height + ">";
    },

    /**
     * Release texture.
     * @method releaseTexture
     */
    releaseTexture () {
        this._image = null;
        this._texture.destroy();
    },

    /**
     * Sets the wrap s and wrap t options. <br/>
     * If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
     * @method setTexParameters
     * @param {Texture2D.WrapMode} wrapS
     * @param {Texture2D.WrapMode} wrapT
     */
    setWrapMode (wrapS, wrapT) {
        if (this._wrapS !== wrapS || this._wrapT !== wrapT) {
            var opts = _getSharedOptions();
            opts.wrapS = wrapS;
            opts.wrapT = wrapT;
            this.update(opts);
        }
    },

    /**
     * Sets the minFilter and magFilter options
     * supported only in native or WebGl rendering mode
     * @method setFilters
     * @param {Texture2D.Filter} minFilter
     * @param {Texture2D.Filter} magFilter
     */
    setFilters (minFilter, magFilter) {
        if (this._minFilter !== minFilter || this._magFilter !== magFilter) {
            var opts = _getSharedOptions();
            opts.minFilter = minFilter;
            opts.magFilter = magFilter;
            this.update(opts);
        }
    },

    /**
     * Sets the premultiply alpha options
     * supported only in native or WebGl rendering mode
     * @method setPremultiplyAlpha
     * @param {Boolean} premultiply
     */
    setPremultiplyAlpha (premultiply) {
        if (this._premultiplyAlpha !== premultiply) {
            var opts = _getSharedOptions();
            opts.premultiplyAlpha = premultiply;
            this.update(opts);
        }
    },
    
    /**
     * Sets whether generate mipmaps for the texture
     * supported only in native or WebGl rendering mode
     * @method setMipmap
     * @param {Boolean} mipmap
     */
    setMipmap (mipmap) {
        if (this._hasMipmap !== mipmap) {
            var opts = _getSharedOptions();
            opts.hasMipmap = mipmap;
            this.update(opts);
        }
    },

    // SERIALIZATION

    _serialize: (CC_EDITOR || CC_TEST) && function () {
        var extId = "";
        if (this._native) {
            // encode extname
            var ext = cc.path.extname(this._native);
            if (ext) {
                extId = Texture2D.extnames.indexOf(ext);
                if (extId < 0) {
                    extId = ext;
                }
            }
        }
        return "" + extId;
    },

    _deserialize: function (data, handle) {
        var fields = data.split(',');
        // decode extname
        var extIdStr = fields[0];
        if (extIdStr) {
            const CHAR_CODE_0 = 48;    // '0'
            var extId = extIdStr.charCodeAt(0) - CHAR_CODE_0;
            var ext = Texture2D.extnames[extId];
            this._setRawAsset(ext || extIdStr);

            // preset uuid to get correct nativeUrl
            var loadingItem = handle.customEnv;
            var uuid = loadingItem && loadingItem.uuid;
            if (uuid) {
                this._uuid = uuid;
                var url = this.nativeUrl;
                this.url = url;
            }
        }
    }
});

cc.Texture2D = module.exports = Texture2D;
