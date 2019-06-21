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
// @ts-check
import {ccclass, property} from '../core/data/class-decorator';
import { GFXDevice, GFXFeature } from '../gfx/device';
// import {addon} from '../core/utils/js';
import { Asset } from './asset';
import { PixelFormat } from './asset-enum';

/**
 * 内存图像源。
 */
export interface IMemoryImageSource {
    _data: ArrayBufferView | null;
    _compressed: boolean;
    width: number;
    height: number;
    format: number;
}

/**
 * 图像资源的原始图像源。可以来源于 HTML 元素也可以来源于内存。
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | IMemoryImageSource;

function fetchImageSource (imageSource: ImageSource) {
    return '_data' in imageSource ? imageSource._data : imageSource;
}

/**
 * 图像资源。
 */
@ccclass('cc.ImageAsset')
export class ImageAsset extends Asset {

    @property({override: true})
    get _nativeAsset () {
        // Maybe returned to pool in webgl.
        return this._nativeData;
    }

    set _nativeAsset (value: ImageSource) {
        this.reset(value);
    }

    /**
     * 此图像资源的图像数据。
     */
    get data () {
        return '_data' in this._nativeData ? this._nativeData._data : this._nativeData;
    }

    /**
     * 此图像资源的像素宽度。
     */
    get width () {
        return this._nativeData.width || this._width;
    }

    /**
     * 此图像资源的像素高度。
     */
    get height () {
        return this._nativeData.height || this._height;
    }

    /**
     * 此图像资源的像素格式。
     */
    get format () {
        return this._format;
    }

    /**
     * 此图像资源是否为压缩像素格式。
     */
    get isCompressed () {
        return this._format >= PixelFormat.RGB_ETC1 && this._format <= PixelFormat.RGBA_PVRTC_4BPPV1;
    }

    /**
     * 此图像资源的原始图像源的 URL。当原始图像元不是 HTML 文件时可能为空。
     * @deprecated 请转用 `this.nativeUrl`。
     */
    get url () {
        return this._url;
    }

    private static extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm'];

    private _nativeData: ImageSource;

    private _url: string;

    private _exportedExts: string[] | null | undefined = undefined;

    private _format: PixelFormat = PixelFormat.RGBA8888;

    private _width: number = 0;

    private _height: number = 0;

    /**
     * @param nativeAsset
     */
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

        if (CC_EDITOR) {
            this._exportedExts = null;
        }

        if (nativeAsset !== undefined) {
            this._nativeAsset = nativeAsset;
        }
    }

    /**
     * 重置此图像资源使用的原始图像源。
     * @param data 新的原始图像源。
     */
    public reset (data: ImageSource) {
        if (!(data instanceof HTMLElement)) {
            // this._nativeData = Object.create(data);
            this._nativeData = data;
            this._nativeData.format = this._format;
            this._onDataComplete();
        } else {
            this._nativeData = data;
            if (CC_WECHATGAME || CC_QQPLAY || (data as any).complete || data instanceof HTMLCanvasElement) {
                this._onDataComplete();
            } else {
                this.loaded = false;
                data.addEventListener('load', () => {
                    this._onDataComplete();
                });
                data.addEventListener('error', (err) => {
                    cc.warnID(3119, err.message);
                });
            }
        }
    }

    // destroy() {
    //     if (cc.macro.CLEANUP_IMAGE_CACHE) {
    //         if (this._data instanceof HTMLImageElement) {
    //             this._data.src = "";
    //             cc.loader.removeItem(this._data.id);
    //         }
    //     }
    // }

    // SERIALIZATION

    public _serialize () {
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
        const SupportTextureFormats = cc.macro.SUPPORT_TEXTURE_FORMATS as string[];
        for (const extensionID of extensionIDs) {
            const extFormat = extensionID.split('@');

            const i = parseInt(extFormat[0], undefined);
            const tmpExt = ImageAsset.extnames[i] || extFormat.join();

            const index = SupportTextureFormats.indexOf(tmpExt);
            if (index !== -1 && index < preferedExtensionIndex) {
                const fmt = extFormat[1] ? parseInt(extFormat[1]) : this._format;
                // check whether or not support compressed texture
                if ( tmpExt === '.pvr' && (!device || !device.hasFeature(GFXFeature.FORMAT_PVRTC))) {
                    continue;
                } else if (fmt === PixelFormat.RGB_ETC1 && (!device || !device.hasFeature(GFXFeature.FORMAT_ETC1))) {
                    continue;
                } else if ((fmt === PixelFormat.RGB_ETC2 || fmt === PixelFormat.RGBA_ETC2) &&
                    (!device || !device.hasFeature(GFXFeature.FORMAT_ETC2))) {
                    continue;
                } else if (tmpExt === '.webp' && !cc.sys.capabilities.webp) {
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
    if (cc.director && cc.director.root) {
        return cc.director.root.device;
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
 * @event loads
 */

cc.ImageAsset = ImageAsset;
