/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 * @packageDocumentation
 * @module asset
 */

// @ts-check
import { ccclass, override } from 'cc.decorator';
import { EDITOR, MINIGAME, ALIPAY, XIAOMI, JSB, TEST, BAIDU } from 'internal:constants';
import { Device, Feature } from '../gfx';
import { Asset } from './asset';
import { PixelFormat } from './asset-enum';
import { legacyCC } from '../global-exports';
import { warnID } from '../platform/debug';

/**
 * @en Image source in memory
 * @zh 内存图像源。
 */
export interface IMemoryImageSource {
    _data: ArrayBufferView | null;
    _compressed: boolean;
    width: number;
    height: number;
    format: number;
}

/**
 * @en The image source, can be HTML canvas, image type or image in memory data
 * @zh 图像资源的原始图像源。可以来源于 HTML 元素也可以来源于内存。
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | IMemoryImageSource | ImageBitmap;

function isImageBitmap (imageSource: any): boolean {
    return !!(legacyCC.sys.hasFeature(legacyCC.sys.Feature.IMAGE_BITMAP) && imageSource instanceof ImageBitmap);
}

function fetchImageSource (imageSource: ImageSource) {
    return '_data' in imageSource ? imageSource._data : imageSource;
}

// 返回该图像源是否是平台提供的图像对象。
function isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
    if (ALIPAY || XIAOMI || BAIDU) {
        // We're unable to grab the constructors of Alipay native image or canvas object.
        return !('_data' in imageSource);
    }
    if (JSB && (imageSource as IMemoryImageSource)._compressed === true) {
        return false;
    }

    return imageSource instanceof HTMLImageElement || imageSource instanceof HTMLCanvasElement || isImageBitmap(imageSource);
}

/**
 * @en Image Asset.
 * @zh 图像资源。
 */
@ccclass('cc.ImageAsset')
export class ImageAsset extends Asset {
    /**
     * @legacy_public
     */
    @override
    get _nativeAsset () {
        // Maybe returned to pool in webgl.
        return this._nativeData;
    }
    set _nativeAsset (value: ImageSource) {
        if (!(value instanceof HTMLElement) && !isImageBitmap(value)) {
            // @ts-expect-error internal API usage
            value.format = value.format || this._format;
        }
        this.reset(value);
    }

    /**
     * @en Image data.
     * @zh 此图像资源的图像数据。
     */
    get data () {
        if (this._nativeData && isNativeImage(this._nativeData)) {
            return this._nativeData;
        }

        return this._nativeData && this._nativeData._data;
    }

    /**
     * @en The pixel width of the image.
     * @zh 此图像资源的像素宽度。
     */
    get width () {
        return this._nativeData.width || this._width;
    }

    /**
     * @en The pixel height of the image.
     * @zh 此图像资源的像素高度。
     */
    get height () {
        return this._nativeData.height || this._height;
    }

    /**
     * @en The pixel format of the image.
     * @zh 此图像资源的像素格式。
     */
    get format () {
        return this._format;
    }

    /**
     * @en Whether the image is in compressed texture format.
     * @zh 此图像资源是否为压缩像素格式。
     */
    get isCompressed () {
        return (this._format >= PixelFormat.RGB_ETC1 && this._format <= PixelFormat.RGBA_ASTC_12x12)
        || (this._format >= PixelFormat.RGB_A_PVRTC_2BPPV1 && this._format <= PixelFormat.RGBA_ETC1);
    }

    /**
     * @en The original source image URL, it could be empty.
     * @zh 此图像资源的原始图像源的 URL。当原始图像元不是 HTML 文件时可能为空。
     * @deprecated Please use [[nativeUrl]]
     */
    get url () {
        return this.nativeUrl;
    }

    private static extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm', '.astc'];

    private _nativeData: ImageSource;

    private _exportedExts: string[] | null | undefined = undefined;

    private _format: PixelFormat = PixelFormat.RGBA8888;

    private _width = 0;

    private _height = 0;

    constructor (nativeAsset?: ImageSource) {
        super();

        this._nativeData = {
            _data: null,
            width: 0,
            height: 0,
            format: 0,
            _compressed: false,
        };

        if (EDITOR) {
            this._exportedExts = null;
        }

        if (nativeAsset !== undefined) {
            this.reset(nativeAsset);
        }
    }

