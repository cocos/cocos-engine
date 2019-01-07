/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
// @ts-check
import {ccclass, property} from '../core/data/class-decorator';
import EventTarget from '../core/event/event-target';
import IDGenerator from '../core/utils/id-generator';
import {addon} from '../core/utils/js';
import Enum from '../core/value-types/enum';
import {enums} from '../renderer/gfx/enums';
import Asset from './CCAsset';

/**
 * @typedef {import("../renderer/gfx/texture-2d").HTMLImageSource} HTMLImageSource
 * @typedef {import("../renderer/gfx/texture-2d").ImageSource} ImageSource
 * @typedef {import("../renderer/gfx/texture-2d").TextureUpdateOpts} TextureUpdateOpts
 *
 * @exports HTMLImageSource
 * @exports ImageSource
 * @exports TextureUpdateOpts
 */

const _images = [];

const CHAR_CODE_1 = 49;    // '1'

const GL_NEAREST = 9728;                // gl.NEAREST
const GL_LINEAR = 9729;                 // gl.LINEAR
const GL_REPEAT = 10497;                // gl.REPEAT
const GL_CLAMP_TO_EDGE = 33071;         // gl.CLAMP_TO_EDGE
const GL_MIRRORED_REPEAT = 33648;       // gl.MIRRORED_REPEAT

const idGenerator = new IDGenerator('Tex');

/**
 * The texture pixel format, default value is RGBA8888,
 * you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,
 * other formats are supported by compressed file types or raw data.
 * @enum {number}
 */
const PixelFormat = Enum({
    /**
     * 16-bit texture without Alpha channel
     * @property RGB565
     * @readonly
     * @type {Number}
     */
    RGB565: enums.TEXTURE_FMT_R5_G6_B5,
    /**
     * 16-bit textures: RGB5A1
     * @property RGB5A1
     * @readonly
     * @type {Number}
     */
    RGB5A1: enums.TEXTURE_FMT_R5_G5_B5_A1,
    /**
     * 16-bit textures: RGBA4444
     * @property RGBA4444
     * @readonly
     * @type {Number}
     */
    RGBA4444: enums.TEXTURE_FMT_R4_G4_B4_A4,
    /**
     * 24-bit texture: RGB888
     * @property RGB888
     * @readonly
     * @type {Number}
     */
    RGB888: enums.TEXTURE_FMT_RGB8,
    /**
     * 32-bit texture: RGBA8888
     * @property RGBA8888
     * @readonly
     * @type {Number}
     */
    RGBA8888: enums.TEXTURE_FMT_RGBA8,
    /**
     * 32-bit float texture: RGBA32F
     * @property RGBA32F
     * @readonly
     * @type {Number}
     */
    RGBA32F: enums.TEXTURE_FMT_RGBA32F,
    /**
     * 8-bit textures used as masks
     * @property A8
     * @readonly
     * @type {Number}
     */
    A8: enums.TEXTURE_FMT_A8,
    /**
     * 8-bit intensity texture
     * @property I8
     * @readonly
     * @type {Number}
     */
    I8: enums.TEXTURE_FMT_L8,
    /**
     * 16-bit textures used as masks
     * @property AI88
     * @readonly
     * @type {Number}
     */
    AI8: enums.TEXTURE_FMT_L8_A8,

    /**
     * rgb 2 bpp pvrtc
     * @property RGB_PVRTC_2BPPV1
     * @readonly
     * @type {Number}
     */
    RGB_PVRTC_2BPPV1: enums.TEXTURE_FMT_RGB_PVRTC_2BPPV1,
    /**
     * rgba 2 bpp pvrtc
     * @property RGBA_PVRTC_2BPPV1
     * @readonly
     * @type {Number}
     */
    RGBA_PVRTC_2BPPV1: enums.TEXTURE_FMT_RGBA_PVRTC_2BPPV1,
    /**
     * rgb 4 bpp pvrtc
     * @property RGB_PVRTC_4BPPV1
     * @readonly
     * @type {Number}
     */
    RGB_PVRTC_4BPPV1: enums.TEXTURE_FMT_RGB_PVRTC_4BPPV1,
    /**
     * rgba 4 bpp pvrtc
     * @property RGBA_PVRTC_4BPPV1
     * @readonly
     * @type {Number}
     */
    RGBA_PVRTC_4BPPV1: enums.TEXTURE_FMT_RGBA_PVRTC_4BPPV1,
});

/**
 * The texture wrap mode
 * @enum {number}
 */
export const WrapMode = Enum({
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
    MIRRORED_REPEAT: GL_MIRRORED_REPEAT,
});

/**
 * The texture filter mode
 * @enum {number}
 */
export const Filter = Enum({
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
    NEAREST: GL_NEAREST,
});

const FilterIndex = {
    9728: 0, // GL_NEAREST
    9729: 1, // GL_LINEAR
};

/**
 * @type TextureUpdateOpts
 */
