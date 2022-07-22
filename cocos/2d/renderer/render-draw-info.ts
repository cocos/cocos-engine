import { JSB } from 'internal:constants';
import { BaseRenderData, IRenderData } from './render-data';
import { Stage } from './stencil-manager';
import { NativeRenderDrawInfo } from './native-2d';
import { director, Material, Node } from '../../core';
import { Sampler, Texture } from '../../core/gfx';
import { Model } from '../../core/renderer/scene';

export enum AttrUInt8ArrayView {
    DrawInfoType,
    VertDirty,
    IsMeshBuffer,
    Stride,
    Count
}

export enum AttrUInt16ArrayView {
    BufferID,
    AccessorID,
    Count
}

export enum AttrUInt32ArrayView {
    VertexOffset,
    IndexOffset,
    VBCount,
    IBCount,
    TextureHash,
    DataHash,
    Count
}

export enum RenderDrawInfoType {
    COMP,
    MODEL,
    IA,
}

export class RenderDrawInfo {
    protected _accId = -1;
    protected _bufferId = -1;
    protected _vertexOffset = 0;
    protected _indexOffset = 0;
    protected _vb: Float32Array | null = null;
    protected _ib: Uint16Array | null = null;
    protected _vData: Float32Array | null = null;
    protected _iData: Uint16Array | null = null;
    protected _vertDirty = false;
    protected _vbCount = 0;
    protected _ibCount = 0;
    protected _dataHash = 0;
    protected _isMeshBuffer = false;
    protected _textureHash = 0;
    protected _material: Material | null = null;
    protected _texture: Texture | null = null;
    protected _sampler: Sampler | null = null;
    protected _stride = 0;
    protected _useLocal = false;

    protected _model: Model | null = null;
    protected _drawInfoType :RenderDrawInfoType = RenderDrawInfoType.COMP;
    protected _subNode: Node | null = null;

    protected declare _nativeObj: NativeRenderDrawInfo;
    protected _uint8SharedBuffer: Uint8Array;
    protected _uint16SharedBuffer: Uint16Array;
    protected _uint32SharedBuffer: Uint32Array;

    // SharedBuffer of pos/uv/color
    protected declare _render2dBuffer: Float32Array;

    constructor (nativeDrawInfo?: NativeRenderDrawInfo) {
        this.init(nativeDrawInfo);
        const attrSharedBuffer = this._nativeObj.getAttrSharedBufferForJS();
        let offset = 0;
        this._uint8SharedBuffer = new Uint8Array(attrSharedBuffer, offset, AttrUInt8ArrayView.Count);
        offset += AttrUInt8ArrayView.Count * Uint8Array.BYTES_PER_ELEMENT;
        this._uint16SharedBuffer = new Uint16Array(attrSharedBuffer, offset, AttrUInt16ArrayView.Count);
        offset += AttrUInt16ArrayView.Count * Uint16Array.BYTES_PER_ELEMENT;
        this._uint32SharedBuffer = new Uint32Array(attrSharedBuffer, offset, AttrUInt32ArrayView.Count);
    }

    get nativeObj () {
        return this._nativeObj;
    }

    get render2dBuffer () {
        return this._render2dBuffer;
    }

    private init (nativeDrawInfo?: NativeRenderDrawInfo) {
        if (JSB) {
            if (nativeDrawInfo) {
                this._nativeObj = nativeDrawInfo;
            }
            if (!this._nativeObj) {
                this._nativeObj = new NativeRenderDrawInfo();
            }
        }
    }

    public clear () {
        this._bufferId = 0;
        this._vertexOffset = 0;
        this._indexOffset = 0;
        this._vertDirty = false;
    }

    public setAccId (accId) {
        this._accId = accId;
        if (JSB) {
            this._uint16SharedBuffer[AttrUInt16ArrayView.AccessorID] = accId;
        }
    }

    public setBufferId (bufferId) {
        if (JSB) {
            if (this._bufferId !== bufferId) {
                this._uint16SharedBuffer[AttrUInt16ArrayView.BufferID] = bufferId;
                this._nativeObj.changeMeshBuffer();
            }
        }
        this._bufferId = bufferId;
    }

    public setVertexOffset (vertexOffset) {
        this._vertexOffset = vertexOffset;
        if (JSB) {
            this._uint32SharedBuffer[AttrUInt32ArrayView.VertexOffset] = vertexOffset;
        }
    }

    public setIndexOffset (indexOffset) {
        this._indexOffset = indexOffset;
        if (JSB) {
            this._uint32SharedBuffer[AttrUInt32ArrayView.IndexOffset] = indexOffset;
        }
    }

    public setVB (vbBuffer: Float32Array) {
        if (JSB) {
            this._nativeObj.vbBuffer = vbBuffer;
        }
    }

