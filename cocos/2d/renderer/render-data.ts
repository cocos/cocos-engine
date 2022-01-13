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
 * @hidden
 */

import { director } from '../../core/director';
import { Material } from '../../core/assets/material';
import { TextureBase } from '../../core/assets/texture-base';
import { Color } from '../../core/math';
import { Pool, RecyclePool } from '../../core/memop';
import { murmurhash2_32_gc } from '../../core/utils/murmurhash2_gc';
import { SpriteFrame } from '../assets/sprite-frame';
import { Renderable2D } from '../framework/renderable-2d';
import { StaticVBChunk } from './static-vb-accessor';
import { getAttributeStride, vfmtPosUvColor } from './vertex-format';
import { Buffer, BufferInfo, BufferUsageBit, Device, InputAssembler, InputAssemblerInfo, MemoryUsageBit } from '../../core/gfx';
import { assertIsTrue } from '../../core/data/utils/asserts';

export interface IRenderData {
    x: number;
    y: number;
    z: number;
    u: number;
    v: number;
    color: Color;
}

const DEFAULT_STRIDE = getAttributeStride(vfmtPosUvColor) >> 2;

export class BaseRenderData {
    public material: Material | null = null;
    get vertexCount () {
        return this._vc;
    }
    get indexCount () {
        return this._ic;
    }
    get stride () {
        return this._floatStride << 2;
    }
    get floatStride () {
        return this._floatStride;
    }
    get vertexFormat () {
        return this._vertexFormat;
    }
    public chunk: StaticVBChunk = null!;
    public dataHash = 0;
    public isMeshBuffer = false;

    protected _vc = 0;
    protected _ic = 0;
    protected _floatStride = 0;
    protected _vertexFormat = vfmtPosUvColor;

    constructor (vertexFormat = vfmtPosUvColor) {
        this._floatStride = vertexFormat === vfmtPosUvColor ? DEFAULT_STRIDE : (getAttributeStride(vertexFormat) >> 2);
        this._vertexFormat = vertexFormat;
    }

    public isValid () {
        return this._ic > 0 && this.chunk.vertexAccessor;
    }

    public resize (vertexCount: number, indexCount: number) {
        if (vertexCount === this._vc && indexCount === this._ic && this.chunk) return;
        this._vc = vertexCount;
        this._ic = indexCount;
        const batcher = director.root!.batcher2D;
        const accessor = batcher.switchBufferAccessor(this._vertexFormat);
        if (this.chunk) {
            accessor.recycleChunk(this.chunk);
            this.chunk = null!;
        }
        // renderData always have chunk
        this.chunk = accessor.allocateChunk(vertexCount, indexCount)!;
    }
}

export class RenderData extends BaseRenderData {
    public static add (vertexFormat = vfmtPosUvColor) {
        const rd = _pool.add();
        rd._floatStride = vertexFormat === vfmtPosUvColor ? DEFAULT_STRIDE : (getAttributeStride(vertexFormat) >> 2);
        rd._vertexFormat = vertexFormat;
        return rd;
    }

    public static remove (data: RenderData) {
        const idx = _pool.data.indexOf(data);
        if (idx === -1) {
            return;
        }

        _pool.data[idx].clear();
        _pool.removeAt(idx);
    }

    get dataLength () {
        return this._data.length;
    }

    set dataLength (length: number) {
        const data: IRenderData[] = this._data;
        if (data.length !== length) {
            // // Free extra data
            const value = data.length;
            let i = 0;
            for (i = length; i < value; i++) {
                _dataPool.free(data[i]);
            }

            for (i = value; i < length; i++) {
                data[i] = _dataPool.alloc();
            }

            data.length = length;
        }
    }

    get data () {
        return this._data;
    }

    public vertDirty = true;

    private _data: IRenderData[] = [];
    private _indices: number[] = [];
    private _pivotX = 0;
    private _pivotY = 0;
    private _width = 0;
    private _height = 0;

    public frame;
    public layer = 0;
    public blendHash = -1;
    public textureHash = 0;

    public nodeDirty = true;
    public passDirty = true;
    public textureDirty = true;
    public hashDirty = true;

    public resize (vertexCount: number, indexCount: number) {
        super.resize(vertexCount, indexCount);
        this.updateHash();
    }

    public updateNode (comp: Renderable2D) {
        this.layer = comp.node.layer;
        this.nodeDirty = false;
        this.hashDirty = true;
    }

    public updatePass (comp: Renderable2D) {
        this.material = comp.getRenderMaterial(0);
        this.blendHash = comp.blendHash;
        this.passDirty = false;
        this.hashDirty = true;
    }

    public updateTexture (frame: SpriteFrame | TextureBase) {
        this.frame = frame;
        this.textureHash = frame.getHash();
        this.textureDirty = false;
        this.hashDirty = true;
    }

    public updateHash () {
        const bid = this.chunk ? this.chunk.bufferId : -1;
        const hashString = `${bid}${this.layer} ${this.blendHash} ${this.textureHash}`;
        this.dataHash = murmurhash2_32_gc(hashString, 666);
        this.hashDirty = false;
    }

