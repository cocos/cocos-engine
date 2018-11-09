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

/**
 * Class ImageAsset.
 */
@ccclass('cc.ImageAsset')
export default class ImageAsset extends cc.Asset {
    constructor() {
        super();

        /**
         * @type {HTMLCanvasElement | HTMLImageElement | ArrayBufferView}
         */
        this._data = null;

        /**
         * @type {number}
         */
        this._width = 0;

        /**
         * @type {number}
         */
        this._height = 0;
    }
    
    /**
     * @type {HTMLCanvasElement | HTMLImageElement | ArrayBufferView}
     */
    @property({
        override: true
    })
    get _nativeAsset () {
        // maybe returned to pool in webgl
        return this._data;
    }

    /**
     * @param {HTMLCanvasElement | HTMLImageElement | { _data: ArrayBufferView, _compressed: boolean, width: number, height: number}} value
     */
    set _nativeAsset (value) {
        this._width = value.width;
        this._height = value.height;

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
        if (data instanceof HTMLElement) {
            this._width = data.width;
            this._height = data.height;
        }
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }
}

cc.ImageAsset = ImageAsset;