import { GFXBuffer, GFXBufferSource, IGFXDrawInfo } from './buffer';
import { GFXFormat, GFXFormatInfos, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';

export interface IGFXInputAttribute {
    binding?: number;
    name: string;
    format: GFXFormat;
    isNormalized?: boolean;
    stream?: number;
    isInstanced?: boolean;
}

export interface IGFXInputAssemblerInfo {
    attributes: IGFXInputAttribute[];
    vertexBuffers: GFXBuffer[];
    indexBuffer?: GFXBuffer;
    indirectBuffer?: GFXBuffer;
}

const isLittleEndian = cc.sys.isLittleEndian;

export abstract class GFXInputAssembler extends GFXObject {

    public get vertexBuffers (): GFXBuffer[] {
        return this._vertexBuffers;
    }

    public get indexBuffer (): GFXBuffer | null {
        return this._indexBuffer;
    }

    public get attributes (): IGFXInputAttribute[] {
        return this._attributes;
    }

    public get vertexCount (): number {
        return this._vertexCount;
    }

    public set vertexCount (count: number) {
        this._vertexCount = count;
    }

    public get firstVertex (): number {
        return this._firstVertex;
    }

    public set firstVertex (first: number) {
        this._firstVertex = first;
    }

    public get indexCount (): number {
        return this._indexCount;
    }

    public set indexCount (count: number) {
        this._indexCount = count;
    }

    public get firstIndex (): number {
        return this._firstIndex;
    }

    public set firstIndex (first: number) {
        this._firstIndex = first;
    }

    public get vertexOffset (): number {
        return this._vertexOffset;
    }

    public set vertexOffset (offset: number) {
        this._vertexOffset = offset;
    }

    public get instanceCount (): number {
        return this._instanceCount;
    }

    public set instanceCount (count: number) {
        this._instanceCount = count;
    }

    public get firstInstance (): number {
        return this._firstInstance;
    }

    public set firstInstance (first: number) {
        this._firstInstance = first;
    }

    public get isIndirect (): boolean {
        return this._isIndirect;
    }

    public get indirectBuffer (): GFXBuffer | null {
        return this._indirectBuffer;
    }

    protected _device: GFXDevice;
    protected _attributes: IGFXInputAttribute[] = [];
    protected _vertexBuffers: GFXBuffer[] = [];
    protected _indexBuffer: GFXBuffer | null = null;
    protected _vertexCount: number = 0;
    protected _firstVertex: number = 0;
    protected _indexCount: number = 0;
    protected _firstIndex: number = 0;
    protected _vertexOffset: number = 0;
    protected _instanceCount: number = 0;
    protected _firstInstance: number = 0;
    protected _isIndirect: boolean = false;
    protected _indirectBuffer: GFXBuffer | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.INPUT_ASSEMBLER);
        this._device = device;
    }

    public abstract initialize (info: IGFXInputAssemblerInfo): boolean;
    public abstract destroy (): void;

    public getVertexBuffer (stream: number = 0): GFXBuffer | null {
        if (stream < this._vertexBuffers.length) {
            return this._vertexBuffers[stream];
        } else {
            return null;
        }
    }

    public extractDrawInfo (drawInfo: IGFXDrawInfo) {
        drawInfo.vertexCount = this._vertexCount;
        drawInfo.firstVertex = this._firstVertex;
        drawInfo.indexCount = this._indexCount;
        drawInfo.firstIndex = this._firstIndex;
        drawInfo.vertexOffset = this._vertexOffset;
        drawInfo.instanceCount = this._instanceCount;
        drawInfo.firstInstance = this._firstInstance;
    }

    public updateVertexAttr (vbuffer: GFXBufferSource, attr: string, data: number[]) {
        let offset = 0;
        let count = 0;
        let size = 0;
        let fn = '';
        for (const a of this._attributes) {
            const info = GFXFormatInfos[a.format];
            if (a.name === attr) {
                count = info.count;
                size = info.size / count;
                fn = `set${info.isFloating ? 'Float' : 'Int'}${size * 8}`;
                break;
            }
            offset += info.size;
        }
        const vb = this._vertexBuffers[0];
        if (!count || !vb) { return; }
        const stride = vb.stride;
        const view = new DataView(vbuffer as ArrayBuffer);
        const len = data.length;
        for (let idx = 0, beg = offset; idx < len; idx += count, beg += stride) {
            for (let j = 0; j < count; j++) {
                view[fn](beg + j * size, data[idx + j], isLittleEndian);
            }
        }
        vb.update(vbuffer);
    }

    public updateIndexBuffer (ibuffer: GFXBufferSource, data: number[]) {
        const count = this._indexCount;
        const ib = this._indexBuffer;
        if (!count || !ib) { return; }
        let size = 0;
        let fn = `setInt${size * 8}`;
        const stride = ib.stride;
        const view = new DataView(ibuffer as ArrayBuffer);
        const len = data.length;
        for (let idx = 0, beg = 0; idx < len; idx += count, beg += stride) {
            for (let j = 0; j < count; j++) {
                view[fn](beg + j * size, data[idx + j], isLittleEndian);
            }
        }
        ib.update(ibuffer);
    }
}
