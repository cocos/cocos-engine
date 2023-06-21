/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, override, serializable } from 'cc.decorator';
import { cclegacy } from '../../core';
import { Asset } from './asset';

/**
 * @en
 * `BufferAsset` is a kind of assets whose internal data is a section of memory buffer
 * that you can access through `BufferAsset.view`.
 * @zh
 * `BufferAsset` 是一类资产，其内部数据是一段内存缓冲，你可以通过 `BufferAsset.view` 获取其内部数据。
 */
@ccclass('cc.BufferAsset')
export class BufferAsset extends Asset {
    /**
     * @zh 缓冲数据的字节视图。
     * @en Byte view of the buffered data.
     */
    @serializable
    public view = new Uint8Array();

    /**
     * @zh 首次调用将 **复制** 此时的`this.view`，并返回副本的 `ArrayBuffer`；该副本会在后续调用中直接返回。
     * @en The first invocation on this method will **clone** `this.view` and returns `ArrayBuffer` of the copy.
     * The copy will be directly returned in following invocations.
     *
     * @returns @en The `ArrayBuffer`. @zh `ArrayBuffer`。
     *
     * @deprecated @zh 自 3.9.0，此方法废弃，调用此方法将带来可观的性能开销；请转而使用 `this.view`。
     * @en Since 3.9.0, this method is deprecated.
     * Invocation on this method leads to significate cost. Use `this.view` instead.
     */
    public buffer () {
        if (!this._bufferLegacy) {
            this._bufferLegacy = new Uint8Array(this.view);
        }
        return this._bufferLegacy.buffer;
    }

    /**
     * This field is preserved here for compatibility purpose:
     * prior to 3.9.0, `buffer()` returns `ArrayBuffer`.
     * We can't directly returns `this.view` in `this.buffer()`
     * since `this.view` does not view entire underlying buffer.
     */
    private _bufferLegacy: undefined | Uint8Array = undefined;
}

cclegacy.BufferAsset = BufferAsset;
