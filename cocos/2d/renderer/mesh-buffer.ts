/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 * @packageDocumentation
 * @module ui
 */
import { Device, BufferUsageBit, MemoryUsageBit, Attribute, Buffer, BufferInfo, InputAssembler, InputAssemblerInfo } from '../../core/gfx';
import { getComponentPerVertex } from './vertex-format';
import { getError, warnID } from '../../core/platform/debug';
import { sys } from '../../core';
import { assertIsTrue } from '../../core/data/utils/asserts';

interface IIARef {
    ia: InputAssembler;
    vertexBuffers: Buffer[];
    indexBuffer: Buffer;
}

export class MeshBuffer {
    get attributes () { return this._attributes; }
    get vertexFormatBytes () { return this._vertexFormatBytes; }

    public byteOffset = 0;
    public vertexOffset = 0;
    public indexOffset = 0;
    public vData: Float32Array = null!;
    public iData: Uint16Array = null!;

    private _dirty = false;
    private _vertexFormatBytes = 0;
    private _floatsPerVertex = 0;
    private _initVDataCount = 0;
    private _initIDataCount = 0;
    private _attributes: Attribute[] = null!;

    // InputAssembler pools for each mesh buffer, array offset correspondent
    private _iaPool: IIARef[] = [];
    private _iaInfo: InputAssemblerInfo = null!;
    private _nextFreeIAHandle = 0;

    public initialize (device: Device, attrs: Attribute[], vFloatCount: number, iCount: number) {
        this._initVDataCount = vFloatCount;
        this._initIDataCount = iCount;
        this._attributes = attrs;
        this._floatsPerVertex = getComponentPerVertex(attrs);
        assertIsTrue(this._initVDataCount / this._floatsPerVertex < 65536, getError(9005));

        if (!this.vData || !this.iData) {
            this.vData = new Float32Array(this._initVDataCount);
            this.iData = new Uint16Array(this._initIDataCount);
        }
        // Initialize the first ia
        this._iaPool.push(this.createNewIA(device));
    }

    public reset () {
        this._nextFreeIAHandle = 0;
        this._dirty = false;
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
        this._dirty = true;
    }

    /**
     * @deprecated since v3.4.0, please use BufferAccessor's request
     * @see [[BufferAccessor.request]]
     */
    public request (vertexCount: number, indexCount: number) {
        warnID(9002);
        return false;
    }

    public requireFreeIA (device: Device) {
        if (this._iaPool.length <= this._nextFreeIAHandle) {
            this._iaPool.push(this.createNewIA(device));
        }
        const ia = this._iaPool[this._nextFreeIAHandle++].ia;
        return ia;
    }

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
        const maxVertex = this.vertexOffset + vertexCount;
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
        this._dirty = false;
    }

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
