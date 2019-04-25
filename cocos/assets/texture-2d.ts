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
import { ImageAsset, ImageSource } from './image-asset';
import { TextureBase } from './texture-base';

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
        this._mipmaps = value;
        this.create(
            value.length === 0 ? 0 : value[0].width,
            value.length === 0 ? 0 : value[0].height,
            value.length === 0 ? undefined : value[0].format,
            this._mipmaps.length);
        this._mipmaps.forEach((mipmap, level) => {
            this._assignImage(mipmap, level);
        });
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

    constructor () {
        super(true);
    }

    public onLoaded () {
        this.mipmaps = this._mipmaps;
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

    public _serialize () {
        return {
            base: super._serialize(),
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
}

cc.Texture2D = Texture2D;

export interface ITexture2DSerializeData {
    base: string;
    mipmaps: string[];
}
