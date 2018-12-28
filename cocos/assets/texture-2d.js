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
	@property({
	    override: true
	})
    _flipY = true;
	
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
        this._setMipmaps(value);
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
                mipmap.reset(image instanceof HTMLElement ? image : {
                    _data: image,
                    width: this.width,
                    height: this.height,
                    format: this._format,
                    _compressed: false
                });
                return mipmap;
            }));
        }

        if (this._texture) {
            this._texture.update(options);
        }
    }

    /**
     *
     * @param {ImageSource} source
     */
    updateImage(source) {
        this.updateMipmaps([source]);
    }

    /**
     * Updates mipmaps at specified range of levels.
     * @param {ImageSource[]} sources The image sources.
     * @param {number} firstLevel The first level from which the sources update.
     * @description
     * If the range specified by [firstLevel, firstLevel + sources.length) exceeds
     * the actually range of mipmaps this texture contains, only overlaped mipmaps are updated.
     */
    updateMipmaps(sources, firstLevel = 0) {
        if (firstLevel >= sources.length) {
            return;
        }

        const nUpdate = Math.min(sources.length, this._mipmaps.length - firstLevel);
        for (let i = 0; i < nUpdate; ++i) {
            const level = firstLevel + i;
            const mipmap = this._mipmaps[level];
            const source = sources[i];
            mipmap.reset(source instanceof HTMLElement ? source : {
                _data: source,
                width: mipmap.width,
                height: mipmap.height,
                format: mipmap._format,
                _compressed: false
            });
            this._texture.updateImage({
                width: this.width,
                height: this.height,
                level: level,
                image: sources[i],
                flipY: false,
                premultiplyAlpha: false
            });
        }
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
     * If available, synchronize the mipmap data to underlying texture.
     * @param {ImageAsset[]} mipmaps
     */
    _setMipmaps(mipmaps) {
        this._mipmaps = mipmaps;
        if (mipmaps.length === 0) {
            super.update({
                width: 0,
                height: 0
            });
        } else {
            const level0 = this._mipmaps[0];
            super.update({
                width: level0.width,
                height: level0.height,
                format: level0._format
            });
        }

        let counter = 0;
        const inc = () => {
            ++counter;
            if (counter === mipmaps.length) {
                this._resetUnderlyingMipmaps(mipmaps.map(mipmap => mipmap.data));
            }
        };
        mipmaps.forEach(mipmap => {
            if (mipmap.loaded) {
                inc();
            } else {
                mipmap.addEventListener("load", () => {
                    inc();
                });
            }
        });
    }

    /**
     * Resets sources and amount of the underlying texture's the mipmaps.
     * @param {ImageSource[]} mipmapSources
     */
    _resetUnderlyingMipmaps(mipmapSources = [null]) {
        const opts = this._getOpts();
        opts.images = mipmapSources;
        if (!this._texture) {
            this._texture = new GFXTexture2D(cc.game._renderContext, opts);
        } else {
            this._texture.update(opts);
        }
    }

    _serialize() {
        return {
            base: super._serialize(),
            mipmaps: this._mipmaps.map(mipmap => mipmap._uuid)
        };
    }

    _deserialize (data, handle) {
        super._deserialize(data.base);

        this._mipmaps = new Array(data.mipmaps.length);
        for (let i = 0; i < data.mipmaps.length; ++i) {
            // Prevent resource load failed
            this._mipmaps[i] = new ImageAsset();
            const mipmapUUID = data.mipmaps[i];
            handle.result.push(this._mipmaps, `${i}`, mipmapUUID);
        }
    }

    onLoaded() {
        this.mipmaps = this._mipmaps;
    }
}

cc.Texture2D = Texture2D;
