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
import {ccclass, property} from '../core/data/class-decorator';
import EventTarget from '../core/event/event-target';
import {addon} from '../core/utils/js';
import { Asset } from './asset';

export interface IMemoryImageSource {
    _data: ArrayBufferView | null;
    _compressed: boolean;
    width: number;
    height: number;
    format: number;
}

type ImageSource = HTMLCanvasElement | HTMLImageElement | IMemoryImageSource;

/**
 * Class ImageAsset.
 */
@ccclass('cc.ImageAsset')
export default class ImageAsset extends Asset {

    @property({override: true})
    get _nativeAsset () {
        // Maybe returned to pool in webgl.
        return this._nativeData;
    }

    set _nativeAsset (value: ImageSource) {
        this.reset(value);
    }

    get data () {
        return this._nativeData instanceof HTMLElement ? this._nativeData : this._nativeData._data;
    }

    get width () {
        return this._nativeData.width;
    }

    get height () {
        return this._nativeData.height;
    }

    get format () {
        if (this._nativeData instanceof HTMLElement) {
            return undefined;
        }
        return this._nativeData.format;
    }

    /**
     * !#en
     * The url of the texture, this could be empty if the texture wasn't created via a file.
     * !#zh
     * 图像文件的 url，当图像不是由文件创建时值可能为空
     */
    // TODO - use nativeUrl directly
    get url () {
        return this._url;
    }

    private static extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.etc'];

    private _nativeData: ImageSource;

    private _url: string;

    private _exportedExts: string[] | null | undefined = undefined;

    private _format: string = '';

    /**
     * @param nativeAsset
     */
    constructor (nativeAsset?: ImageSource) {
        super();
        // @ts-ignore
        EventTarget.call(this);

        this._url = '';

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

    public reset (data: ImageSource) {
        if (!(data instanceof HTMLElement)) {
            this._nativeData = Object.create(data);
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
        return extensionIndices.join('_');
    }

    public _deserialize (data: string, handle: any) {
        const extensionIDs = data.split('_');

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
                preferedExtensionIndex = index;
                ext = tmpExt;
                format = extFormat[1] ? extFormat[1] : this._format;
            }
        }

        if (ext) {
            // @ts-ignore
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
        // @ts-ignore
        this.emit('load');
    }
}

/**
 * !#zh
 * 当该资源加载成功后触发该事件
 * !#en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */
addon(ImageAsset.prototype, EventTarget.prototype);

cc.ImageAsset = ImageAsset;