    public updateRenderData (comp: Renderable2D, frame: SpriteFrame | TextureBase) {
        if (this.passDirty) {
            this.material = comp.getRenderMaterial(0);
            this.blendHash = comp.blendHash;
            this.passDirty = false;
            this.hashDirty = true;
        }
        if (this.nodeDirty) {
            const renderScene = comp.node.scene ? comp._getRenderScene() : null;
            this.layer = comp.node.layer;
            // Hack for updateRenderData when node not add to scene
            if (renderScene !== null) {
                this.nodeDirty = false;
            }
            this.hashDirty = true;
        }
        if (this.textureDirty) {
            this.frame = frame;
            this.textureHash = frame.getHash();
            this.textureDirty = false;
            this.hashDirty = true;
        }
        if (this.hashDirty) {
            const hashString = ` ${this.layer} ${this.blendHash} ${this.textureHash}`;
            this.dataHash = murmurhash2_32_gc(hashString, 666);
            this.hashDirty = false;
        }
    }

    public updateSizeNPivot (width: number, height: number, pivotX: number, pivotY: number) {
        if (width !== this._width
            || height !== this._height
            || pivotX !== this._pivotX
            || pivotY !== this._pivotY) {
            this._width = width;
            this._height = height;
            this._pivotX = pivotX;
            this._pivotY = pivotY;
            this.vertDirty = true;
        }
    }

    public clear () {
        this.resize(0, 0);
        this._data.length = 0;
        this._indices.length = 0;
        this._pivotX = 0;
        this._pivotY = 0;
        this._width = 0;
        this._height = 0;
        this.vertDirty = true;
        this.material = null;

        this.nodeDirty = true;
        this.passDirty = true;
        this.textureDirty = true;
        this.hashDirty = true;

        this.layer = 0;
        this.blendHash = -1;
        this.frame = null;
        this.textureHash = 0;
        this.dataHash = 0;
        this._vertexFormat = vfmtPosUvColor;
    }
}

export class MeshRenderData extends BaseRenderData {
    public static add (vertexFormat = vfmtPosUvColor) {
        const rd = _meshDataPool.add();
        rd._floatStride = vertexFormat === vfmtPosUvColor ? DEFAULT_STRIDE : (getAttributeStride(vertexFormat) >> 2);
        rd._vertexFormat = vertexFormat;
        return rd;
    }

    public static remove (data: MeshRenderData) {
        const idx = _meshDataPool.data.indexOf(data);
        if (idx === -1) {
            return;
        }

        _meshDataPool.data[idx].clear();
        _meshDataPool.removeAt(idx);
    }

    /**
     * @deprecated
     */
    set formatByte (value: number) {}
    get formatByte () { return this.stride; }

    get floatStride () { return this._floatStride; }

    /**
     * Index of Float32Array: vData
     */
    get vDataOffset () { return this._byteLength >>> 2; }

    public isMeshBuffer = true;
    public vData: Float32Array;
    public iData: Uint16Array;
    /**
     * First vertex used in the current IA
     */
    public vertexStart = 0;
    /**
     * Vertex count used in the current IA
     */
    public vertexRange = 0;
    /**
     * First index used in the current IA
     */
    public indexStart = 0;
    /**
     * Index count used in the current IA
     */
    public indexRange = 0;
    // only for graphics
    public lastFilledIndex = 0;
    public lastFilledVertex = 0;

    private _byteLength = 0;
    private _vertexBuffers: Buffer[] = [];
    private _indexBuffer: Buffer = null!;

    private _iaPool: RecyclePool<InputAssembler> | null = null;
    private _iaInfo: InputAssemblerInfo = null!;

    constructor (vertexFormat = vfmtPosUvColor) {
        super(vertexFormat);
        this.vData = new Float32Array(256 * this.stride);
        this.iData = new Uint16Array(256 * 6);
    }

    public request (vertexCount: number, indexCount: number) {
        const byteOffset = this._byteLength + vertexCount * this.stride;
        const succeed = this.reserve(vertexCount, indexCount);
        if (!succeed) return false;
        this._vc += vertexCount; // vertexOffset
        this._ic += indexCount; // indicesOffset
        this._byteLength = byteOffset; // byteOffset
        return true;
    }

    public reserve (vertexCount: number, indexCount: number) {
        const newVBytes = this._byteLength + vertexCount * this.stride;
        const newICount = this.indexCount + indexCount;

        if (vertexCount + this.vertexCount > 65535) {
            return false;
        }

        let byteLength = this.vData.byteLength;
        let indicesLength = this.iData.length;
        let vCount = this.vData.length;
        let iCount = this.iData.length;
        if (newVBytes > byteLength || newICount > indicesLength) {
            while (byteLength < newVBytes || indicesLength < newICount) {
                vCount *= 2;
                iCount *= 2;

                byteLength = vCount * 4;
                indicesLength = iCount;
            }

            this._reallocBuffer(vCount, iCount);
        }
        return true;
    }

