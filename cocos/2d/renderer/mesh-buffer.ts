/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

import { JSB } from 'internal:constants';
import { Device, BufferUsageBit, MemoryUsageBit, Attribute, Buffer, BufferInfo, InputAssembler, InputAssemblerInfo } from '../../gfx';
import { getAttributeStride } from './vertex-format';
import { sys, getError, warnID, assertIsTrue } from '../../core';
import { NativeUIMeshBuffer } from './native-2d';

interface IIARef {
    ia: InputAssembler;
    vertexBuffers: Buffer[];
    indexBuffer: Buffer;
}

export enum MeshBufferSharedBufferView{
    byteOffset,
    vertexOffset,
    indexOffset,
    dirty,
    count,
}

export class MeshBuffer {
    get attributes () { return this._attributes; }
    get vertexFormatBytes () { return this._vertexFormatBytes; }

    protected _byteOffset = 0;
    get byteOffset () {
        return this._byteOffset;
    }
    set byteOffset (val:number) {
        this._byteOffset = val;
        if (JSB) {
            this._sharedBuffer[MeshBufferSharedBufferView.byteOffset] = val;
        }
    }

    protected _vertexOffset = 0;
    get vertexOffset () {
        return this._vertexOffset;
    }
    set vertexOffset (val:number) {
        this._vertexOffset = val;
        if (JSB) {
            this._sharedBuffer[MeshBufferSharedBufferView.vertexOffset] = val;
        }
    }

    protected _indexOffset = 0;
    get indexOffset () {
        return this._indexOffset;
    }
    set indexOffset (val:number) {
        this._indexOffset = val;
        if (JSB) {
            this._sharedBuffer[MeshBufferSharedBufferView.indexOffset] = val;
        }
    }

    protected _dirty = false;
    get dirty () {
        return this._dirty;
    }
    set dirty (val:boolean) {
        this._dirty = val;
        if (JSB) {
            this._sharedBuffer[MeshBufferSharedBufferView.dirty] = val ? 1 : 0;
        }
    }

    protected _floatsPerVertex = 0;
    get floatsPerVertex () {
        return this._floatsPerVertex;
    }
    set floatsPerVertex (val:number) {
        this._floatsPerVertex = val;
    }

    protected _vData: Float32Array = null!;
    get vData () {
        return this._vData;
    }
    set vData (val:Float32Array) {
        this._vData = val;
        //还得看是否需要共享.buffer
        if (JSB) {
            this._nativeObj.vData = val;
        }
    }

    protected _iData: Uint16Array = null!;
    get iData () {
        return this._iData;
    }
    set iData (val:Uint16Array) {
        this._iData = val;
        if (JSB) {
            this._nativeObj.iData = val;
        }
    }

    private _vertexFormatBytes = 0;
    private _initVDataCount = 0;
    private _initIDataCount = 0;
    private _attributes: Attribute[] = null!;

    // InputAssembler pools for each mesh buffer, array offset correspondent
    private _iaPool: IIARef[] = [];
    private _iaInfo: InputAssemblerInfo = null!;
    private _nextFreeIAHandle = 0;

    //nativeObj
    protected declare _nativeObj:NativeUIMeshBuffer;
    get nativeObj () {
        return this._nativeObj;
    }

    //sharedBuffer
    protected declare _sharedBuffer: Uint32Array;
    get sharedBuffer () {
        return this._sharedBuffer;
    }

    public initSharedBuffer () {
        if (JSB) {
            this._sharedBuffer = new Uint32Array(MeshBufferSharedBufferView.count);
        }
    }

    public syncSharedBufferToNative () {
        if (JSB) {
            this._nativeObj.syncSharedBufferToNative(this._sharedBuffer);
        }
    }

    constructor () {
        if (JSB) {
            this._nativeObj = new NativeUIMeshBuffer();
        }
        this.initSharedBuffer();
        this.syncSharedBufferToNative();
    }

    public initialize (device: Device, attrs: Attribute[], vFloatCount: number, iCount: number) {
        this._initVDataCount = vFloatCount;
        this._initIDataCount = iCount;
        this._attributes = attrs;

        this.floatsPerVertex = getAttributeStride(attrs) >> 2;

        assertIsTrue(this._initVDataCount / this._floatsPerVertex < 65536, getError(9005));

        if (!this.vData || !this.iData) {
            this.vData = new Float32Array(this._initVDataCount);
            this.iData = new Uint16Array(this._initIDataCount);
        }
        // Initialize the first ia
        this._iaPool.push(this.createNewIA(device));
        if (JSB) {
            this._nativeObj.initialize(attrs);
        }
    }

    public reset () {
        this._nextFreeIAHandle = 0;
        this.dirty = false;
    }

