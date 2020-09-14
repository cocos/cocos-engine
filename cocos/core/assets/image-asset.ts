/*
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
import {ccclass, override} from 'cc.decorator';
import { GFXDevice, GFXFeature } from '../gfx/device';
import { Asset } from './asset';
import { PixelFormat } from './asset-enum';
import { EDITOR, MINIGAME, ALIPAY, XIAOMI, BYTEDANCE, JSB, TEST } from 'internal:constants';
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
export type ImageSource = HTMLCanvasElement | HTMLImageElement | IMemoryImageSource;

function fetchImageSource (imageSource: ImageSource) {
    return '_data' in imageSource ? imageSource._data : imageSource;
}

// 返回该图像源是否是平台提供的图像对象。
function isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement) {
    if (ALIPAY || XIAOMI) {
        // We're unable to grab the constructors of Alipay native image or canvas object.
        return !('_data' in imageSource);
    }
    else if (BYTEDANCE && typeof window.sharedCanvas === 'object' && imageSource instanceof window.sharedCanvas.constructor) {
        return true;
    }
    else if (JSB && (imageSource as IMemoryImageSource)._compressed === true) {
        return false;
    }
    else {
        return imageSource instanceof HTMLImageElement || imageSource instanceof HTMLCanvasElement;
    }
}

/**
 * @en Image Asset.
 * @zh 图像资源。
 */
@ccclass('cc.ImageAsset')
export class ImageAsset extends Asset {

    @override
    get _nativeAsset () {
        // Maybe returned to pool in webgl.
        return this._nativeData;
    }

    set _nativeAsset (value: ImageSource) {
        if (!(value instanceof HTMLElement)) {
            value.format = value.format || this._format;
        }
        this.reset(value);
    }

    /**
     * @en Image data.
     * @zh 此图像资源的图像数据。
     */
    get data () {
        if (isNativeImage(this._nativeData)) {
            return this._nativeData;
        }
        else {
            return this._nativeData._data;
        }
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
        return (this._format >= PixelFormat.RGB_ETC1 && this._format <= PixelFormat.RGBA_ASTC_12x12) ||
        (this._format >= PixelFormat.RGB_A_PVRTC_2BPPV1 && this._format <= PixelFormat.RGBA_ETC1);
    }

    /**
     * @en The original source image URL, it could be empty.
     * @zh 此图像资源的原始图像源的 URL。当原始图像元不是 HTML 文件时可能为空。
     * @deprecated Please use [[nativeUrl]]
     */
    get url () {
        return this._url;
    }

    /**
     * @private
     */
    set _texture (tex) {
        this._tex = tex;
    }

    get _texture () {
        if (!this._tex) {
            const tex = new legacyCC.Texture2D();
            tex.name = this._url;
            tex.image = this;
            this._tex = tex;
        }
        return this._tex;
    }

    private static extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm', '.astc'];

    private _nativeData: ImageSource;

    private _tex;

    private _url: string;

    private _exportedExts: string[] | null | undefined = undefined;

    private _format: PixelFormat = PixelFormat.RGBA8888;

    private _width: number = 0;

    private _height: number = 0;

    constructor (nativeAsset?: ImageSource) {
        super();

        this._url = '';
        this.loaded = false;

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
        if (!(data instanceof HTMLElement)) {
            // this._nativeData = Object.create(data);
            this._nativeData = data;
            this._format = data.format;
            this._onDataComplete();
        } else {
            this._nativeData = data;
            if (MINIGAME || (data as any).complete || data instanceof HTMLCanvasElement) { // todo need adatper
                this._onDataComplete();
            } else {
                this.loaded = false;
                data.addEventListener('load', () => {
                    this._onDataComplete();
                });
                data.addEventListener('error', (err) => {
                    warnID(3119, err.message);
                });
            }
        }
    }

    public destroy () {
        if (this.data && this.data instanceof HTMLImageElement) {
            this.data.src = "";
            this._setRawAsset("");
            legacyCC.loader.removeItem(this.data.id);
        }
        return super.destroy();
    }

    // SERIALIZATION

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
                    exportedExtensionID += '@' + extensionFormat[1];
                }
                extensionIndices.push(exportedExtensionID);
            }
            return { fmt: extensionIndices.join('_'), w: this.width, h: this.height };
        }
    }

    public _deserialize (data: any, handle: any) {
        let fmtStr = '';
        if (typeof data === 'string') {
            fmtStr = data;
        }
        else {
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
            const tmpExt = ImageAsset.extnames[i] || extFormat.join();

            const index = SupportTextureFormats.indexOf(tmpExt);
            if (index !== -1 && index < preferedExtensionIndex) {
                const fmt = extFormat[1] ? parseInt(extFormat[1]) : this._format;
                // check whether or not support compressed texture
                if ( tmpExt === '.astc' && (!device || !device.hasFeature(GFXFeature.FORMAT_ASTC))) {
                    continue;
                } else if ( tmpExt === '.pvr' && (!device || !device.hasFeature(GFXFeature.FORMAT_PVRTC))) {
                    continue;
                } else if ((fmt === PixelFormat.RGB_ETC1 || fmt === PixelFormat.RGBA_ETC1) &&
                    (!device || !device.hasFeature(GFXFeature.FORMAT_ETC1))) {
                    continue;
                } else if ((fmt === PixelFormat.RGB_ETC2 || fmt === PixelFormat.RGBA_ETC2) &&
                    (!device || !device.hasFeature(GFXFeature.FORMAT_ETC2))) {
                    continue;
                } else if (tmpExt === '.webp' && !legacyCC.sys.capabilities.webp) {
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
        }

        // preset uuid to get correct nativeUrl
        const loadingItem = handle.customEnv;
        const uuid = loadingItem && loadingItem.uuid;
        if (uuid) {
            this._uuid = uuid;
            this._url = this.nativeUrl;
        }
    }

    public _onDataComplete () {
        this.loaded = true;
        this.emit('load');
    }
}

function _getGlobalDevice (): GFXDevice | null {
    if (legacyCC.director.root) {
        return legacyCC.director.root.device;
    } else {
        return null;
    }
}

/**
 * @zh
 * 当该资源加载成功后触发该事件。
 * @en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */

legacyCC.ImageAsset = ImageAsset;