    // overload
    // Resize buffer and IA range
    public resize (vertexCount: number, indexCount: number) {
        const byteLength = vertexCount * this.stride;
        assertIsTrue(vertexCount >= 0 && indexCount >= 0 && byteLength <= this.vData.byteLength && indexCount <= this.iData.length);
        this._vc = vertexCount;
        this._ic = indexCount;
        this._byteLength = byteLength;
        this.updateRange(0, vertexCount, 0, indexCount);
    }

    // Only resize IA range
    public updateRange (vertOffset: number, vertexCount: number, indexOffset: number, indexCount: number) {
        assertIsTrue(vertexCount >= 0 && indexCount >= 0 && vertexCount <= this._vc && indexCount <= this._ic);
        this.vertexStart = vertOffset;
        this.indexStart = indexOffset;
        this.vertexRange = vertexCount;
        this.indexRange = indexCount;
    }

    public requestIA (device: Device) {
        this._initIAInfo(device);
        const ia = this._iaPool!.add();
        ia.firstIndex = this.indexStart;
        ia.indexCount = this.indexRange;
        return ia;
    }

    public uploadBuffers () {
        if (this._byteLength === 0 || !this._vertexBuffers[0] || !this._indexBuffer) {
            return;
        }

        const indexCount = this._ic;
        const verticesData = new Float32Array(this.vData.buffer, 0, this._byteLength >> 2);
        const indicesData = new Uint16Array(this.iData.buffer, 0, indexCount);

        const vertexBuffer = this._vertexBuffers[0];
        if (this._byteLength > vertexBuffer.size) {
            vertexBuffer.resize(this._byteLength);
        }
        vertexBuffer.update(verticesData);

        const indexBytes = indexCount << 1;
        if (indexBytes > this._indexBuffer.size) {
            this._indexBuffer.resize(indexBytes);
        }
        this._indexBuffer.update(indicesData);
    }

    public freeIAPool () {
        if (this._iaPool) {
            this._iaPool.reset();
        }
    }

    public reset () {
        this._vc = 0;
        this._ic = 0;
        this._byteLength = 0;
        this.vertexStart = 0;
        this.vertexRange = 0;
        this.indexStart = 0;
        this.indexRange = 0;
        this.lastFilledIndex = 0;
        this.lastFilledVertex = 0;
        this.material = null;
        this.freeIAPool();
    }

    public clear () {
        this.reset();
        if (this._iaPool) {
            this._iaPool.destroy();
        }
        if (this._vertexBuffers[0]) {
            this._vertexBuffers[0].destroy();
            this._vertexBuffers = [];
        }
        this._iaInfo = null!;
        this.vData = new Float32Array(256 * this.stride);
        this.iData = new Uint16Array(256 * 6);
    }

    protected _initIAInfo (device: Device) {
        if (!this._iaInfo) {
            const vbStride = this.stride;
            const vbs = this._vertexBuffers;
            if (!vbs.length) {
                vbs.push(device.createBuffer(new BufferInfo(
                    BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                    MemoryUsageBit.DEVICE,
                    vbStride,
                    vbStride,
                )));
            }
            const ibStride = Uint16Array.BYTES_PER_ELEMENT;
            if (!this._indexBuffer) {
                this._indexBuffer = device.createBuffer(new BufferInfo(
                    BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
                    MemoryUsageBit.DEVICE,
                    ibStride,
                    ibStride,
                ));
            }
            this._iaInfo = new InputAssemblerInfo(this._vertexFormat, vbs, this._indexBuffer);
            this._iaPool =  new RecyclePool(() => device.createInputAssembler(this._iaInfo), 1, (ia) => { ia.destroy(); });
        }
    }

    protected _reallocBuffer (vCount, iCount) {
        // copy old data
        const oldVData = this.vData;
        this.vData = new Float32Array(vCount);
        if (oldVData) {
            this.vData.set(oldVData, 0);
        }
        const oldIData = this.iData;
        this.iData = new Uint16Array(iCount);
        if (oldIData) {
            this.iData.set(oldIData, 0);
        }
    }
}

export class QuadRenderData extends MeshRenderData {
    private _fillQuadBuffer () {
        const count = this.iData.length / 6;
        const buffer = this.iData;
        for (let i = 0, idx = 0; i < count; i++) {
            const vId = i * 4;
            buffer[idx++] = vId;
            buffer[idx++] = vId + 1;
            buffer[idx++] = vId + 2;
            buffer[idx++] = vId + 1;
            buffer[idx++] = vId + 3;
            buffer[idx++] = vId + 2;
        }
    }

    protected _reallocBuffer (vCount, iCount) {
        // copy old data
        super._reallocBuffer(vCount, iCount);
        this._fillQuadBuffer();
    }
}

const _dataPool = new Pool(() => ({
    x: 0,
    y: 0,
    z: 0,
    u: 0,
    v: 0,
    color: Color.WHITE.clone(),
}), 128);

const _pool = new RecyclePool(() => new RenderData(), 32);

const _meshDataPool: RecyclePool<MeshRenderData> = new RecyclePool(() => new MeshRenderData(), 32);
