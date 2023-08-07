/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { director } from '../../game/director';
import { Attribute } from '../../gfx/base/define';
import { StaticVBAccessor } from './static-vb-accessor';
import { getAttributeStride, vfmtPosUvColor } from './vertex-format';

export class BufferAccessorManager {
    public static instance: BufferAccessorManager;

    get currBufferAccessor (): StaticVBAccessor {
        if (this._staticVBBuffer) return this._staticVBBuffer;
        // create if not set
        this._staticVBBuffer = this.switchBufferAccessor();
        return this._staticVBBuffer;
    }

    public _staticVBBuffer: StaticVBAccessor | null = null;
    public _currBID = -1;

    private _bufferAccessors: Map<number, StaticVBAccessor> = new Map();

    /**
     * @zh 如果有必要，为相应的顶点布局切换网格缓冲区。
     * @en Switch the mesh buffer for corresponding vertex layout if necessary.
     * @param attributes use VertexFormat.vfmtPosUvColor by default
     */
    public switchBufferAccessor (attributes: Attribute[] = vfmtPosUvColor): StaticVBAccessor { // Native need
        const strideBytes = attributes === vfmtPosUvColor ? 36 /* 9x4 */ : getAttributeStride(attributes);
        // If current accessor not compatible with the requested attributes
        if (!this._staticVBBuffer || (this._staticVBBuffer.vertexFormatBytes) !== strideBytes) { // 是不是当前用的这个 accessor
            let accessor = this._bufferAccessors.get(strideBytes); // 不是的话就去取出来
            if (!accessor) { // 如果没有的话就创建一个
                accessor = new StaticVBAccessor(director.root!.device, attributes); // 新建一个，但要注意下这里会同步到 native // 通过它来触发
                this._bufferAccessors.set(strideBytes, accessor); // 缓存到 map // 这儿的 key 是 strideBytes
            }

            this._staticVBBuffer = accessor; // 赋值给当前的
            this._currBID = -1; // 重置 // 因为切换了 accessor，所以当前的 bid 也要重置 // 这儿相当于用两个flag来标记是否合批，其实综合起来就是 meshBuffer
        }
        return this._staticVBBuffer;
    }

    // Only Web need this
    public registerBufferAccessor (key: number, accessor: StaticVBAccessor): void {
        this._bufferAccessors.set(key, accessor);
    }

    public destroy (): void {
        for (const accessor of this._bufferAccessors.values()) {
            accessor.destroy();
        }
        this._bufferAccessors.clear();
    }

    public upload (): void {
        for (const accessor of this._bufferAccessors.values()) {
            accessor.uploadBuffers();
            accessor.reset();
        }
    }

    public reset (): void {
        for (const accessor of this._bufferAccessors.values()) {
            accessor.reset();
        }
        this._staticVBBuffer = null;
        this._currBID = -1;
    }

    // Only for static batching
    public setVBBufferForce (val: StaticVBAccessor | null): void {
        this._staticVBBuffer = val;
    }
}

BufferAccessorManager.instance = new BufferAccessorManager();
