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
import { ccclass, property } from '../core/data/class-decorator';
import { IEventTargetCallback } from '../core/event/event-target-factory';
import { ImageAsset, ImageSource } from './image-asset';
import { TextureBase } from './texture-base';
import { postLoadImage } from './texture-util';

/**
 * Represents a 2-dimension texture.
 */
@ccclass('cc.Texture2D')
export class Texture2D extends TextureBase {
    /**
     * Gets the mipmap images.
     * Note that the result do not contains the auto generated mipmaps.
     */
    get mipmaps () {
        return this._mipmaps;
    }

    /**
     * Sets the mipmaps images.
     */
    set mipmaps (value) {
        const replaceMipmaps = () => {
            const oldMipmaps = this._mipmaps;
            this._mipmaps = value;
            this._assetReady();
            oldMipmaps.forEach((mipmap) => {
                if (!mipmap.loaded) {
                    this._unfinished--;
                    mipmap.off('load', this._onImageLoaded, this);
                    if (this._unfinished === 0) {
                        this.loaded = true;
                        this.emit('load');
                    }
                }
            });
        };
        let unfinished = 0;
        value.forEach((mipmap) => {
            if (!mipmap.loaded) {
                unfinished++;
                mipmap.once('load', () => {
                    unfinished--;
                    if (unfinished === 0) {
                        replaceMipmaps();
                    }
                });
                postLoadImage(mipmap);
            }
        });
        if (unfinished === 0) {
            replaceMipmaps();
        }
    }

    /**
     * Gets the mipmap image at level 0.
     */
    get image () {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
    }

    /**
     * Sets the mipmap images as a single mipmap image.
     */
    set image (value) {
        this.mipmaps = value ? [value] : [];
    }

    @property([ImageAsset])
    public _mipmaps: ImageAsset[] = [];

    private _unfinished = 0;

    constructor () {
        super(true);
    }

    public onLoaded () {
        this._mipmaps.forEach((mipmap, index) => {
            if (!mipmap.loaded) {
                this._unfinished++;
                mipmap.once('load', this._onImageLoaded, this);
            }
        });
        if (this._unfinished === 0) {
            this._assetReady();
            this.loaded = true;
            this.emit('load');
        }
    }

    /**
     * Returns the string representation of this texture.
     */
    public toString () {
        return this._mipmaps.length !== 0 ? this._mipmaps[0].url : '';
    }

    /**
     * Updates mipmaps at specified range of levels.
     * @param firstLevel The first level from which the sources update.
     * @description
     * If the range specified by [firstLevel, firstLevel + sources.length) exceeds
     * the actually range of mipmaps this texture contains, only overlaped mipmaps are updated.
     * Use this method if your mipmap data are modified.
     */
    public updateMipmaps (firstLevel: number = 0, count?: number) {
        if (firstLevel >= this._mipmaps.length) {
            return;
        }

        const nUpdate = Math.min(
            count === undefined ? this._mipmaps.length : count,
            this._mipmaps.length - firstLevel);

        for (let i = 0; i < nUpdate; ++i) {
            const level = firstLevel + i;
            this._assignImage(this._mipmaps[level], level);
        }
    }

    public directUpdate (source: HTMLImageElement | HTMLCanvasElement | ArrayBuffer, level: number = 0) {
        this._uploadData(source, level);
    }

    /**
     * !#en
     * HTMLElement Object getter, available only on web.
     * !#zh 获取当前贴图对应的 HTML Image 或 Canvas 对象，只在 Web 平台下有效。
     * @method getHtmlElementObj
     * @return {HTMLImageElement|HTMLCanvasElement}
     * @deprecated Use this.image.data instead.
     */
    public getHtmlElementObj () {
        return (this._mipmaps[0] && (this._mipmaps[0].data instanceof HTMLElement)) ? this._mipmaps[0].data : null;
    }

    /**
     * !#en
     * Destory this texture and immediately release its video memory. (Inherit from cc.Object.destroy)<br>
     * After destroy, this object is not usable any more.
     * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
     * !#zh
     * 销毁该贴图，并立即释放它对应的显存。（继承自 cc.Object.destroy）<br/>
     * 销毁后，该对象不再可用。您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
     */
    public destroy () {
        this._mipmaps = [];
        return super.destroy();
    }

    /**
     * !#en
     * Description of cc.Texture2D.
     * !#zh cc.Texture2D 描述。
     */
    public description () {
        const url = this._mipmaps[0] ? this._mipmaps[0].url : '';
        return `<cc.Texture2D | Name = ${url} | Dimension = ${this.width} x ${this.height}>`;
    }

    /**
     * !#en
     * Release texture, please use destroy instead.
     * !#zh 释放纹理，请使用 destroy 替代。
     * @deprecated Since v2.0, use destroy instead.
     */
    public releaseTexture () {
        this.mipmaps = [];
    }

    public _serialize (exporting?: any): any {
        return {
            base: super._serialize(exporting),
            mipmaps: this._mipmaps.map((mipmap) => mipmap._uuid),
        };
    }

    public _deserialize (serializedData: any, handle: any) {
        const data = serializedData as ITexture2DSerializeData;
        super._deserialize(data.base, handle);

        this._mipmaps = new Array(data.mipmaps.length);
        for (let i = 0; i < data.mipmaps.length; ++i) {
            // Prevent resource load failed
            this._mipmaps[i] = new ImageAsset();
            const mipmapUUID = data.mipmaps[i];
            handle.result.push(this._mipmaps, `${i}`, mipmapUUID);
        }
    }

    /**
     * !#en If a loading scene (or prefab) is marked as `asyncLoadAssets`, all the image asset of the Texture2D which
     * associated by user's custom Components in the scene, will not preload automatically.
     * These image asset will be load when render component is going to render the Texture2D.
     * You can call this method if you want to load the texture early.
     * !#zh 当加载中的场景或 Prefab 被标记为 `asyncLoadAssets` 时，用户在场景中由自定义组件关联到的所有 Texture2D 的贴图都不会被提前加载。
     * 只有当 渲染 组件要渲染这些 Texture2D 时，才会检查贴图是否加载。如果你希望加载过程提前，你可以手工调用这个方法。
     *
     * @method ensureLoadImage
     * @example
     * if (texture.loaded) {
     *     this._onTextureLoaded();
     * }
     * else {
     *     texture.once('load', this._onTextureLoaded, this);
     *     texture.ensureLoadImage();
     * }
     */
    public ensureLoadImage () {
        super.ensureLoadImage();
        this._mipmaps.forEach((mipmap) => {
            if (!mipmap.loaded) {
                postLoadImage(mipmap);
            }
        });
    }

    protected _onImageLoaded () {
        this._unfinished--;
        if (this._unfinished === 0) {
            this._assetReady();
            this.loaded = true;
            this.emit('load');
        }
    }

    protected _assetReady () {
        if (this._mipmaps.length > 0) {
            const imageAsset: ImageAsset = this._mipmaps[0];
            this.create(imageAsset.width, imageAsset.height, imageAsset.format, this._mipmaps.length);
            this._mipmaps.forEach((mipmap, level) => {
                this._assignImage(mipmap, level);
            });
        } else {
            this.create(0, 0, undefined, this._mipmaps.length);
        }
    }
}

cc.Texture2D = Texture2D;

export interface ITexture2DSerializeData {
    base: string;
    mipmaps: string[];
}