    public setIB (ibBuffer: Uint16Array) {
        if (JSB) {
            this._nativeObj.ibBuffer = ibBuffer;
        }
    }

    public setVData (vDataBuffer: ArrayBufferLike) {
        if (JSB) {
            this._nativeObj.vDataBuffer = vDataBuffer;
        }
    }

    public setIData (iDataBuffer: ArrayBufferLike) {
        if (JSB) {
            this._nativeObj.iDataBuffer = iDataBuffer;
        }
    }

    public setVBCount (vbCount) {
        if (JSB) {
            this._uint32SharedBuffer[AttrUInt32ArrayView.VBCount] = vbCount;
        }
        this._vbCount = vbCount;
    }

    public setIBCount (ibCount) {
        if (JSB) {
            this._uint32SharedBuffer[AttrUInt32ArrayView.IBCount] = ibCount;
        }
    }

    public setVertDirty (val: boolean) {
        if (JSB) {
            this._uint8SharedBuffer[AttrUInt8ArrayView.VertDirty] = val ? 1 : 0;
        }
        this._vertDirty = val;
    }

    public setDataHash (dataHash: number) {
        if (JSB) {
            this._uint32SharedBuffer[AttrUInt32ArrayView.DataHash] = dataHash;
        }
        this._dataHash = dataHash;
    }

    public setIsMeshBuffer (isMeshBuffer: boolean) {
        if (JSB) {
            this._uint8SharedBuffer[AttrUInt8ArrayView.IsMeshBuffer] = isMeshBuffer ? 1 : 0;
        }
        this._isMeshBuffer = isMeshBuffer;
    }

    public setMaterial (material: Material) {
        if (JSB) {
            if (this._material !== material) {
                this._nativeObj.material = material;
            }
        }
        this._material = material;
    }

    public setTexture (texture: Texture | null) {
        if (JSB) {
            if (this._texture !== texture) {
                this._nativeObj.texture = texture;
            }
        }
        this._texture = texture;
    }

    public setTextureHash (textureHash: number) {
        if (JSB) {
            this._uint32SharedBuffer[AttrUInt32ArrayView.TextureHash] = textureHash;
        }
        this._textureHash = textureHash;
    }

    public setSampler (sampler: Sampler | null) {
        if (JSB) {
            if (this._sampler !== sampler) {
                this._nativeObj.sampler = sampler;
            }
        }
        this._sampler = sampler;
    }

    public setModel (model: Model) {
        if (JSB) {
            if (this._model !== model) {
                this._nativeObj.model = model;
            }
        }
    }

    public setDrawInfoType (drawInfoType: RenderDrawInfoType) {
        if (JSB) {
            if (this._drawInfoType !== drawInfoType) {
                this._uint8SharedBuffer[AttrUInt8ArrayView.DrawInfoType] = drawInfoType;
            }
        }
        this._drawInfoType = drawInfoType;
    }

    public setSubNode (node : Node) {
        if (JSB) {
            if (this._subNode !== node) {
                this._nativeObj.subNode = node;
            }
        }
        this._subNode = node;
    }

    public setStride (stride: number) {
        if (JSB) {
            this._uint8SharedBuffer[AttrUInt8ArrayView.Stride] = stride;
        }
        this._stride = stride;
    }

    public initRender2dBuffer () {
        if (JSB) {
            this._render2dBuffer = new Float32Array(this._vbCount * this._stride);
            this._nativeObj.setRender2dBufferToNative(this._render2dBuffer);
        }
    }

    public fillRender2dBuffer (vertexDataArr: IRenderData[]) {
        if (JSB) {
            const fillLength = Math.min(this._vbCount, vertexDataArr.length);
            let bufferOffset = 0;
            for (let i = 0; i < fillLength; i++) {
                this.updateVertexBuffer(bufferOffset, vertexDataArr[i]);
                bufferOffset += this._stride;
            }
        }
    }

    public updateVertexBuffer (bufferOffset: number, vertexData: IRenderData) {
        if (JSB) {
            if (bufferOffset >= this.render2dBuffer.length) {
                return;
            }
            const temp: IRenderData = vertexData;
            this._render2dBuffer[bufferOffset++] = temp.x;
            this._render2dBuffer[bufferOffset++] = temp.y;
            this._render2dBuffer[bufferOffset++] = temp.z;
            this._render2dBuffer[bufferOffset++] = temp.u;
            this._render2dBuffer[bufferOffset++] = temp.v;
            this._render2dBuffer[bufferOffset++] = temp.color.r;
            this._render2dBuffer[bufferOffset++] = temp.color.g;
            this._render2dBuffer[bufferOffset++] = temp.color.b;
            this._render2dBuffer[bufferOffset++] = temp.color.a;
        }
    }
}
