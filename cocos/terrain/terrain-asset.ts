/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 * @module terrain
 */
import { ccclass, serializable } from 'cc.decorator';
import { Asset, Texture2D } from '../core/assets';
import { legacyCC } from '../core/global-exports';

export const TERRAIN_MAX_LEVELS = 4;
export const TERRAIN_MAX_BLEND_LAYERS = 4;
export const TERRAIN_MAX_LAYER_COUNT = 256;
export const TERRAIN_BLOCK_TILE_COMPLEXITY = 32;
export const TERRAIN_BLOCK_VERTEX_COMPLEXITY = 33;
export const TERRAIN_BLOCK_VERTEX_SIZE = 8; // position + normal + uv
export const TERRAIN_HEIGHT_BASE = 32768;
export const TERRAIN_HEIGHT_FACTORY = 1.0 / 512.0;
export const TERRAIN_HEIGHT_FMIN = (-TERRAIN_HEIGHT_BASE) * TERRAIN_HEIGHT_FACTORY;
export const TERRAIN_HEIGHT_FMAX = (65535 - TERRAIN_HEIGHT_BASE) * TERRAIN_HEIGHT_FACTORY;
export const TERRAIN_NORTH_INDEX = 0;
export const TERRAIN_SOUTH_INDEX = 1;
export const TERRAIN_WEST_INDEX = 2;
export const TERRAIN_EAST_INDEX = 3;

export const TERRAIN_DATA_VERSION = 0x01010001;
export const TERRAIN_DATA_VERSION2 = 0x01010002;
export const TERRAIN_DATA_VERSION3 = 0x01010003;
export const TERRAIN_DATA_VERSION4 = 0x01010004;
export const TERRAIN_DATA_VERSION5 = 0x01010005;
export const TERRAIN_DATA_VERSION_DEFAULT = 0x01010111;

class TerrainBuffer {
    public length = 0;
    public buffer: Uint8Array = new Uint8Array(2048);
    private _buffView: DataView = new DataView(this.buffer.buffer);
    private _seekPos = 0;

    public reserve (size: number) {
        if (this.buffer.byteLength > size) {
            return;
        }

        let capacity = this.buffer.byteLength;
        while (capacity < size) {
            capacity += capacity;
        }

        const temp = new Uint8Array(capacity);
        for (let i = 0; i < this.length; ++i) {
            temp[i] = this.buffer[i];
        }

        this.buffer = temp;
        this._buffView = new DataView(this.buffer.buffer);
    }

    public assign (buff: Uint8Array) {
        this.buffer = buff;
        this.length = buff.length;
        this._seekPos = buff.byteOffset;
        this._buffView = new DataView(buff.buffer);
    }

    public writeInt8 (value: number) {
        this.reserve(this.length + 1);

        this._buffView.setInt8(this.length, value);
        this.length += 1;
    }

    public writeInt16 (value: number) {
        this.reserve(this.length + 2);

        this._buffView.setInt16(this.length, value, true);
        this.length += 2;
    }

    public writeInt32 (value: number) {
        this.reserve(this.length + 4);

        this._buffView.setInt32(this.length, value, true);
        this.length += 4;
    }

    public writeIntArray (value: number[]) {
        this.reserve(this.length + 4 * value.length);

        for (let i = 0; i < value.length; ++i) {
            this._buffView.setInt32(this.length + i * 4, value[i], true);
        }
        this.length += 4 * value.length;
    }

    public writeFloat (value: number) {
        this.reserve(this.length + 4);

        this._buffView.setFloat32(this.length, value, true);
        this.length += 4;
    }

    public writeFloatArray (value: number[]) {
        this.reserve(this.length + 4 * value.length);

        for (let i = 0; i < value.length; ++i) {
            this._buffView.setFloat32(this.length + i * 4, value[i], true);
        }
        this.length += 4 * value.length;
    }

