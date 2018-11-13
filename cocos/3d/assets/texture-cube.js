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

    get front() {
        return this._mipmaps[0].front;
    }

    set front(value) {
        this._mipmaps[0].front = value;
    }

    get back() {
        return this._mipmaps[0].back;
    }

    set back(value) {
        this._mipmaps[0].back = value;
    }

    get left() {
        return this._mipmaps[0].left;
    }

    set left(value) {
        this._mipmaps[0].left = value;
    }

    get right() {
        return this._mipmaps[0].right;
    }

    set right(value) {
        this._mipmaps[0].right = value;
    }

    get top() {
        return this._mipmaps[0].top;
    }

    set top(value) {
        this._mipmaps[0].top = value;
    }

    get bottom() {
        return this._mipmaps[0].bottom;
    }

    set bottom(value) {
        this._mipmaps[0].bottom = value;
    }

    /**
     * Gets the underlying texture object.
     */
    getImpl () {
        return this._texture;
    }

    handleLoadedTexture() {
        // Do nothing if the mipmap at level 0 is incomplete.
        if (this._mipmaps.length === 0 || !TextureCube._isComplete(this._mipmaps[0])) {
            return;
        }

        /** @type {ImageSource[][]} */
        let mipmapSources = null;
        if (this._mipmaps.every(mipmap => TextureCube._isComplete(mipmap))) {
            mipmapSources = this._mipmaps.map(mipmap => TextureCube._getMipmapSource(mipmap));
        } else {
            mipmapSources = [TextureCube._getMipmapSource(this._mipmaps[0])];
        }
        this._updateMipmaps(mipmapSources);

        //dispatch load event to listener.
        this.loaded = true;
        this.emit("load");

        this._mipmaps.forEach(mipmap => TextureCube._foreachFace(mipmap, face => {
            if (cc.macro.CLEANUP_IMAGE_CACHE && face instanceof HTMLImageElement) {
                // wechat game platform will cache image parsed data,
                // so image will consume much more memory than web, releasing it
                face.src = "";
                // Release image in loader cache
                cc.loader.removeItem(face.id);
            }
        }));
    }

    /**
     * @param {MipmapHTMLImageSource | MipmapHTMLImageSource[]} element
     */
    initWithElement(element) {
        /** @type {MipmapHTMLImageSource[]} */
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
            if (counter === this._mipmaps.length * 6) {
                this.handleLoadedTexture();
            }
        };

        const loadImageSource = (image) => {
            if (!image) {
                onLoadMipmap();
                return;
            }
            if (CC_WECHATGAME || CC_QQPLAY || image.complete || image instanceof HTMLCanvasElement) {
                onLoadMipmap();
            } else {
                image.addEventListener('load', function () {
                    onLoadMipmap();
                });
                image.addEventListener('error', function (err) {
                    cc.warnID(3119, err.message);
                });
            }
        };
        const mipmaps = mipmapSources.map((mipmapSource) => {
            /** @type {Mipmap} */
            const mipmap = {};
            for (let face in mipmapSource) {
                const faceSource = mipmapSource[face];
                loadImageSource(faceSource);
                const faceImage = new ImageAsset();
                faceImage.data = faceSource;
                mipmap[face] = faceImage;
            }
            return mipmap;
        });
        this._setMipmaps(mipmaps);
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
     * Notes, this method won't synchronize the mipmap data to underlying texture.
     * @param {Mipmap[]} mipmaps 
     */
    _setMipmaps(mipmaps) {
        this._mipmaps = mipmaps;
        if (mipmaps.length === 0) {
            this.width = 0;
            this.height = 0;
        } else {
            this.width = this._mipmaps[0].front.width;
            this.height = this._mipmaps[0].front.height;
        }
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
     */
    static _isComplete(mipmap) {
        for (let face in mipmap) {
            if (!mipmap[face].data) {
                return false;
            }
        }
        return true;
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