const _sharedOpts = {
    width: undefined,
    height: undefined,
    minFilter: undefined,
    magFilter: undefined,
    mipFilter: undefined,
    wrapS: undefined,
    wrapT: undefined,
    format: undefined,
    mipmap: undefined,
    images: undefined,
    image: undefined,
    flipY: undefined,
    premultiplyAlpha: undefined,
    anisotropy: undefined,
};
function _getSharedOptions () {
    for (const key in _sharedOpts) {
        _sharedOpts[key] = undefined;
    }
    _images.length = 0;
    _sharedOpts.images = _images;
    _sharedOpts.flipY = false;
    return _sharedOpts;
}

@ccclass('cc.TextureBase')
export default class TextureBase extends Asset {

    public static PixelFormat = PixelFormat;

    public static WrapMode = WrapMode;

    public static Filter = Filter;

    /**
     *
     * @param {TextureBase} texture
     */
    public static _isCompressed (texture) {
        return texture._format >= PixelFormat.RGB_PVRTC_2BPPV1 && texture._format <= PixelFormat.RGBA_PVRTC_4BPPV1;
    }
    @property
    public _genMipmap = false;

    @property
    public _format = PixelFormat.RGBA8888;

    @property
    public _premultiplyAlpha = false;

    @property
    public _flipY = false;

    @property
    public _minFilter = Filter.LINEAR;

    @property
    public _magFilter = Filter.LINEAR;

    @property
    public _mipFilter = Filter.LINEAR;

    @property
    public _wrapS = WrapMode.CLAMP_TO_EDGE;

    @property
    public _wrapT = WrapMode.CLAMP_TO_EDGE;

    @property
    public _anisotropy = 1;

    constructor () {
        super();
        EventTarget.call(this);

        // Id for generate hash in material
        this._id = idGenerator.getNewId();

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
         * Texture width, in pixels.
         * For 2D texture, the width of texture is equal to its very first mipmap's width;
         * For Cubemap texture, the width of texture is equal to its every sides's very first mipmaps's width.
         * !#zh
         * 贴图像素宽度
         * @property width
         * @type {Number}
         */
        this.width = 0;
        /**
         * !#en
         * Texture height, in pixels.
         * For 2D texture, the height of texture is equal to its very first mipmap's height;
         * For Cubemap texture, the height of texture is equal to its every sides's very first mipmaps's height.
         * !#zh
         * 贴图像素高度
         * @property height
         * @type {Number}
         */
        this.height = 0;
    }

    public getId () {
        return this._id;
    }

