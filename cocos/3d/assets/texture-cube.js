/****************************************************************************
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
import GFXTextureCube from '../../renderer/gfx/texture-cube';
import TextureBase from '../../assets/texture-base';
import { ccclass, property } from '../../core/data/class-decorator';
import ImageAsset from '../../assets/image-asset';

/**
 * @typedef {import("../../assets/texture-base").ImageSource} ImageSource
 * @typedef {import("../../assets/texture-base").TextureUpdateOpts} TextureUpdateOpts
 * @typedef {import("../../assets/texture-base").HTMLImageSource} HTMLImageSource
 * @typedef {{front: HTMLImageSource, back: HTMLImageSource, left: HTMLImageSource, right: HTMLImageSource, top: HTMLImageSource, bottom: HTMLImageSource}} MipmapHTMLImageSource
 * @typedef {{front: ImageAsset, back: ImageAsset, left: ImageAsset, right: ImageAsset, top: ImageAsset, bottom: ImageAsset}} Mipmap
 */

/**
 * @enum {number}
 */
const FaceIndex = {
    front: 5,
    back: 4,
    left: 1,
    right: 0,
    top: 2,
    bottom: 3,
};

@ccclass('cc.TextureCube')
export default class TextureCube extends TextureBase {
    /**
     * @type {Mipmap[]}
     */
    @property
    _mipmaps = [];

    constructor() {
        super();
        
        /**
         * @type {GFXTextureCube}
         */
        this._texture = null;
    }

    /**
     * Gets the mipmap images.
     * Note that the result do not contains the auto generated mipmaps.
     * @return {Mipmap[]}
     */
    get mipmaps() {
        return this._mipmaps;
    }

    /**
     * Sets the mipmaps images.
     * @param {Mipmap[]} value
     */
    set mipmaps(value) {
        this._setMipmaps(value);
    }

    /**
     * Gets the mipmap image at level 0.
     * @return {Mipmap}
     */
    get image() {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
    }

    /**
     * Sets the mipmap images as a single mipmap image.
     * @param {Mipmap} value
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
     * Release texture, please use destroy instead.
     * !#zh 释放纹理，请使用 destroy 替代。
     * @method releaseTexture
     * @deprecated since v2.0
     */
    releaseTexture () {
        this._setMipmaps([]);
        this._texture && this._texture.destroy();
    }

    /**
     * Sets the _mipmaps to specified value, and updates the width and height accordingly.
     * If available, synchronize the mipmap data to underlying texture.
     * @param {Mipmap[]} mipmaps 
     */
    _setMipmaps(mipmaps) {
        this._mipmaps = mipmaps;
        if (mipmaps.length === 0) {
            super.update({
                width: 0,
                height: 0
            });
        } else {
            super.update({
                width: this._mipmaps[0].front.width,
                height: this._mipmaps[0].front.height,
                format: this._mipmaps[0].front._format
            });
        }

        let counter = 0;
        const inc = () => {
            ++counter;
            if (counter === this._mipmaps.length * 6) {
                this._updateMipmaps(this._mipmaps.map(mipmap => TextureCube._getMipmapSource(mipmap)));
            }
        };
        mipmaps.forEach(mipmap => {
            TextureCube._foreachFace(mipmap, face => {
                if (face.loaded) {
                    inc();
                } else {
                    face.addEventListener("load", () => {
                        inc();
                    });
                }
            });
        });
    }

    /**
     * Updates mipmaps of the underlying texture.
     * @param {ImageSource[][]} mipmapSources 
     */
    _updateMipmaps(mipmapSources) {
        const opts = this._getOpts();
        opts.images = mipmapSources;
        if (!this._texture) {
            this._texture = new GFXTextureCube(cc.game._renderContext, opts);
        } else {
            this._texture.update(opts);
        }
    }

    /**
     * 
     * @param {Mipmap} mipmap 
     * @return {ImageSource[]}
     */
    static _getMipmapSource(mipmap) {
        /** @type {ImageSource[]} */
        const result = new Array();
        result[FaceIndex.front] = mipmap.front.data;
        result[FaceIndex.back] = mipmap.back.data;
        result[FaceIndex.left] = mipmap.left.data;
        result[FaceIndex.right] = mipmap.right.data;
        result[FaceIndex.top] = mipmap.top.data;
        result[FaceIndex.bottom] = mipmap.bottom.data;
        return result;
    }

    /**
     * @param {Mipmap} mipmap
     * @param {(face: ImageAsset) => void} callback
     */
    static _foreachFace(mipmap, callback) {
        for (let face in mipmap) {
            callback(mipmap[face]);
        }
    }
}

cc.TextureCube = TextureCube;
