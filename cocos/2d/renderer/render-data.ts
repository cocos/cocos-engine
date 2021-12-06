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

import { Material } from '../../core/assets/material';
import { TextureBase } from '../../core/assets/texture-base';
import { Color } from '../../core/math';
import { Pool, RecyclePool } from '../../core/memop';
import { RenderScene } from '../../core/renderer/scene';
import { murmurhash2_32_gc } from '../../core/utils/murmurhash2_gc';
import { SpriteFrame } from '../assets/sprite-frame';
import { Renderable2D } from '../framework/renderable-2d';
import { MeshBuffer } from './mesh-buffer';

export interface IRenderData {
    x: number;
    y: number;
    z: number;
    u: number;
    v: number;
    color: Color;
}

export class BaseRenderData {
    public material: Material | null = null;
    public vertexCount = 0;
    public indicesCount = 0;
}

export class RenderData extends BaseRenderData {
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

    public static add () {
        return _pool.add();
    }

    public static remove (data: RenderData) {
        const idx = _pool.data.indexOf(data);
        if (idx === -1) {
            return;
        }

        _pool.data[idx].clear();
        _pool.removeAt(idx);
    }

    public vData: Float32Array | null = null;

    public uvDirty = true;
    public vertDirty = true;

    private _data: IRenderData[] = [];
    private _indices: number[] = [];
    private _pivotX = 0;
    private _pivotY = 0;
    private _width = 0;
    private _height = 0;

    public renderScene: RenderScene | null = null;
    public layer = 0;
    public nodeDirty = true;

    public blendHash = -1;
    public passDirty = true;

    public frame;
    public textureHash = 0;
    public textureDirty = true;

    public meshBufferDirty = true;
    public bufferHash = 0;

    public hashDirty = true;
    public dataHash = 0;

    public cacheBuffer: MeshBuffer | null = null;
    public bufferOffset = 0;

    public updateNode (comp: Renderable2D) {
        this.renderScene = comp.node.scene ? comp._getRenderScene() : null;
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
        const hashString = ` ${this.layer} ${this.blendHash} ${this.textureHash}`;
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
            this.renderScene = comp.node.scene ? comp._getRenderScene() : null;
            this.layer = comp.node.layer;
            // Hack for updateRenderData when node not add to scene
            if (this.renderScene !== null) {
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
        if (this.meshBufferDirty) {
            this.bufferHash = this.cacheBuffer?.bufferId || 0;
            this.meshBufferDirty = false;
            this.hashDirty = true;
        }
        if (this.hashDirty) {
            const hashString = ` ${this.layer} ${this.blendHash} ${this.textureHash} ${this.bufferHash}`;
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
        this._data.length = 0;
        this._indices.length = 0;
        this._pivotX = 0;
        this._pivotY = 0;
        this._width = 0;
        this._height = 0;
        this.uvDirty = true;
        this.vertDirty = true;
        this.material = null;
        this.vertexCount = 0;
        this.indicesCount = 0;

        this.nodeDirty = true;
        this.passDirty = true;
        this.textureDirty = true;
        this.hashDirty = true;

        this.renderScene = null;
        this.layer = 0;
        this.blendHash = -1;
        this.frame = null;
        this.textureHash = 0;
        this.dataHash = 0;
    }
}

export class MeshRenderData extends BaseRenderData {
    public vData: Float32Array;
    public iData: Uint16Array;
    /**
     * Each vertex contains multiple float numbers
     */
    public vertexStart = 0;
    /**
     * Number of indices
     */
    public indicesStart = 0;
    public byteStart = 0;
    public byteCount = 0;
    // only for graphics
    public lastFilledIndices = 0;
    public lastFilledVertex = 0;

    public cacheBuffer: MeshBuffer | null = null;
    public bufferOffset = 0;

    private _formatByte:number;

    constructor (vertexFloatCnt = 9) {
        super();
        this._formatByte = vertexFloatCnt * Float32Array.BYTES_PER_ELEMENT;
        this.vData = new Float32Array(256 * vertexFloatCnt * Float32Array.BYTES_PER_ELEMENT);
        this.iData = new Uint16Array(256 * 6);
    }

    set formatByte (value: number) { this._formatByte = value; }

    get formatByte () { return this._formatByte; }

    get floatStride () { return this._formatByte >> 2; }

    /**
     * Index of Float32Array: vData
     */
    get vDataOffset () { return this.byteCount >>> 2; }

    public static add () {
        return _meshDataPool.add();
    }

    public static remove (data: MeshRenderData) {
        const idx = _meshDataPool.data.indexOf(data);
        if (idx === -1) {
            return;
        }

        _meshDataPool.data[idx].reset();
        _meshDataPool.removeAt(idx);
    }

    public request (vertexCount: number, indicesCount: number) {
        const byteOffset = this.byteCount + vertexCount * this._formatByte;
        this.reserve(vertexCount, indicesCount);
        this.vertexCount += vertexCount; // vertexOffset
        this.indicesCount += indicesCount; // indicesOffset
        this.byteCount = byteOffset; // byteOffset
        return true;
    }

    public reserve (vertexCount: number, indicesCount: number) {
        const newVBytes = this.byteCount + vertexCount * this._formatByte;
        const newICount = this.indicesCount + indicesCount;

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

    public advance (vertexCount: number, indicesCount: number) {
        this.vertexCount += vertexCount; // vertexOffset
        this.indicesCount += indicesCount; // indicesOffset
        this.byteCount += vertexCount * this._formatByte;
    }

    public reset () {
        this.vertexCount = 0;
        this.indicesCount = 0;
        this.byteCount = 0;
        this.vertexStart = 0;
        this.indicesStart = 0;
        this.byteStart = 0;
        this.lastFilledIndices = 0;
        this.lastFilledVertex = 0;
    }

    protected _reallocBuffer (vCount, iCount) {
        // copy old data
        const oldVData = this.vData;
        this.vData = new Float32Array(vCount);
        this.vData.set(oldVData, 0);
        const oldIData = this.iData;
        this.iData = new Uint16Array(iCount);
        this.iData.set(oldIData, 0);
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
