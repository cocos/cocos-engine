/*
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
*/

/**
 * @category asset
 */

// @ts-check
import { ccclass, property } from '../core/data/class-decorator';
import { GFXTextureType, GFXTextureViewType } from '../gfx/define';
import { PixelFormat } from './asset-enum';
import { ImageAsset } from './image-asset';
import { PresumedGFXTextureInfo, PresumedGFXTextureViewInfo, SimpleTexture } from './simple-texture';

/**
 * 贴图创建选项。
 */
export interface ITexture2DCreateInfo {
    /**
     * 像素宽度。
     */
    width: number;

    /**
     * 像素高度。
     */
    height: number;

    /**
     * 像素格式。
     * @default PixelFormat.RGBA8888
     */
    format?: PixelFormat;

    /**
     * mipmap 层级。
     * @default 1
     */
    mipmapLevel?: number;
}

/**
 * 二维贴图资源。
 * 二维贴图资源的每个 Mipmap 层级都为一张图像资源。
 */
@ccclass('cc.Texture2D')
export class Texture2D extends SimpleTexture {
    /**
     * 此贴图的像素宽度。
     */
    public get width (): number {
        return this._width;
    }

    /**
     * 此贴图的像素高度。
     */
    public get height (): number {
        return this._height;
    }

    /**
     * 所有层级 Mipmap，注意，这里不包含自动生成的 Mipmap。
     * 当设置 Mipmap 时，贴图的尺寸以及像素格式可能会改变。
     */
    get mipmaps () {
        return this._mipmaps;
    }

    set mipmaps (value) {
        this._mipmaps = value;
        if (this._mipmaps.length > 0) {
            const imageAsset: ImageAsset = this._mipmaps[0];
            this.reset({
                width: imageAsset.width,
                height: imageAsset.height,
                format: imageAsset.format,
                mipmapLevel: this._mipmaps.length,
            });
            this._mipmaps.forEach((mipmap, level) => {
                this._assignImage(mipmap, level);
            });
        } else {
            this.reset({
                width: 0,
                height: 0,
                mipmapLevel: this._mipmaps.length,
            });
        }
    }

    /**
     * 0 级 Mipmap。
     * 注意，`this.image = i` 等价于 `this.mipmaps = [i]`，
     * 也就是说，通过 `this.image` 设置 0 级 Mipmap 时将隐式地清除之前的所有 Mipmap。
     */
    get image () {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
    }

    set image (value) {
        this.mipmaps = value ? [value] : [];
    }

    @property([ImageAsset])
    public _mipmaps: ImageAsset[] = [];
    private _width: number = 0;
    private _height: number = 0;

    constructor () {
        super(true);
    }

    public onLoaded () {
        this.initialize();
        this.loaded = true;
        this.emit('load');
    }

    /**
     * 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级。重置后，贴图的像素数据将变为未定义。
     * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 `this.uploadData` 来上传贴图数据。
     * @param info 贴图重置选项。
     */
    public reset (info: ITexture2DCreateInfo) {
        this._width = info.width;
        this._height = info.height;
        this._setGFXFormat(info.format);
        this._setMipmapLevel(info.mipmapLevel || 1);
        this._tryReset();
    }

    /**
     * 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级的贴图。重置后，贴图的像素数据将变为未定义。
     * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 `this.uploadData` 来上传贴图数据。
     * @param width 像素宽度。
     * @param height 像素高度。
     * @param format 像素格式。
     * @param mipmapLevel mipmap 层级。
     * @deprecated 将在 V1.0.0 移除，请转用 `this.reset()`。
     */
    public create (width: number, height: number, format = PixelFormat.RGBA8888, mipmapLevel = 1) {
        this.reset({
            width,
            height,
            format,
            mipmapLevel,
        });
    }

    /**
     * 返回此贴图的字符串表示。
     */
    public toString () {
        return this._mipmaps.length !== 0 ? this._mipmaps[0].url : '';
    }

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

    /**
     * 若此贴图 0 级 Mipmap 的图像资源的实际源存在并为 HTML 元素则返回它，否则返回 `null`。
     * @returns HTML 元素或 `null`。
     * @deprecated 请转用 `this.image.data`。
     */
    public getHtmlElementObj () {
        return (this._mipmaps[0] && (this._mipmaps[0].data instanceof HTMLElement)) ? this._mipmaps[0].data : null;
    }

    /**
     * 销毁此贴图，清空所有 Mipmap 并释放占用的 GPU 资源。
     */
    public destroy () {
        this._mipmaps = [];
        return super.destroy();
    }

    /**
     * 返回此贴图的描述。
     * @returns 此贴图的描述。
     */
    public description () {
        const url = this._mipmaps[0] ? this._mipmaps[0].url : '';
        return `<cc.Texture2D | Name = ${url} | Dimension = ${this.width} x ${this.height}>`;
    }

    /**
     * 释放占用的 GPU 资源。
     * @deprecated 请转用 `this.destroy()`。
     */
    public releaseTexture () {
        this.destroy();
    }

    public _serialize (exporting?: any): any {
        return {
            base: super._serialize(exporting),
            mipmaps: this._mipmaps.map((mipmap) => {
                if (exporting) {
                    return Editor.Utils.UuidUtils.compressUuid(mipmap._uuid, true);
                }
                return mipmap._uuid;
            }),
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

    public initialize () {
        this.mipmaps = this._mipmaps;
    }

    protected _getGfxTextureCreateInfo (presumed: PresumedGFXTextureInfo) {
        return Object.assign({
            type: GFXTextureType.TEX2D,
            width: this._width,
            height: this._height,
        }, presumed);
    }

    protected _getGfxTextureViewCreateInfo (presumed: PresumedGFXTextureViewInfo) {
        return Object.assign({
            type: GFXTextureViewType.TV2D,
        }, presumed);
    }
}

cc.Texture2D = Texture2D;

export interface ITexture2DSerializeData {
    base: string;
    mipmaps: string[];
}
