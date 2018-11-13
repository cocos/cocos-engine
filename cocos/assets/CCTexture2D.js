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

/**
 * @typedef {import("./texture-base").ImageSource} ImageSource
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
     * @type {ImageAsset[]}
     */
    @property([ImageAsset])
    _mipmaps = [];

    constructor () {
        super();

        /**
         * @type {GFXTexture2D}
         */
        this._texture = null;
    }

    /**
     * Gets the mipmap images.
     * Note that the result do not contains the auto generated mipmaps.
     * @return {ImageAsset[]}
     */
    get mipmaps() {
        return this._mipmaps;
    }

    /**
     * Sets the mipmaps images.
     * @param {ImageAsset[]} value
     */
    set mipmaps(value) {
        this._mipmaps = value;
        this._updateMipmaps(value.map(mipmap => mipmap.data));
    }

    /**
     * Gets the mipmap image at level 0.
     * @return {ImageAsset}
     */
    get image() {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
    }

    /**
     * Sets the mipmap images as a single mipmap image.
     * @param {ImageAsset} value
     */
    set image(value) {
        this.mipmaps = [value];
    }

    /**
     * Gets the underlying texture object.
     */
    getImpl () {
        return this._texture;
    }

    /**
     * Returns the string representation of this texture.
     */
    toString () {
        return this._mipmaps.length !== 0 ? this._mipmaps[0].url : "";
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

        super.update(options);

        if (options.image) {
            options.images = [options.image];
        }
        
        if (options.images !== undefined && options.images.length !== 0) {
            this._setMipmaps(options.images.map(image => {
                const mipmap = new ImageAsset();
                mipmap.data = image;
                return mipmap;
            }));
        }

        if (options.images && options.images.length > 0) {
            this._texture.update(options);
        }
    }

    /**
     * !#en
     * Handler of texture loaded event.
     * Since v2.0, you don't need to invoke this function, it will be invoked automatically after texture loaded.
     * !#zh 贴图加载事件处理器。v2.0 之后你将不在需要手动执行这个函数，它会在贴图加载成功之后自动执行。
     * @method handleLoadedTexture
     * @deprecated You shall not manually call this function since v2.0.
     */
    handleLoadedTexture () {
        // Do nothing if the mipmap at level 0 is incomplete.
        if (this._mipmaps.length === 0 || !this._mipmaps[0].data) {
            return;
        }

        /** @type {ImageSource[]} */
        let mipmapSources = null;
        if (this._mipmaps.every(mipmap => mipmap.data !== null)) {
            mipmapSources = this._mipmaps.map(mipmap => mipmap.data);
        } else {
            mipmapSources = [this._mipmaps[0].data];
        }
        this._updateMipmaps(mipmapSources);

        //dispatch load event to listener.
        this.loaded = true;
        this.emit("load");

        if (cc.macro.CLEANUP_IMAGE_CACHE) {
            this._mipmaps.forEach(mipmap => {
                if (mipmap instanceof HTMLImageElement) {
                    mipmap.src = "";
                    cc.loader.removeItem(mipmap.id);
                }
            });
        }
    }

    /**
     * !#en
     * Initializes this texture with HTML element(s).
     * !#zh 用 HTML Image 或 Canvas 对象初始化贴图。
     * @method initWithElement
     * @param {HTMLImageElement|HTMLCanvasElement|(HTMLImageElement | HTMLCanvasElement)[]} element
     * The element can be a single HTML element or an array of multiple HTML elements.
     * If it's an array, the N-th element of array will be taken to iniailize the mipmap at level N;
     * Otherwise, it is treat as an array with this single element.
     * @example
     * var img = new Image();
     * img.src = dataURL;
     * texture.initWithElement(img);
     */
    initWithElement (element) {
        /** @type {(HTMLImageElement|HTMLCanvasElement)[]} */
        let mipmapSources = null;
        if (!Array.isArray(element)) {
            mipmapSources = [element];
        } else {
            mipmapSources = element;
        }

        // Load the elements.
        // Once successed, initialize the _mipmap with these elements.
        let counter = 0;
        const onLoadMipmap = () => {
            ++counter;
            if (counter === this._mipmaps.length) {
                this.handleLoadedTexture();
            }
        };
        const mipmaps = mipmapSources.map((mipmapImage) => {
            const mipmap = new ImageAsset();
            if (!mipmapImage) {
                onLoadMipmap();
                return mipmap;
            }
            mipmap.data = mipmapImage;
            if (CC_WECHATGAME || CC_QQPLAY || mipmapImage.complete || mipmapImage instanceof HTMLCanvasElement) {
                onLoadMipmap();
            } else {
                mipmapImage.addEventListener('load', function () {
                    onLoadMipmap();
                });
                mipmapImage.addEventListener('error', function (err) {
                    cc.warnID(3119, err.message);
                });
            }
            return mipmap;
        });
        this._setMipmaps(mipmaps);
    }

    /**
     * !#en
     * Intializes this texture so that it has one mipmap,
     * the mipmap is initialized with a Uint8Array.
     * !#zh 使用一个存储在 Unit8Array 中的图像数据（raw data）初始化数据。
     * @method initWithData
     * @param {ArrayBufferView} data
     * @param {Number} pixelFormat
     * @param {Number} pixelsWidth
     * @param {Number} pixelsHeight
     * @return {Boolean}
     */
    initWithData (data, pixelFormat, pixelsWidth, pixelsHeight) {
        this._format = pixelFormat;

        const mipmap = new ImageAsset();
        mipmap._nativeAsset = {
            _data: data,
            _compressed: false,
            width: pixelsWidth,
            height: pixelsHeight,
        };
        this._setMipmaps([mipmap]);
        this._updateMipmaps([data]);

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
     * @deprecated Use this.image.data instead.
     */
    getHtmlElementObj () {
        return (this._mipmaps[0] && (this._mipmaps[0].data instanceof HTMLElement)) ? this._mipmaps[0].data: null;
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
        this.releaseTexture();
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
        return "<cc.Texture2D | Name = " + (this._mipmaps[0] ? this._mipmaps[0].url : "") + " | Dimensions = " + this.width + " x " + this.height + ">";
    }

    /**
     * !#en
     * Release texture, please use destroy instead.
     * !#zh 释放纹理，请使用 destroy 替代。
     * @method releaseTexture
     * @deprecated since v2.0, use destroy instead.
     */
    releaseTexture () {
        this._setMipmaps([]);
        this._texture && this._texture.destroy();
    }

    /**
     * Sets the _mipmaps to specified value, and updates the width and height accordingly.
     * Notes, this method won't synchronize the mipmap data to underlying texture.
     * @param {ImageAsset[]} mipmaps 
     */
    _setMipmaps(mipmaps) {
        this._mipmaps = mipmaps;
        if (mipmaps.length === 0) {
            this.width = 0;
            this.height = 0;
        } else {
            this.width = this._mipmaps[0].width;
            this.height = this._mipmaps[0].height;
        }
    }

    /**
     * Updates mipmaps of the underlying texture.
     * @param {ImageSource[]} mipmapSources 
     */
    _updateMipmaps(mipmapSources) {
        const opts = this._getOpts();
        opts.images = mipmapSources;
        if (!this._texture) {
            this._texture = new GFXTexture2D(cc.game._renderContext, opts);
        } else {
            this._texture.update(opts);
        }
    }

    _serialize () {
        return {
            base: super._serialize(),
            mipmaps: this._mipmaps.map(mipmap => mipmap._uuid)
        };
    }

    _deserialize (data, handle) {
        super._deserialize(data.base);

        const mipmaps = new Array(data.mipmaps.length);
        const thiz = this;
        let counter = 0;
        data.mipmaps.forEach((mipmapUUID, index) => {
            let hack = {
                set setter(v) {
                    mipmaps[index] = v;
                    ++counter;
                    if (counter === mipmaps.length) {
                        thiz.mipmaps = mipmaps;
                    }
                }
            };
            handle.result.push(hack, 'setter', mipmapUUID);
        });
    }
}

cc.Texture2D = Texture2D;