    public writeString (value: string) {
        this.reserve(this.length + value.length + 4);

        this._buffView.setInt32(this.length, value.length, true);
        for (let i = 0; i < value.length; ++i) {
            this._buffView.setInt8(this.length + 4 + i, value.charCodeAt(i));
        }
        this.length += value.length + 4;
    }

    public readInt8 () {
        const value = this._buffView.getInt8(this._seekPos);
        this._seekPos += 1;
        return value;
    }

    public readInt16 () {
        const value = this._buffView.getInt16(this._seekPos, true);
        this._seekPos += 2;
        return value;
    }

    public readInt () {
        const value = this._buffView.getInt32(this._seekPos, true);
        this._seekPos += 4;
        return value;
    }

    public readIntArray (value: number[]) {
        for (let i = 0; i < value.length; ++i) {
            value[i] = this._buffView.getInt32(this._seekPos + i * 4, true);
        }
        this._seekPos += 4 * value.length;
        return value;
    }

    public readFloat () {
        const value = this._buffView.getFloat32(this._seekPos, true);
        this._seekPos += 4;
        return value;
    }

    public readFloatArray (value: number[]) {
        for (let i = 0; i < value.length; ++i) {
            value[i] = this._buffView.getFloat32(this._seekPos + i * 4, true);
        }
        this._seekPos += 4 * value.length;
        return value;
    }

    public readString () {
        const length = this.readInt();

        let value = '';
        for (let i = 0; i < length; ++i) {
            value += String.fromCharCode(this.readInt8());
        }

        return value;
    }
}

/**
 * @en terrain layer info
 * @zh 地形纹理信息
 */
@ccclass('cc.TerrainLayerInfo')
export class TerrainLayerInfo {
    @serializable
    public slot = 0;
    @serializable
    public tileSize = 1;
    @serializable
    public detailMap: Texture2D|null = null;
    @serializable
    public normalMap: Texture2D|null = null;
    @serializable
    public roughness = 1;
    @serializable
    public metallic = 0;
}

/**
 * @en terrain layer binary info
 * @zh 地形纹理二进制信息
 */
 @ccclass('cc.TerrainLayerBinaryInfo')
export class TerrainLayerBinaryInfo {
    public slot = 0;
    public tileSize = 1;
    public roughness = 1;
    public metallic = 0;
    public detailMapId = '';
    public normalMapId = '';
}

/**
 * @en terrain asset
 * @zh 地形资源
 */
@ccclass('cc.TerrainAsset')
export class TerrainAsset extends Asset {
    protected _version = 0;
    protected _data: Uint8Array|null = null;
    protected _tileSize = 1;
    protected _blockCount: number[] = [1, 1];
    protected _weightMapSize = 128;
    protected _lightMapSize = 128;
    protected _heights: Uint16Array = new Uint16Array();
    protected _weights: Uint8Array = new Uint8Array();
    protected _layerBuffer: number[] = [-1, -1, -1, -1];
    protected _layerBinaryInfos: TerrainLayerBinaryInfo[] = [];
    @serializable
    protected _layerInfos: TerrainLayerInfo[] = [];

    constructor () {
        super();
    }

    /**
     * @marked_as_engine_private
     */
    get _nativeAsset (): ArrayBuffer {
        return this._data!.buffer;
    }
    set _nativeAsset (value: ArrayBuffer) {
        if (this._data && this._data.byteLength === value.byteLength) {
            this._data.set(new Uint8Array(value));
        } else {
            this._data = new Uint8Array(value);
        }

        this._loadNativeData(this._data);
    }

    /**
     * @en version
     * @zh 版本
     */
    get version () {
        return this._version;
    }

    /**
     * @en tile size
     * @zh 栅格大小
     */
    set tileSize (value: number) {
        this._tileSize = value;
    }

    get tileSize () {
        return this._tileSize;
    }

    /**
     * @en block count
     * @zh 块数量
     */
    set blockCount (value: number[]) {
        this._blockCount = value;
    }

