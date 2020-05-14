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

export class TerrainBuffer {
    public Length: number = 0;
    public Buffer: Uint8Array = new Uint8Array(2048);
    private _dview: DataView = new DataView(this.Buffer.buffer);
    private _seekPos: number = 0;

    public Reserve (size: number) {
        if (this.Buffer.byteLength > size) {
            return;
        }

        let capacity = this.Buffer.byteLength;
        while (capacity < size) {
            capacity += capacity;
        }

        const temp = new Uint8Array(capacity);
        for (let i = 0; i < this.Length; ++i) {
            temp[i] = this.Buffer[i];
        }

        this.Buffer = temp;
        this._dview = new DataView(this.Buffer.buffer);
    }

    public Assign (buff: Uint8Array) {
        this.Buffer = buff;
        this.Length = buff.length;
        this._seekPos = buff.byteOffset;
        this._dview = new DataView(buff.buffer);
    }

    public WriteInt8 (value: number) {
        this.Reserve(this.Length + 1);

        this._dview.setInt8(this.Length, value);
        this.Length += 1;
    }

    public WriteInt16 (value: number) {
        this.Reserve(this.Length + 2);

        this._dview.setInt16(this.Length, value, true);
        this.Length += 2;
    }

    public WriteInt32 (value: number) {
        this.Reserve(this.Length + 4);

        this._dview.setInt32(this.Length, value, true);
        this.Length += 4;
    }

    public WriteIntArray (value: number[]) {
        this.Reserve(this.Length + 4 * value.length);

        for (let i = 0; i < value.length; ++i) {
            this._dview.setInt32(this.Length + i * 4, value[i], true);
        }
        this.Length += 4 * value.length;
    }

    public WriteFloat (value: number) {
        this.Reserve(this.Length + 4);

        this._dview.setFloat32(this.Length, value, true);
        this.Length += 4;
    }

    public WriteFloatArray (value: number[]) {
        this.Reserve(this.Length + 4 * value.length);

        for (let i = 0; i < value.length; ++i) {
            this._dview.setFloat32(this.Length + i * 4, value[i], true);
        }
        this.Length += 4 * value.length;
    }

    public WriteString (value: string) {
        this.Reserve(this.Length + value.length + 4);

        this._dview.setInt32(this.Length, value.length, true);
        for (let i = 0; i < value.length; ++i) {
            this._dview.setInt8(this.Length + 4 + i, value.charCodeAt(i));
        }
        this.Length += value.length + 4;
    }

    public ReadInt8 () {
        const value = this._dview.getInt8(this._seekPos);
        this._seekPos += 1;
        return value;
    }

    public ReadInt16 () {
        const value = this._dview.getInt16(this._seekPos, true);
        this._seekPos += 2;
        return value;
    }

    public ReadInt () {
        const value = this._dview.getInt32(this._seekPos, true);
        this._seekPos += 4;
        return value;
    }

    public ReadIntArray (value: number[]) {
        for (let i = 0; i < value.length; ++i) {
            value[i] = this._dview.getInt32(this._seekPos + i * 4, true);
        }
        this._seekPos += 4 * value.length;
        return value;
    }

    public ReadFloat () {
        const value = this._dview.getFloat32(this._seekPos, true);
        this._seekPos += 4;
        return value;
    }

    public ReadFloatArray (value: number[]) {
        for (let i = 0; i < value.length; ++i) {
            value[i] = this._dview.getFloat32(this._seekPos + i * 4, true);
        }
        this._seekPos += 4 * value.length;
        return value;
    }

    public ReadString () {
        const length = this.ReadInt();

        let value = '';
        for (let i = 0; i < length; ++i) {
            value += String.fromCharCode(this.ReadInt8());
        }

        return value;
    }
}

export class TerrainLayerInfo{
    public slot: number = 0;
    public tileSize: number = 1;
    public detailMap: string = '';
}

@ccclass('cc.TerrainAsset')
export class TerrainAsset extends Asset{
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

    set tileSize (value: number) {
        this._tileSize = value;
    }

    get tileSize () {
        return this._tileSize;
    }

    set blockCount (value: number[]) {
        this._blockCount = value;
    }

    get blockCount () {
        return this._blockCount;
    }

    set lightMapSize (value: number) {
        this._lightMapSize = value;
    }

    get lightMapSize () {
        return this._lightMapSize;
    }

    set weightMapSize (value: number) {
        this._weightMapSize = value;
    }

    get weightMapSize () {
        return this._weightMapSize;
    }

    set heights (value: Uint16Array) {
        this._heights = value;
    }

