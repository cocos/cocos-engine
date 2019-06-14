import { writeBuffer } from '../3d/misc/utils';
import { GFXBuffer, GFXBufferSource, IGFXDrawInfo } from './buffer';
import { GFXFormat, GFXFormatInfos, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';

/**
 * @zh
 * GFX顶点属性。
 */
export interface IGFXAttribute {
    name: string;
    format: GFXFormat;
    isNormalized?: boolean;
    stream?: number;
    isInstanced?: boolean;
}

/**
 * @zh
 * GFX输入汇集器描述信息。
 */
export interface IGFXInputAssemblerInfo {
    attributes: IGFXAttribute[];
    vertexBuffers: GFXBuffer[];
    indexBuffer?: GFXBuffer;
    indirectBuffer?: GFXBuffer;
}

/**
 * @zh
 * GFX输入汇集器。
 */
export abstract class GFXInputAssembler extends GFXObject {

    /**
     * @zh
     * 顶点缓冲数组。
     */
    public get vertexBuffers (): GFXBuffer[] {
        return this._vertexBuffers;
    }

    /**
     * @zh
     * 索引缓冲。
     */
    public get indexBuffer (): GFXBuffer | null {
        return this._indexBuffer;
    }

    /**
     * @zh
     * 顶点属性数组。
     */
    public get attributes (): IGFXAttribute[] {
        return this._attributes;
    }

    /**
     * @zh
     * 顶点数量。
     */
    public get vertexCount (): number {
        return this._vertexCount;
    }

    public set vertexCount (count: number) {
        this._vertexCount = count;
    }

    /**
     * @zh
     * 起始顶点。
     */
    public get firstVertex (): number {
        return this._firstVertex;
    }

    public set firstVertex (first: number) {
        this._firstVertex = first;
    }

    /**
     * @zh
     * 索引数量。
     */
    public get indexCount (): number {
        return this._indexCount;
    }

    public set indexCount (count: number) {
        this._indexCount = count;
    }

    /**
     * @zh
     * 起始索引。
     */
    public get firstIndex (): number {
        return this._firstIndex;
    }

    public set firstIndex (first: number) {
        this._firstIndex = first;
    }

    /**
     * @zh
     * 顶点偏移量。
     */
    public get vertexOffset (): number {
        return this._vertexOffset;
    }

    public set vertexOffset (offset: number) {
        this._vertexOffset = offset;
    }

    /**
     * @zh
     * 实例数量。
     */
    public get instanceCount (): number {
        return this._instanceCount;
    }

    public set instanceCount (count: number) {
        this._instanceCount = count;
    }

    /**
     * @zh
     * 起始实例。
     */
    public get firstInstance (): number {
        return this._firstInstance;
    }

    public set firstInstance (first: number) {
        this._firstInstance = first;
    }

    /**
     * @zh
     * 是否间接绘制。
     */
    public get isIndirect (): boolean {
        return this._isIndirect;
    }

    /**
     * @zh
     * 间接绘制缓冲。
     */
    public get indirectBuffer (): GFXBuffer | null {
        return this._indirectBuffer;
    }

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    protected _attributes: IGFXAttribute[] = [];

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

    /**
     * @zh
     * 构造函数。
     * @param device GFX设备。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.INPUT_ASSEMBLER);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info GFX汇集器描述信息。
     */
    public abstract initialize (info: IGFXInputAssemblerInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy (): void;

    /**
     * @zh
     * 得到顶点缓冲。
     * @param stream 顶点流索引。
     */
    public getVertexBuffer (stream: number = 0): GFXBuffer | null {
        if (stream < this._vertexBuffers.length) {
            return this._vertexBuffers[stream];
        } else {
            return null;
        }
    }

    /**
     * @zh
     * 提取绘制信息。
     * @param drawInfo 绘制信息。
     */
    public extractDrawInfo (drawInfo: IGFXDrawInfo) {
        drawInfo.vertexCount = this._vertexCount;
        drawInfo.firstVertex = this._firstVertex;
        drawInfo.indexCount = this._indexCount;
        drawInfo.firstIndex = this._firstIndex;
        drawInfo.vertexOffset = this._vertexOffset;
        drawInfo.instanceCount = this._instanceCount;
        drawInfo.firstInstance = this._firstInstance;
    }

    /**
     * @en
     * update VB data on the fly.
     * @param vbuffer - an ArrayBuffer containing the full VB
     * @param attr - name of the attribute to update (default names are specified in GFXAttributeName)
     * @param data - the new VB attribute data to be uploaded
     * @example
     * ```typescript
     * // get VB array buffer from mesh, better to cache this somewhere convenient
     * const vbInfo = mesh.struct.vertexBundles[0].data;
     * const vbuffer = mesh.data.buffer.slice(vbInfo.offset, vbInfo.offset + vbInfo.length);
     * const submodel = someModelComponent.model.getSubModel(0);
     * // say the new positions is stored in 'data' as a plain array
     * submodel.inputAssembler.updateVertexBuffer(vbuffer, cc.GFXAttributeName.ATTR_POSITION, data);
     * ```
     * @zh
     * 根据顶点属性名称更新顶点缓冲数据。
     * @param vbuffer 缓冲数据源。
     * @param attr 属性名。
     * @param data 更新数据。
     */
    public updateVertexAttr (vbuffer: GFXBufferSource, attr: string, data: number[]) {
        let offset = 0;
        let format = GFXFormat.UNKNOWN;
        for (const a of this._attributes) {
            if (a.name === attr) { format = a.format; break; }
            offset += GFXFormatInfos[a.format].size;
        }
        const vb = this._vertexBuffers[0];
        if (!format || !vb) { return; }
        writeBuffer(new DataView(vbuffer as ArrayBuffer), data, format, offset, vb.stride);
        vb.update(vbuffer);
    }

    /**
     * @en
     * update IB data on the fly.
     * need to call submodel.updateCommandBuffer after this if index count changed
     * @example
     * ```typescript
     * // get IB array buffer from mesh, better to cache this somewhere convenient
     * const ibInfo = mesh.struct.primitives[0].indices.range;
     * const ibuffer = mesh.data.buffer.slice(ibInfo.offset, ibInfo.offset + ibInfo.length);
     * const submodel = someModelComponent.model.getSubModel(0);
     * submodel.inputAssembler.updateIndexBuffer(ibuffer, [0, 1, 2]);
     * submodel.updateCommandBuffer(); // index count changed
     * ```
     * @zh
     * 更新索引缓冲数据。
     * @param ibuffer 缓冲数据源。
     * @param data 更新数据。
     */
    public updateIndexBuffer (ibuffer: GFXBufferSource, data: number[]) {
        const count = this._indexCount;
        const ib = this._indexBuffer;
        if (!count || !ib) { return; }
        writeBuffer(new DataView(ibuffer as ArrayBuffer), data, GFXFormat[`R${ib.stride * 8}UI`]);
        ib.update(ibuffer);
        this._indexCount = data.length;
    }
}
