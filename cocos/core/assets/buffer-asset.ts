/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, override } from 'cc.decorator';
import { assertIsNonNullable } from '../data/utils/asserts';
import { legacyCC } from '../global-exports';
import { Asset } from './asset';

@ccclass('cc.BufferAsset')
export class BufferAsset extends Asset {
    private _buffer: ArrayBuffer | null = null;

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    get _nativeAsset () {
        return this._buffer as ArrayBuffer;
    }
    set _nativeAsset (bin: ArrayBufferView | ArrayBuffer) {
        if (bin instanceof ArrayBuffer) {
            this._buffer = bin;
        } else {
            this._buffer = bin.buffer;
        }
    }

    /**
     * @zh 获取此资源中的缓冲数据。
     * @en Get the ArrayBuffer data of this asset.
     * @returns @en The ArrayBuffer. @zh 缓冲数据。
     */
    public buffer () {
        assertIsNonNullable(this._buffer);
        return this._buffer;
    }

    public validate () {
        return !!this.buffer;
    }
}

legacyCC.BufferAsset = BufferAsset;
