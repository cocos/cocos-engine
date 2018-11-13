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
//@ts-check
import {ccclass, property} from "../core/data/class-decorator";

const CHAR_CODE_0 = 48;    // '0'

/**
 * Class ImageAsset.
 */
@ccclass('cc.ImageAsset')
export default class ImageAsset extends cc.Asset {

    static extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.etc'];

    constructor() {
        super();

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
        this.url = "";

        /**
         * @type {HTMLCanvasElement | HTMLImageElement | ArrayBufferView}
         */
        this._data = null;

        /**
         * @type {HTMLCanvasElement | HTMLImageElement | { _data: ArrayBufferView, _compressed: boolean, width: number, height: number}}
         */
        this._nativeData = null;

        if (CC_EDITOR) {
            this._exportedExts = null;
        }
    }
    
    /**
     * @type {HTMLCanvasElement | HTMLImageElement | { _data: ArrayBufferView, _compressed: boolean, width: number, height: number}}
     */
    @property({
        override: true
    })
    get _nativeAsset () {
        // maybe returned to pool in webgl
        return this._nativeData;
    }

    /**
     * @param {HTMLCanvasElement | HTMLImageElement | { _data: ArrayBufferView, _compressed: boolean, width: number, height: number}} value
     */
    set _nativeAsset (value) {
        this._nativeData = value;

        //@ts-ignore
        if (value._compressed && value._data) {
            //@ts-ignore
            this._data = value._data;
        }
        else {
            //@ts-ignore
            this._data = value;
        }
    }

    /**
     * @type {HTMLCanvasElement | HTMLImageElement | ArrayBufferView}
     */
    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    get width() {
        return this._nativeData ? this._nativeData.width : 0;
    }

    get height() {
        return this._nativeData ? this._nativeData.height : 0;
    }

    // SERIALIZATION

    _serialize () {
        let extId = "";
        let exportedExts = this._exportedExts;
        if (!exportedExts && this._native) {
            exportedExts = [this._native];
        }
        if (exportedExts) {
            let exts = [];
            for (let i = 0; i < exportedExts.length; i++) {
                let extId = "";
                let ext = exportedExts[i];
                if (ext) {
                    // ext@format
                    let extFormat = ext.split('@');
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
        return "" + extId;
    }

    _deserialize (data, handle) {
        let fields = data.split(',');
        // decode extname
        var extIdStr = fields[0];
        if (extIdStr) {
            let extIds = extIdStr.split('_');

            let extId = 999;
            let ext = '';
            let format = this._format;
            let SupportTextureFormats = cc.macro.SUPPORT_TEXTURE_FORMATS;
            for (let i = 0; i < extIds.length; i++) {
                let extFormat = extIds[i].split('@');
                let tmpExt = extFormat[0];
                tmpExt = tmpExt.charCodeAt(0) - CHAR_CODE_0;
                tmpExt = ImageAsset.extnames[tmpExt] || extFormat;

                let index = SupportTextureFormats.indexOf(tmpExt);
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
            let loadingItem = handle.customEnv;
            let uuid = loadingItem && loadingItem.uuid;
            if (uuid) {
                this._uuid = uuid;
                var url = this.nativeUrl;
                this.url = url;
            }
        }
    }
}

cc.ImageAsset = ImageAsset;