    public destroy () {
        this.reset();
        this._attributes = null!;
        this._iaInfo = null!;
        this.vData = null!;
        this.iData = null!;

        // Destroy InputAssemblers
        for (let i = 0; i < this._iaPool.length; ++i) {
            const iaRef = this._iaPool[i];
            if (iaRef.vertexBuffers[0]) {
                iaRef.vertexBuffers[0].destroy();
            }
            if (iaRef.indexBuffer) {
                iaRef.indexBuffer.destroy();
            }
            iaRef.ia.destroy();
        }
        this._iaPool.length = 0;
    }

    public setDirty () {
        this.dirty = true;
    }

    /**
     * @deprecated since v3.4.0, please use BufferAccessor's request
     * @see [[BufferAccessor.request]]
     */
    public request (vertexCount: number, indexCount: number) {
        warnID(9002);
        return false;
    }

    //有返回值暂时没写
    public requireFreeIA (device: Device) {
        if (this._iaPool.length <= this._nextFreeIAHandle) {
            this._iaPool.push(this.createNewIA(device));
        }
        const ia = this._iaPool[this._nextFreeIAHandle++].ia;
        return ia;
    }

    //参数暂时没传
    public recycleIA (ia: InputAssembler) {
        const pool = this._iaPool;
        for (let i = 0; i < this._nextFreeIAHandle; ++i) {
            if (ia === pool[i].ia) {
                // Swap to recycle the ia
                const iaRef = pool[i];
                pool[i] = pool[--this._nextFreeIAHandle];
                pool[this._nextFreeIAHandle] = iaRef;
                return;
            }
        }
    }

    public checkCapacity (vertexCount: number, indexCount: number) {
        const maxVertex = (this.vertexOffset + vertexCount) * this._floatsPerVertex;
        const maxIndex = this.indexOffset + indexCount;
        if (maxVertex > this._initVDataCount || maxIndex > this._initIDataCount) {
            return false;
        }
        return true;
    }

    public uploadBuffers () {
        if (this.byteOffset === 0 || !this._dirty) {
            return;
        }

        // On iOS14, different IAs can not share same GPU buffer, so must submit the same date to different buffers
        // @ts-expect-error Property '__isWebIOS14OrIPadOS14Env' does not exist on 'sys'
        const iOS14 = sys.__isWebIOS14OrIPadOS14Env;
        const submitCount = iOS14 ? this._nextFreeIAHandle : 1;
        const byteCount = this.byteOffset;
        const indexCount = this.indexOffset;
        for (let i = 0; i < submitCount; ++i) {
            const iaRef = this._iaPool[i];
            // if (iOS14) {
            //     indexCount = iaRef.ia.firstIndex + iaRef.ia.indexCount;
            //     const maxVertex = this.iData[indexCount];
            //     // Only upload as much data as needed, to avoid frequent resize, using pow2 size
            //     // Wrong implementation because maxVertex might be larger than the last vertex id, hard to find the correct max vertex
            //     byteCount = Math.min(this.byteOffset, nextPow2(maxVertex + 2) * this.vertexFormatBytes);
            // }

            const verticesData = new Float32Array(this.vData.buffer, 0, byteCount >> 2);
            const indicesData = new Uint16Array(this.iData.buffer, 0, indexCount);

            const vertexBuffer = iaRef.vertexBuffers[0];
            if (byteCount > vertexBuffer.size) {
                vertexBuffer.resize(byteCount);
            }
            vertexBuffer.update(verticesData);

            if (indexCount * 2 > iaRef.indexBuffer.size) {
                iaRef.indexBuffer.resize(indexCount * 2);
            }
            iaRef.indexBuffer.update(indicesData);
        }
        this.dirty = false;
    }

    //有返回值，暂时没原生化
    private createNewIA (device: Device): IIARef {
        let ia;
        let vertexBuffers;
        let indexBuffer;
        // HACK: After sharing buffer between drawcalls, the performance degradation a lots on iOS 14 or iPad OS 14 device
        // TODO: Maybe it can be removed after Apple fixes it?
        // @ts-expect-error Property '__isWebIOS14OrIPadOS14Env' does not exist on 'sys'
        if (sys.__isWebIOS14OrIPadOS14Env || !this._iaPool[0]) {
            const vbStride = this._vertexFormatBytes = this._floatsPerVertex * Float32Array.BYTES_PER_ELEMENT;
            const ibStride = Uint16Array.BYTES_PER_ELEMENT;
            const vertexBuffer = device.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                vbStride,
                vbStride,
            ));
            indexBuffer = device.createBuffer(new BufferInfo(
                BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                ibStride,
                ibStride,
            ));

            vertexBuffers = [vertexBuffer];
            // Reuse purpose for new IAs
            this._iaInfo = new InputAssemblerInfo(this._attributes, vertexBuffers, indexBuffer);
            ia = device.createInputAssembler(this._iaInfo);
        } else {
            ia = device.createInputAssembler(this._iaInfo);
            vertexBuffers = this._iaInfo.vertexBuffers;
            indexBuffer = this._iaInfo.indexBuffer;
        }
        return {
            ia,
            vertexBuffers,
            indexBuffer,
        };
    }
}