    get blockCount () {
        return this._blockCount;
    }

    /**
     * @en light map size
     * @zh 光照图大小
     */
    set lightMapSize (value: number) {
        this._lightMapSize = value;
    }

    get lightMapSize () {
        return this._lightMapSize;
    }

    /**
     * @en weight map size
     * @zh 权重图大小
     */
    set weightMapSize (value: number) {
        this._weightMapSize = value;
    }

    get weightMapSize () {
        return this._weightMapSize;
    }

    /**
     * @en height buffer
     * @zh 高度缓存
     */
    set heights (value: Uint16Array) {
        this._heights = value;
    }

    get heights () {
        return this._heights;
    }

    /**
     * @en weight buffer
     * @zh 权重缓存
     */
    set weights (value: Uint8Array) {
        this._weights = value;
    }

    get weights () {
        return this._weights;
    }

    /**
     * @en layer buffer
     * @zh 纹理索引缓存
     */
    set layerBuffer (value: number[]) {
        this._layerBuffer = value;
    }

    get layerBuffer () {
        return this._layerBuffer;
    }

    /**
     * @en layer info
     * @zh 纹理信息
     */
    set layerInfos (value: TerrainLayerInfo[]) {
        this._layerInfos = value;
    }

    get layerInfos () {
        return this._layerInfos;
    }

    get layerBinaryInfos () {
        return this._layerBinaryInfos;
    }

    /**
     * @en get layer
     * @zh 获得纹理索引
     * @param xBlock block index x
     * @param yBlock block index y
     * @param layerId layer id
     */
    public getLayer (xBlock: number, yBlock: number, layerId: number) {
        const blockId = yBlock * this.blockCount[0] + xBlock;
        const index = blockId * 4 + layerId;

        if (xBlock < this.blockCount[0] && yBlock < this.blockCount[1] && index < this._layerBuffer.length) {
            return this._layerBuffer[index];
        }

        return -1;
    }

    public getHeight (i: number, j: number) {
        const vertexCountX = this._blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + 1;
        return (this._heights[j * vertexCountX + i] - TERRAIN_HEIGHT_BASE) * TERRAIN_HEIGHT_FACTORY;
    }

    public getVertexCountI () {
        if (this._blockCount.length < 1) return 0;
        return this._blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + 1;
    }

