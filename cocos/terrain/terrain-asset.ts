/**
 * @category terrain
 */
import { Asset } from '../core/assets';
import { ccclass } from '../core/data/class-decorator';
import { legacyCC } from '../core/global-exports';

export const TERRAIN_DATA_VERSION = 0x01010001;
export const TERRAIN_DATA_VERSION2 = 0x01010002;
export const TERRAIN_DATA_VERSION3 = 0x01010003;
export const TERRAIN_DATA_VERSION_DEFAULT = 0x01010111;

class TerrainBuffer {
    public length: number = 0;
    public buffer: Uint8Array = new Uint8Array(2048);
    private _buffView: DataView = new DataView(this.buffer.buffer);
    private _seekPos: number = 0;

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
export class TerrainLayerInfo {
    public slot: number = 0;
    public tileSize: number = 1;
    public detailMap: string = '';
}

/**
 * @en terrain asset
 * @zh 地形资源
 */
@ccclass('cc.TerrainAsset')
export class TerrainAsset extends Asset {
    protected _data: Uint8Array|null = null;
    protected _tileSize: number = 1;
    protected _blockCount: number[] = [1, 1];
    protected _weightMapSize: number = 128;
    protected _lightMapSize: number = 128;
    protected _heights: Uint16Array = new Uint16Array();
    protected _weights: Uint8Array = new Uint8Array();
    protected _layerBuffer: number[] = [-1, -1, -1, -1];
    protected _layerInfos: TerrainLayerInfo[] = [];

    constructor () {
        super();
        this.loaded = false;
    }

    get _nativeAsset (): ArrayBuffer {
        return this._data!.buffer;
    }

    set _nativeAsset (value: ArrayBuffer) {
        if (this._data && this._data.byteLength === value.byteLength) {
            this._data.set(new Uint8Array(value));
            if (legacyCC.loader._cache[this.nativeUrl]) {
                legacyCC.loader._cache[this.nativeUrl].content = this._data.buffer;
            }
        }
        else {
            this._data = new Uint8Array(value);
        }

        this._loadNativeData(this._data);
        this.loaded = true;
        this.emit('load');
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

    /**
     * @en get layer
     * @param xBlock block index x
     * @param yBlock block index y
     * @param layerId layer id
     * @zh 获得纹理索引
     * @param xBlock 地形块索引x
     * @param yBlock 地形块索引y
     * @param layerId 层Id
     */
    public getLayer (xBlock: number, yBlock: number, layerId: number) {
        const blockId = yBlock * this.blockCount[0] + xBlock;
        const index = blockId * 4 + layerId;

        if (xBlock < this.blockCount[0] && yBlock < this.blockCount[1] && index < this._layerBuffer.length) {
            return this._layerBuffer[index];
        }

        return -1;
    }

    public _setNativeData (_nativeData: Uint8Array) {
        this._data = _nativeData;
    }

    public _loadNativeData (_nativeData: Uint8Array) {
        const stream = new TerrainBuffer();
        stream.assign(_nativeData);

        // version
        const version = stream.readInt();
        if (version === TERRAIN_DATA_VERSION_DEFAULT) {
            return true;
        }
        if (version !== TERRAIN_DATA_VERSION &&
            version !== TERRAIN_DATA_VERSION2 &&
            version !== TERRAIN_DATA_VERSION3) {
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
        if (version >= TERRAIN_DATA_VERSION2) {
            const layerBufferSize = stream.readInt();
            this.layerBuffer = new Array<number>(layerBufferSize);
            for (let i = 0; i < this.layerBuffer.length; ++i) {
                this.layerBuffer[i] = stream.readInt16();
            }
        }

        // layer infos
        if (version >= TERRAIN_DATA_VERSION3) {
            const layerInfoSize = stream.readInt();
            this.layerInfos = new Array<TerrainLayerInfo>(layerInfoSize);
            for (let i = 0; i < this.layerInfos.length; ++i) {
                this.layerInfos[i] = new TerrainLayerInfo();
                this.layerInfos[i].slot = stream.readInt();
                this.layerInfos[i].tileSize = stream.readFloat();
                this.layerInfos[i].detailMap = stream.readString();

            }
        }

        return true;
    }

    public _exportNativeData (): Uint8Array {
        const stream = new TerrainBuffer();

        // version
        stream.writeInt32(TERRAIN_DATA_VERSION3);

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
        stream.writeInt32(this.layerInfos.length);
        for (let i = 0; i < this.layerInfos.length; ++i) {
            stream.writeInt32(this.layerInfos[i].slot);
            stream.writeFloat(this.layerInfos[i].tileSize);
            stream.writeString(this.layerInfos[i].detailMap);
        }

        return stream.buffer;
    }

    public _exportDefaultNativeData (): Uint8Array {
        const stream = new TerrainBuffer();
        stream.writeInt32(TERRAIN_DATA_VERSION_DEFAULT);
        return stream.buffer;

    }
 }
