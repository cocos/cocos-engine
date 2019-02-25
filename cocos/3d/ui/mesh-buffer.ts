// import gfx from '../gfx/index';
// import VertexFormat from '../gfx/vertex-format';
// import { UI } from './ui';
// import { GFXDevice } from '../../gfx/device';
// import { GFXBuffer } from '../../gfx/buffer';
import { GFXFormat, GFXPrimitiveMode } from '../../gfx/define';
import { IGFXInputAttribute } from '../../gfx/input-assembler';
// import UISystem from '../UISystem';

export interface IMeshBufferInitData {
    vertexCount: number;
    indiceCount: number;
    attributes: IGFXInputAttribute[];
}

export class MeshBuffer {
    public byteStart: number = 0;
    public byteOffset: number = 0;
    public indiceStart: number = 0;
    public indiceOffset: number = 0;
    public vertexStart: number = 0;
    public vertexOffset: number = 0;
    // public _vb: GFXBuffer | null = null;
    // public _ib: GFXBuffer | null = null;
    public vData: Float32Array | null = null;
    public iData: Uint16Array | null = null;
    // public uintVData: Uint32Array | null = null;
    public primitiveMode: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;

    private _vertexBytes: number = 0;
    private _vertexFormat: IGFXInputAttribute[] = [];
    // private _renderer: UI|null = null;

    private _initVDataCount: number = 0; // actually 256 * 4 * (vertexFormat._bytes / 4)
    private _initIDataCount: number = 0;
    private _dirty: boolean = false;

    constructor (/*device: GFXDevice*/) {

        // const device = cc.game._renderContext;
        // this._vertexFormat = vertexFormat;

        // TODO: calculate
        // this._vertexBytes = this.calculateBytes(vertexFormat)/*this._vertexFormat._bytes*/;
        // this._vb = new gfx.VertexBuffer(
        //     device,
        //     vertexFormat,
        //     gfx.USAGE_DYNAMIC,
        //     new ArrayBuffer(0),
        //     0,
        // );
        // this._vb = device.createBuffer({
        //     usage: GFXBufferUsageBit.VERTEX,
        //     memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
        //     size: 0,
        //     stride: 0,
        // });
        // this._ib = new gfx.IndexBuffer(
        //     device,
        //     gfx.INDEX_FMT_UINT16,
        //     gfx.USAGE_STATIC,
        //     new ArrayBuffer(0),
        //     0,
        // );

        // this._ib = device.createBuffer({
        //     usage: GFXBufferUsageBit.INDEX,
        //     memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
        //     size: 0,
        //     stride: 2,
        // });
        // this._renderer = renderer;
        // this._initVDataCount = 256 * this._vertexBytes;
        // this._reallocBuffer();
    }

    public initialize (data: IMeshBufferInitData) {
        this._vertexFormat = data.attributes;
        // this._vertexBytes = this.calculateBytes(this._vertexFormat);
        this._initVDataCount = data.vertexCount * this._calculateFormatNum(this._vertexFormat);
        this._initIDataCount = data.indiceCount;
        this.primitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
        this.byteOffset = 0;
        this.byteStart = 0;
        this.indiceStart = 0;
        this.indiceOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;
        this._reallocBuffer();
    }

    public uploadData () {
        if (this.byteOffset === 0 || !this._dirty) {
            return;
        }

        // update vertext data
        // const vertexsData = new Float32Array(this.vData!.buffer, 0, this.byteOffset >> 2);
        // const indicesData = new Uint16Array(this.iData!.buffer, 0, this.indiceOffset);

        // const vb = this._vb;
        // vb.update(0, vertexsData);

        // const ib = this._ib;
        // ib.update(0, indicesData);

        this._dirty = false;
    }

    public requestStatic (vertexCount, indiceCount) {
        const byteOffset = this.byteOffset + vertexCount * this._vertexBytes;
        const indiceOffset = this.indiceOffset + indiceCount;

        let byteLength = this.vData!.byteLength;
        let indiceLength = this.iData!.length;
        if (byteOffset > byteLength || indiceOffset > indiceLength) {
            while (byteLength < byteOffset || indiceLength < indiceOffset) {
                this._initVDataCount *= 2;
                this._initIDataCount *= 2;

                byteLength = this._initVDataCount * 4;
                indiceLength = this._initIDataCount;
            }

            this._reallocBuffer();
        }

        this.vertexOffset += vertexCount;
        this.indiceOffset += indiceCount;

        this.byteOffset = byteOffset;

        this._dirty = true;
    }

    public request (vertexCount, indiceCount) {
        // There used to be two buffer, quad and mesh, now together.
        // if (this._renderer!.buffer !== this) {
        //     this._renderer!.flush();
        //     this._renderer!.buffer = this;
        // }

        this.requestStatic(vertexCount, indiceCount);
    }

    public _reallocBuffer () {
        this._reallocVData(true);
        this._reallocIData(true);
    }

    public _reallocVData (copyOldData) {
        // let oldVData;
        // if (this.vData) {
        //     if (this._initVDataCount * 4 > this.vData.byteLength){
        //         oldVData = new Uint8Array(this.vData.buffer);
        //     }
        // }

        if (this.vData && this.vData.length === this._initVDataCount) {
            return;
        }

        this.vData = new Float32Array(this._initVDataCount);
        // this.uintVData = new Uint32Array(this.vData.buffer);
        // const newData = new Uint8Array(this.vData.buffer);

        // if (oldVData && copyOldData) {
        //     for (let i = 0, l = oldVData.length; i < l; i++) {
        //         newData[i] = oldVData[i];
        //     }
        // }

        // this._vb._bytes = this.vData.byteLength;
    }

    public _reallocIData (copyOldData) {
        // const oldIData = this.iData;

        if (this.iData && this.iData.length === this._initIDataCount) {
            return;
        }

        this.iData = new Uint16Array(this._initIDataCount);

        // if (oldIData && copyOldData) {
        //     const iData = this.iData;
        //     for (let i = 0, l = oldIData.length; i < l; i++) {
        //         iData[i] = oldIData[i];
        //     }
        // }

        // this._ib._bytes = this.iData.byteLength;
    }

    public reset () {
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indiceStart = 0;
        this.indiceOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;
        this._dirty = false;
    }

    public destroy () {
        // this._ib.destroy();
        // this._vb.destroy();
    }

    private _calculateFormatNum (vertexFormat: IGFXInputAttribute[]) {
        // let bytes = 0;
        let num = 0;
        for (const attr of vertexFormat) {
            const name = GFXFormat[attr.format].toString();
            if (name.startsWith('RGBA')) {
                num += 4;
            } else if (name.startsWith('RGB')) {
                num += 3;
            } else if (name.startsWith('RG')) {
                num += 2;
            } else {
                num += 1;
            }

            // name = name.substring(num);
            // switch (name) {
            //     case '8I':
            //     case '8UI':
            //         bytes += num * 1;
            //         break;
            //     case '16I':
            //     case '16UI':
            //         bytes += num * 2;
            //         break;
            //     case '32I':
            //     case '32UI':
            //     case '32F':
            //         bytes += num * 4;
            //         break;
            // }
        }

        return num;
    }
}
cc.MeshBuffer = MeshBuffer;
