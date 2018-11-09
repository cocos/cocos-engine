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
import GFXTexture2D from '../renderer/gfx/texture-2d';
import {ccclass, property} from '../core/data/class-decorator';
import TextureBase from './texture-base';
import ImageAsset from './image-asset';

const CHAR_CODE_0 = 48;    // '0'
const CHAR_CODE_1 = 49;    // '1'

let _images = [];

/**
 * @typedef {import("./texture-base").ImageDataSource} ImageDataSource
 * @typedef {import("./texture-base").TextureUpdateOpts} TextureUpdateOpts
 */

/**
 * <p>
 * This class allows to easily create OpenGL or Canvas 2D textures from images, text or raw data.                                    <br/>
 * The created cc.Texture2D object will always have power-of-two dimensions.                                                <br/>
 * Depending on how you create the cc.Texture2D object, the actual image area of the texture might be smaller than the texture dimensions <br/>
 *  i.e. "contentSize" != (pixelsWide, pixelsHigh) and (maxS, maxT) != (1.0, 1.0).                                           <br/>
 * Be aware that the content of the generated textures will be upside-down! </p>

 * @class Texture2D
 * @extends TextureBase
 */
@ccclass('cc.Texture2D')
export default class Texture2D extends TextureBase {
    /**
     * @type {ImageAsset}
     */
    @property(ImageAsset)
    _image = null;

    static extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.etc'];

    constructor () {
        super();

        /**
         * !#en
         * The url of the texture, this could be empty if the texture wasn't created via a file.
         * !#zh
         * 贴图文件的 url，当贴图不是由文件创建时值可能为空
         * @property url
         * @type {String}
         * @readonly
         */
        // TODO - use nativeUrl directly
        this.url = "";

        /**
         * @type {ImageDataSource}
         */
        this._image = null;

        /**
         * @type {GFXTexture2D}
         * @private
         */
        this._texture = null;

        if (CC_EDITOR) {
            this._exportedExts = null;
        }
    }

    get imageAsset() {
        return this._image;
    }

    set imageAsset(value) {
        this._image = value;
        if (this._image === null) {
            return;
        }
        const imageData = this._image.data;
        if (imageData == null) {
            return;
        }
        if (imageData instanceof HTMLElement) {
            this.initWithElement(imageData);
        } else {
            this.initWithData(imageData, this._format, this._image.width, this._image.height);
        }
    }

    /**
     * !#en
     * Get renderer texture implementation object
     * extended from renderEngine.TextureAsset
     * !#zh  返回渲染器内部贴图对象
     * @method getImpl
     */
    getImpl () {
        return this._texture;
    }

    toString () {
        return this.url || '';
    }

    /**
     * Update texture options, not available in Canvas render mode.
     * image, format, premultiplyAlpha can not be updated in native.
     * @method update
     * @param {TextureUpdateOpts} options
     */
    update (options) {
        if (!options) {
            return;
        }

        let updateImg = false;
        if (options.flipY !== undefined) {
            updateImg = true;
        }
        if (options.premultiplyAlpha !== undefined) {
            updateImg = true;
        }
        if (options.anisotropy !== undefined) {
            updateImg = true;
        }

        super.update(options);

        if (this._image == null) {
            this._image = new ImageAsset();
        }

        if (updateImg && this._image.data) {
            options.image = this._image.data;
        }
        if (options.images && options.images.length > 0) {
            this._image.data = options.images[0];
        }
        else if (options.image !== undefined) {
            this._image.data = options.image;
            if (!options.images) {
                _images.length = 0;
                options.images = _images;
            }
            // webgl texture 2d uses images
            options.images.push(options.image);
        }

        if (options.images && options.images.length > 0) {
            this._texture.update(options);
        }
    }

    /**
     * 
     * @param {ImageDataSource[]} images 
     */
    _updateTexture(images) {
        const opts = this._getOpts();
        opts.images = images;
        if (!this._texture) {
            this._texture = new GFXTexture2D(cc.game._renderContext, opts);
        } else {
            this._texture.update(opts);
        }
    }

    /**
     * !#en
     * Handler of texture loaded event.
     * Since v2.0, you don't need to invoke this function, it will be invoked automatically after texture loaded.
     * !#zh 贴图加载事件处理器。v2.0 之后你将不在需要手动执行这个函数，它会在贴图加载成功之后自动执行。
     * @method handleLoadedTexture
     */
    handleLoadedTexture () {
        if (!this._image || !this._image.data || !this._image.width || !this._image.height) {
            return;
        }

        this.width = this._image.width;
        this.height = this._image.height;

        this._updateTexture([this._image.data]);

        //dispatch load event to listener.
        this.loaded = true;
        this.emit("load");

        if (cc.macro.CLEANUP_IMAGE_CACHE && this._image instanceof HTMLImageElement) {
            // wechat game platform will cache image parsed data,
            // so image will consume much more memory than web, releasing it
            this._image.src = "";
            // Release image in loader cache
            cc.loader.removeItem(this._image.id);
        }
    }

