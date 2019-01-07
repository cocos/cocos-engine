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

/**
 * @typedef {{ _data: ArrayBufferView, _compressed: boolean, width: number, height: number, format: number}} RawImageData
 */

const CHAR_CODE_0 = 48;    // '0'

/**
 * Class ImageAsset.
 */
@ccclass('cc.ImageAsset')
export default class ImageAsset extends cc.Asset {

    public static extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.etc'];

    /**
     * @param {HTMLCanvasElement | HTMLImageElement | RawImageData} nativeAsset
     */
    constructor (nativeAsset = undefined) {
        super();
        EventTarget.call(this);

        /**
         * !#en
         * The url of the texture, this could be empty if the texture wasn't created via a file.
         * !#zh
         * 图像文件的 url，当图像不是由文件创建时值可能为空
         * @property url
         * @type {String}
         * @readonly
         */
        // TODO - use nativeUrl directly
        this.url = '';

        /**
         * @type {HTMLCanvasElement | HTMLImageElement | RawImageData}
         */
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
     * @type {HTMLCanvasElement | HTMLImageElement | RawImageData}
     */
    @property({
        override: true,
    })
    get _nativeAsset () {
        // maybe returned to pool in webgl
        return this._nativeData;
    }

    /**
     * @param {HTMLCanvasElement | HTMLImageElement | RawImageData} value
     */
    set _nativeAsset (value) {
        this.reset(value);
    }

    /**
     * @type {HTMLCanvasElement | HTMLImageElement | ArrayBufferView}
     */
    get data () {
        return this._nativeData instanceof HTMLElement ? this._nativeData : this._nativeData._data;
    }

    /**
     * @param {HTMLCanvasElement | HTMLImageElement | RawImageData} data
     */
    public reset (data) {
        if (!(data instanceof HTMLElement)) {
            this._nativeData = Object.create(data);
            this._onDataComplete();
        } else {
            this._nativeData = data;
            if (CC_WECHATGAME || CC_QQPLAY || data.complete || data instanceof HTMLCanvasElement) {
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
        let extId = '';
        let exportedExts = this._exportedExts;
        if (!exportedExts && this._native) {
            exportedExts = [this._native];
        }
        if (exportedExts) {
            const exts = [];
            for (let i = 0; i < exportedExts.length; i++) {
                let extId = '';
                const ext = exportedExts[i];
                if (ext) {
                    // ext@format
                    const extFormat = ext.split('@');
                    extId = ImageAsset.extnames.indexOf(extFormat[0]);
                    if (extId < 0) {
                        extId = ext;
                    }
                    if (extFormat[1]) {
                        extId += '@' + extFormat[1];
                    }
                }
                exts.push(extId);
            }
            extId = exts.join('_');
        }
        return '' + extId;
    }

    public _deserialize (data, handle) {
        const fields = data.split(',');
        // decode extname
        const extIdStr = fields[0];
        if (extIdStr) {
            const extIds = extIdStr.split('_');

            let extId = 999;
            let ext = '';
            let format = this._format;
            const SupportTextureFormats = cc.macro.SUPPORT_TEXTURE_FORMATS;
            for (let i = 0; i < extIds.length; i++) {
                const extFormat = extIds[i].split('@');
                let tmpExt = extFormat[0];
                tmpExt = tmpExt.charCodeAt(0) - CHAR_CODE_0;
                tmpExt = ImageAsset.extnames[tmpExt] || extFormat;

                const index = SupportTextureFormats.indexOf(tmpExt);
                if (index !== -1 && index < extId) {
                    extId = index;
                    ext = tmpExt;
                    format = extFormat[1] ? parseInt(extFormat[1]) : this._format;
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
                const url = this.nativeUrl;
                this.url = url;
            }
        }
    }

    public _onDataComplete () {
        this.loaded = true;
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