    /**
     * Update texture sampler options.
     * @method update
     * @param {TextureUpdateOpts} options
     */
    public update (options) {
        if (!options) {
            return;
        }

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
        if (options.mipFilter !== undefined) {
            this._mipFilter = options.mipFilter;
            options.mipFilter = FilterIndex[options.mipFilter];
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
        if (options.flipY !== undefined) {
            this._flipY = options.flipY;
        }
        if (options.premultiplyAlpha !== undefined) {
            this._premultiplyAlpha = options.premultiplyAlpha;
        }
        if (options.anisotropy !== undefined) {
            this._anisotropy = options.anisotropy;
        }
        if (options.mipmap !== undefined) {
            this._genMipmap = options.mipmap;
        }
    }

    public _getOpts () {
        const opts = _getSharedOptions();
        opts.width = this.width;
        opts.height = this.height;
        opts.mipmap = this._genMipmap;
        opts.format = this._format;
        opts.premultiplyAlpha = this._premultiplyAlpha;
        opts.anisotropy = this._anisotropy;
        opts.flipY = this._flipY;
        opts.minFilter = FilterIndex[this._minFilter];
        opts.magFilter = FilterIndex[this._magFilter];
        opts.mipFilter = FilterIndex[this._mipFilter];
        opts.wrapS = this._wrapS;
        opts.wrapT = this._wrapT;
        return opts;
    }

    /**
     * !#en
     * Pixel format of the texture.
     * !#zh 获取纹理的像素格式。
     * @method getPixelFormat
     * @return {Number}
     */
    public getPixelFormat () {
        // support only in WebGl rendering mode
        return this._format;
    }

    /**
     * !#en
     * Whether or not the texture has their Alpha premultiplied.
     * !#zh 检查纹理在上传 GPU 时预乘选项是否开启。
     * @method hasPremultipliedAlpha
     * @return {Boolean}
     */
    public hasPremultipliedAlpha () {
        return this._premultiplyAlpha || false;
    }

    /**
     * !#en Anisotropy of the texture.
     * !#zh 获取纹理的各向异性。
     * @method getAnisotropy
     * @return {Number}
     */
    public getAnisotropy () {
        return this._anisotropy;
    }

    /**
     * !#en
     * Whether or not to generate mipmap.
     * !#zh 检查纹理在上传 GPU 时是否生成 mipmap。
     * @method hasMipmap
     * @return {Boolean}
     */
    public genMipmap () {
        return this._genMipmap || false;
    }

    /**
     * !#en Sets the wrap s and wrap t options. <br/>
     * If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
     * !#zh 设置纹理包装模式。
     * 若纹理贴图尺寸是 NPOT（non power of 2），则只能使用 Texture2D.WrapMode.CLAMP_TO_EDGE。
     * @method setTexParameters
     * @param {WrapMode} wrapS
     * @param {WrapMode} wrapT
     */
    public setWrapMode (wrapS, wrapT) {
        if (this._wrapS !== wrapS || this._wrapT !== wrapT) {
            const opts = _getSharedOptions();
            opts.wrapS = wrapS;
            opts.wrapT = wrapT;
            this.update(opts);
        }
    }

    /**
     * !#en Sets the minFilter and magFilter options
     * !#zh 设置纹理贴图缩小和放大过滤器算法选项。
     * @method setFilters
     * @param {Filter} minFilter
     * @param {Filter} magFilter
     */
    public setFilters (minFilter, magFilter) {
        if (this._minFilter !== minFilter || this._magFilter !== magFilter) {
            const opts = _getSharedOptions();
            opts.minFilter = minFilter;
            opts.magFilter = magFilter;
            this.update(opts);
        }
    }

    /**
     * !#en Sets the mipFilter options
     * !#zh 设置纹理Mipmap过滤算法选项。
     * @method setMipFilter
     * @param {Filter} mipFilter
     */
    public setMipFilter (mipFilter) {
        if (this._mipFilter !== mipFilter) {
            const opts = _getSharedOptions();
            opts.mipFilter = mipFilter;
            this.update(opts);
        }
    }

    /**
     * !#en
     * Sets the flipY options
     * !#zh 设置贴图的纵向翻转选项。
     * @method setFlipY
     * @param {Boolean} flipY
     */
    public setFlipY (flipY) {
        if (this._flipY !== flipY) {
            const opts = _getSharedOptions();
            opts.flipY = flipY;
            this.update(opts);
        }
    }

    /**
     * !#en
     * Sets the premultiply alpha options
     * !#zh 设置贴图的预乘选项。
     * @method setPremultiplyAlpha
     * @param {Boolean} premultiply
     */
    public setPremultiplyAlpha (premultiply) {
        if (this._premultiplyAlpha !== premultiply) {
            const opts = _getSharedOptions();
            opts.premultiplyAlpha = premultiply;
            this.update(opts);
        }
    }

    /**
     * !#en Sets the anisotropy of the texture
     * !#zh 设置贴图的各向异性。
     * @method setAnisotropy
     * @param {number} anisotropy
     */
    public setAnisotropy (anisotropy) {
        if (this._anisotropy !== anisotropy) {
            const opts = _getSharedOptions();
            opts.anisotropy = anisotropy;
            this.update(opts);
        }
    }

    /**
     * !#en
     * Sets whether generate mipmaps for the texture
     * !#zh 是否为纹理设置生成 mipmaps。
     * @method setGenerateMipmap
     * @param {Boolean} mipmap
     */
    public setGenMipmap (mipmap) {
        if (this._genMipmap !== mipmap) {
            const opts = _getSharedOptions();
            opts.mipmap = mipmap;
            this.update(opts);
        }
    }

    // SERIALIZATION

    /**
     * @return {any}
     */
    public _serialize () {
        return this._minFilter + ',' + this._magFilter + ',' +
            this._wrapS + ',' + this._wrapT + ',' +
            (this._premultiplyAlpha ? 1 : 0) + ',' +
            this._mipFilter + ',' + this._anisotropy + ',' +
            (this._flipY ? 1 : 0) + ',' +
            (this._genMipmap ? 1 : 0);
    }

    /**
     *
     * @param {string} data
     */
    public _deserialize (data) {
        const fields = data.split(',');
        fields.unshift('');
        if (fields.length >= 6) {
            // decode filters
            this._minFilter = parseInt(fields[1]);
            this._magFilter = parseInt(fields[2]);
            // decode wraps
            this._wrapS = parseInt(fields[3]);
            this._wrapT = parseInt(fields[4]);
            // decode premultiply alpha
            this._premultiplyAlpha = fields[5].charCodeAt(0) === CHAR_CODE_1;
        }
        if (fields.length >= 8) {
            this._mipFilter = parseInt(fields[6]);
            this._anisotropy = parseInt(fields[7]);
        }
        if (fields.length >= 10) {
            this._flipY = fields[8].charCodeAt(0) === CHAR_CODE_1;
            this._genMipmap = fields[9].charCodeAt(0) === CHAR_CODE_1;
        }
    }
}

/**
 * !#zh
 * 当该资源加载成功后触发该事件
 * !#en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */

addon(TextureBase.prototype, EventTarget.prototype);
cc.TextureBase = TextureBase;