    /**
     * !#en
     * Init with HTML element.
     * !#zh 用 HTML Image 或 Canvas 对象初始化贴图。
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
        if (!this._image) {
            this._image = new ImageAsset();
        }

        this._image.data = element;
        if (CC_WECHATGAME || CC_QQPLAY || element.complete || element instanceof HTMLCanvasElement) {
            this.handleLoadedTexture();
        }
        else {
            var self = this;
            element.addEventListener('load', function () {
                self.handleLoadedTexture();
            });
            element.addEventListener('error', function (err) {
                cc.warnID(3119, err.message);
            });
        }
    }

    /**
     * !#en
     * Intializes with a texture2d with data in Uint8Array.
     * !#zh 使用一个存储在 Unit8Array 中的图像数据（raw data）初始化数据。
     * @method initWithData
     * @param {ArrayBufferView} data
     * @param {Number} pixelFormat
     * @param {Number} pixelsWidth
     * @param {Number} pixelsHeight
     * @return {Boolean}
     */
    initWithData (data, pixelFormat, pixelsWidth, pixelsHeight) {
        this.width = pixelsWidth;
        this.height = pixelsHeight;
        this._format = pixelFormat;

        this._updateTexture([data]);

        this.loaded = true;
        this.emit("load");
        return true;
    }

    /**
     * !#en
     * HTMLElement Object getter, available only on web.
     * !#zh 获取当前贴图对应的 HTML Image 或 Canvas 对象，只在 Web 平台下有效。
     * @method getHtmlElementObj
     * @return {HTMLImageElement|HTMLCanvasElement}
     */
    getHtmlElementObj () {
        if (this._image.data instanceof HTMLElement) {
            return this._image.data;
        } else {
            return null;
        }
    }

    /**
     * !#en
     * Destory this texture and immediately release its video memory. (Inherit from cc.Object.destroy)<br>
     * After destroy, this object is not usable any more.
     * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
     * !#zh
     * 销毁该贴图，并立即释放它对应的显存。（继承自 cc.Object.destroy）<br/>
     * 销毁后，该对象不再可用。您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
     * @method destroy
     * @return {Boolean} inherit from the CCObject
     */
    destroy () {
        this._image = null;
        this._texture && this._texture.destroy();
        // TODO cc.textureUtil ?
        // cc.textureCache.removeTextureForKey(this.url);  // item.rawUrl || item.url
        return super.destroy();
    }

    /**
     * !#en
     * Description of cc.Texture2D.
     * !#zh cc.Texture2D 描述。
     * @method description
     * @returns {String}
     */
    description () {
        return "<cc.Texture2D | Name = " + this.url + " | Dimensions = " + super.width + " x " + super.height + ">";
    }

    /**
     * !#en
     * Release texture, please use destroy instead.
     * !#zh 释放纹理，请使用 destroy 替代。
     * @method releaseTexture
     * @deprecated since v2.0
     */
    releaseTexture () {
        this._image = null;
        this._texture && this._texture.destroy();
    }

    // SERIALIZATION

    _serialize () {
        let extId = "";
        let exportedExts = this._exportedExts;
        if (!exportedExts && this._native) {
            exportedExts = [this._native];
        }
        if (exportedExts) {
            let exts = [];
            for (let i = 0; i < exportedExts.length; i++) {
                let extId = "";
                let ext = exportedExts[i];
                if (ext) {
                    // ext@format
                    let extFormat = ext.split('@');
                    extId = Texture2D.extnames.indexOf(extFormat[0]);
                    if (extId < 0) {
                        extId = ext;
                    }
                    if (extFormat[1]) {
                        extId += '@' + extFormat[1];
                    }
                }
                exts.push(extId);
            }
            extId = exts.join('_');
        }
        let asset = "" + extId + "," +
                    this._minFilter + "," + this._magFilter + "," +
                    this._wrapS + "," + this._wrapT + "," +
                    (this._premultiplyAlpha ? 1 : 0) + "," +
                    this._mipFilter + "," +
                    this._anisotropy;
        return {
            attributes: asset,
            image: this._image ? this._image._uuid : ""
        };
    }

    _deserialize (data, handle) {
        let fields = data.attributes.split(',');
        // decode extname
        var extIdStr = fields[0];
        if (extIdStr) {
            let extIds = extIdStr.split('_');

            let extId = 999;
            let ext = '';
            let format = this._format;
            let SupportTextureFormats = cc.macro.SUPPORT_TEXTURE_FORMATS;
            for (let i = 0; i < extIds.length; i++) {
                let extFormat = extIds[i].split('@');
                let tmpExt = extFormat[0];
                tmpExt = tmpExt.charCodeAt(0) - CHAR_CODE_0;
                tmpExt = Texture2D.extnames[tmpExt] || extFormat;

                let index = SupportTextureFormats.indexOf(tmpExt);
                if (index !== -1 && index < extId) {
                    extId = index;
                    ext = tmpExt;
                    format = extFormat[1] ? parseInt(extFormat[1]) : this._format;
                }
            }

            if (ext) {
                this._setRawAsset(ext);
                this._format = format;
            }

            // preset uuid to get correct nativeUrl
            let loadingItem = handle.customEnv;
            let uuid = loadingItem && loadingItem.uuid;
            if (uuid) {
                this._uuid = uuid;
                var url = this.nativeUrl;
                this.url = url;
            }
        }
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

        let imageUuid = data.image;
        if (imageUuid) {
            handle.result.push(this, '_imageSetter', imageUuid);
        }
    }

    // Use this property to set texture when loading dependency
    @property
    set _imageSetter (image) {
        if (image) {
            this.imageAsset = image;
        }
    }
}

cc.Texture2D = Texture2D;