    /**
     * @en Reset the source of the image asset.
     * @zh 重置此图像资源使用的原始图像源。
     * @param data The new source
     */
    public reset (data: ImageSource) {
        if (isImageBitmap(data)) {
            this._nativeData = data;
        } else if (!(data instanceof HTMLElement)) {
            // this._nativeData = Object.create(data);
            this._nativeData = data;
            // @ts-expect-error internal api usage
            this._format = data.format;
        } else {
            this._nativeData = data;
        }
    }

    public destroy () {
        if (this.data && this.data instanceof HTMLImageElement) {
            this.data.src = '';
            this._setRawAsset('');
            // @ts-expect-error JSB element should destroy native data.
            if (JSB) this.data.destroy();
        } else if (isImageBitmap(this.data)) {
            // @ts-expect-error internal api usage
            this.data.close && this.data.close();
        }
        return super.destroy();
    }

    // SERIALIZATION

    /**
     * @legacy_public
     */
    // eslint-disable-next-line consistent-return
    public _serialize () {
        if (EDITOR || TEST) {
            let targetExtensions = this._exportedExts;
            if (!targetExtensions && this._native) {
                targetExtensions = [this._native];
            }

            if (!targetExtensions) {
                return '';
            }

            const extensionIndices: string[] = [];
            for (const targetExtension of targetExtensions) {
                const extensionFormat = targetExtension.split('@');
                const i = ImageAsset.extnames.indexOf(extensionFormat[0]);
                let exportedExtensionID = i < 0 ? targetExtension : `${i}`;
                if (extensionFormat[1]) {
                    exportedExtensionID += `@${extensionFormat[1]}`;
                }
                extensionIndices.push(exportedExtensionID);
            }
            return { fmt: extensionIndices.join('_'), w: this.width, h: this.height };
        }
    }

    /**
     * @legacy_public
     */
    public _deserialize (data: any) {
        let fmtStr = '';
        if (typeof data === 'string') {
            fmtStr = data;
        } else {
            this._width = data.w;
            this._height = data.h;
            fmtStr = data.fmt;
        }
        const device = _getGlobalDevice();
        const extensionIDs = fmtStr.split('_');

        let preferedExtensionIndex = Number.MAX_VALUE;
        let format = this._format;
        let ext = '';
        const SupportTextureFormats = legacyCC.macro.SUPPORT_TEXTURE_FORMATS as string[];
        for (const extensionID of extensionIDs) {
            const extFormat = extensionID.split('@');

            const i = parseInt(extFormat[0], undefined);
            const tmpExt = ImageAsset.extnames[i] || extFormat[0];

            const index = SupportTextureFormats.indexOf(tmpExt);
            if (index !== -1 && index < preferedExtensionIndex) {
                const fmt = extFormat[1] ? parseInt(extFormat[1]) : this._format;
                // check whether or not support compressed texture
                if (tmpExt === '.astc' && (!device || !device.hasFeature(Feature.FORMAT_ASTC))) {
                    continue;
                } else if (tmpExt === '.pvr' && (!device || !device.hasFeature(Feature.FORMAT_PVRTC))) {
                    continue;
                } else if ((fmt === PixelFormat.RGB_ETC1 || fmt === PixelFormat.RGBA_ETC1)
                    && (!device || !device.hasFeature(Feature.FORMAT_ETC1))) {
                    continue;
                } else if ((fmt === PixelFormat.RGB_ETC2 || fmt === PixelFormat.RGBA_ETC2)
                    && (!device || !device.hasFeature(Feature.FORMAT_ETC2))) {
                    continue;
                } else if (tmpExt === '.webp' && !legacyCC.sys.hasFeature(legacyCC.sys.Feature.WEBP)) {
                    continue;
                }
                preferedExtensionIndex = index;
                ext = tmpExt;
                format = fmt;
            }
        }

        if (ext) {
            this._setRawAsset(ext);
            this._format = format;
        } else {
            warnID(3121);
        }
    }

    private static _sharedPlaceHolderCanvas: HTMLCanvasElement | null = null;

    public initDefault (uuid?: string) {
        super.initDefault(uuid);
        if (!ImageAsset._sharedPlaceHolderCanvas) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            const l = canvas.width = canvas.height = 2;
            context.fillStyle = '#ff00ff';
            context.fillRect(0, 0, l, l);
            this.reset(canvas);
            ImageAsset._sharedPlaceHolderCanvas = canvas;
        } else {
            this.reset(ImageAsset._sharedPlaceHolderCanvas);
        }
    }

    public validate () {
        return !!this.data;
    }
}

function _getGlobalDevice (): Device | null {
    if (legacyCC.director.root) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return legacyCC.director.root.device;
    }
    return null;
}
legacyCC.ImageAsset = ImageAsset;