    get heights () {
        return this._heights;
    }

    set weights (value: Uint8Array) {
        this._weights = value;
    }

    get weights () {
        return this._weights;
    }

    set layerBuffer (value: number[]) {
        this._layerBuffer = value;
    }

    get layerBuffer () {
        return this._layerBuffer;
    }

    set layerInfos (value: TerrainLayerInfo[]) {
        this._layerInfos = value;
    }

    get layerInfos () {
        return this._layerInfos;
    }

    public getLayer (xblock: number, yblock: number, layerId: number) {
        const blockId = yblock * this.blockCount[0] + xblock;
        const index = blockId * 4 + layerId;

        if (xblock < this.blockCount[0] && yblock < this.blockCount[1] && index < this._layerBuffer.length) {
            return this._layerBuffer[index];
        }

        return -1;
    }

    public _setNativeData (_nativeData: Uint8Array) {
        this._data = _nativeData;
    }

    public _loadNativeData (_nativeData: Uint8Array) {
        const stream = new TerrainBuffer();
        stream.Assign(_nativeData);

        // version
        const version = stream.ReadInt();
        if (version === TERRAIN_DATA_VERSION_DEFAULT) {
            return true;
        }
        if (version !== TERRAIN_DATA_VERSION &&
            version !== TERRAIN_DATA_VERSION2 &&
            version !== TERRAIN_DATA_VERSION3) {
            return false;
        }

        // geometry info
        this.tileSize = stream.ReadFloat();
        stream.ReadIntArray(this._blockCount);
        this.weightMapSize = stream.ReadInt16();
        this.lightMapSize = stream.ReadInt16();

        // heights
        const heightBufferSize = stream.ReadInt();
        this.heights = new Uint16Array(heightBufferSize);
        for (let i = 0; i < this.heights.length; ++i) {
            this.heights[i] = stream.ReadInt16();
        }

        // weights
        const WeightBufferSize = stream.ReadInt();
        this.weights = new Uint8Array(WeightBufferSize);
        for (let i = 0; i < this.weights.length; ++i) {
            this.weights[i] = stream.ReadInt8();
        }

        // layer buffer
        if (version >= TERRAIN_DATA_VERSION2) {
            const layerBufferSize = stream.ReadInt();
            this.layerBuffer = new Array<number>(layerBufferSize);
            for (let i = 0; i < this.layerBuffer.length; ++i) {
                this.layerBuffer[i] = stream.ReadInt16();
            }
        }

        // layer infos
        if (version >= TERRAIN_DATA_VERSION3) {
            const layerInfoSize = stream.ReadInt();
            this.layerInfos = new Array<TerrainLayerInfo>(layerInfoSize);
            for (let i = 0; i < this.layerInfos.length; ++i) {
                this.layerInfos[i] = new TerrainLayerInfo();
                this.layerInfos[i].slot = stream.ReadInt();
                this.layerInfos[i].tileSize = stream.ReadFloat();
                this.layerInfos[i].detailMap = stream.ReadString();

            }
        }

        return true;
    }

    public _exportNativeData (): Uint8Array {
        const stream = new TerrainBuffer();

        // version
        stream.WriteInt32(TERRAIN_DATA_VERSION3);

        // geometry info
        stream.WriteFloat(this.tileSize);
        stream.WriteIntArray(this._blockCount);
        stream.WriteInt16(this.weightMapSize);
        stream.WriteInt16(this.lightMapSize);

         // heights
        stream.WriteInt32(this.heights.length);
        for (let i = 0; i < this.heights.length; ++i) {
            stream.WriteInt16(this.heights[i]);
        }

        // weights
        stream.WriteInt32(this.weights.length);
        for (let i = 0; i < this.weights.length; ++i) {
            stream.WriteInt8(this.weights[i]);
        }

        // layer buffer
        stream.WriteInt32(this.layerBuffer.length);
        for (let i = 0; i < this.layerBuffer.length; ++i) {
            stream.WriteInt16(this.layerBuffer[i]);
        }

        // layer infos
        stream.WriteInt32(this.layerInfos.length);
        for (let i = 0; i < this.layerInfos.length; ++i) {
            stream.WriteInt32(this.layerInfos[i].slot);
            stream.WriteFloat(this.layerInfos[i].tileSize);
            stream.WriteString(this.layerInfos[i].detailMap);
        }

        return stream.Buffer;
    }

    public _exportDefaultNativeData (): Uint8Array {
        const stream = new TerrainBuffer();

        stream.WriteInt32(TERRAIN_DATA_VERSION_DEFAULT);

        return stream.Buffer;

    }
 }