    public getVertexCountJ () {
        if (this._blockCount.length < 2) return 0;
        return this._blockCount[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + 1;
    }

    /**
     * @marked_as_engine_private
     */
    public _setNativeData (_nativeData: Uint8Array) {
        this._data = _nativeData;
    }

    /**
     * @marked_as_engine_private
     */
    public _loadNativeData (_nativeData: Uint8Array) {
        if (!_nativeData || _nativeData.length === 0) {
            return false;
        }

        const stream = new TerrainBuffer();
        stream.assign(_nativeData);

        // version
        this._version = stream.readInt();
        if (this._version === TERRAIN_DATA_VERSION_DEFAULT) {
            return true;
        }
        if (this._version !== TERRAIN_DATA_VERSION
            && this._version !== TERRAIN_DATA_VERSION2
            && this._version !== TERRAIN_DATA_VERSION3
            && this._version !== TERRAIN_DATA_VERSION4
            && this._version !== TERRAIN_DATA_VERSION5) {
            return false;
        }

        // geometry info
        this.tileSize = stream.readFloat();
        stream.readIntArray(this._blockCount);
        this.weightMapSize = stream.readInt16();
        this.lightMapSize = stream.readInt16();

        // heights
        const heightBufferSize = stream.readInt();
        this.heights = new Uint16Array(heightBufferSize);
        for (let i = 0; i < this.heights.length; ++i) {
            this.heights[i] = stream.readInt16();
        }

        // weights
        const WeightBufferSize = stream.readInt();
        this.weights = new Uint8Array(WeightBufferSize);
        for (let i = 0; i < this.weights.length; ++i) {
            this.weights[i] = stream.readInt8();
        }

        // layer buffer
        if (this._version >= TERRAIN_DATA_VERSION2) {
            const layerBufferSize = stream.readInt();
            this.layerBuffer = new Array<number>(layerBufferSize);
            for (let i = 0; i < this.layerBuffer.length; ++i) {
                this.layerBuffer[i] = stream.readInt16();
            }
        }

        // layer infos
        if (this._version >= TERRAIN_DATA_VERSION3) {
            const layerInfoSize = stream.readInt();
            this._layerBinaryInfos = new Array<TerrainLayerBinaryInfo>(layerInfoSize);
            for (let i = 0; i < this._layerBinaryInfos.length; ++i) {
                this._layerBinaryInfos[i] = new TerrainLayerBinaryInfo();
                this._layerBinaryInfos[i].slot = stream.readInt();
                this._layerBinaryInfos[i].tileSize = stream.readFloat();

                this._layerBinaryInfos[i].detailMapId = stream.readString();
                if (this._version >= TERRAIN_DATA_VERSION4) {
                    this._layerBinaryInfos[i].normalMapId = stream.readString();
                    this._layerBinaryInfos[i].roughness = stream.readFloat();
                    this._layerBinaryInfos[i].metallic = stream.readFloat();
                }
            }
        }

        return true;
    }

    /**
     * @marked_as_engine_private
     */
    public _exportNativeData (): Uint8Array {
        const stream = new TerrainBuffer();

        // version
        stream.writeInt32(TERRAIN_DATA_VERSION5);

        // geometry info
        stream.writeFloat(this.tileSize);
        stream.writeIntArray(this._blockCount);
        stream.writeInt16(this.weightMapSize);
        stream.writeInt16(this.lightMapSize);

        // heights
        stream.writeInt32(this.heights.length);
        for (let i = 0; i < this.heights.length; ++i) {
            stream.writeInt16(this.heights[i]);
        }

        // weights
        stream.writeInt32(this.weights.length);
        for (let i = 0; i < this.weights.length; ++i) {
            stream.writeInt8(this.weights[i]);
        }

        // layer buffer
        stream.writeInt32(this.layerBuffer.length);
        for (let i = 0; i < this.layerBuffer.length; ++i) {
            stream.writeInt16(this.layerBuffer[i]);
        }

        // layer infos
        const layerBinaryInfos: TerrainLayerBinaryInfo[] = [];
        layerBinaryInfos.length = this.layerInfos.length;
        for (let i = 0; i < layerBinaryInfos.length; ++i) {
            const layer = this.layerInfos[i];

            const binaryLayer = new TerrainLayerBinaryInfo();
            binaryLayer.slot = i;
            binaryLayer.tileSize = layer.tileSize;
            binaryLayer.detailMapId = layer.detailMap ? layer.detailMap._uuid : '';
            binaryLayer.normalMapId = layer.normalMap ? layer.normalMap._uuid : '';
            binaryLayer.metallic = layer.metallic;
            binaryLayer.roughness = layer.roughness;
            layerBinaryInfos[i] = binaryLayer;
        }

        stream.writeInt32(layerBinaryInfos.length);
        for (let i = 0; i < layerBinaryInfos.length; ++i) {
            stream.writeInt32(layerBinaryInfos[i].slot);
            stream.writeFloat(layerBinaryInfos[i].tileSize);
            stream.writeString(layerBinaryInfos[i].detailMapId);
            stream.writeString(layerBinaryInfos[i].normalMapId);
            stream.writeFloat(layerBinaryInfos[i].roughness);
            stream.writeFloat(layerBinaryInfos[i].metallic);
        }

        return stream.buffer;
    }

    /**
     * @marked_as_engine_private
     */
    public _exportDefaultNativeData (): Uint8Array {
        const stream = new TerrainBuffer();
        stream.writeInt32(TERRAIN_DATA_VERSION_DEFAULT);
        return stream.buffer;
    }
}
