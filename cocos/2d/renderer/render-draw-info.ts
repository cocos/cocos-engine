import { JSB } from 'internal:constants';
import { BaseRenderData, IRenderData } from './render-data';
import { Stage } from './stencil-manager';
import { NativeRenderDrawInfo } from './native-2d';
import { NULL_HANDLE, Render2dHandle, Render2dPool } from '../../core/renderer';
import { Material, Node } from '../../core';
import { Sampler, Texture } from '../../core/gfx';
import { Batcher2D } from './batcher-2d';
import IDGenerator from '../../core/utils/id-generator';
import { Model } from '../../core/renderer/scene';

export enum RenderDrawInfoSharedBufferView {
    enabled,
    count,
}

export class RenderDrawInfo {
    public stencilStage: Stage = Stage.DISABLED;

    // protected _enabled = true;
    // get enabled () {
    //     return this._enabled;
    // }
    // set enabled (val: boolean) {
    //     this._enabled = val;
    //     if (JSB) {
    //         this._sharedBuffer[RenderDrawInfoSharedBufferView.enabled] = val ? 1 : 0;
    //     }
    // }

    protected _batcher: Batcher2D | undefined;
    protected _accId: number | undefined;
    protected _bufferId: number | undefined;
    protected _vertexOffset: number | undefined;
    protected _indexOffset: number | undefined;
    protected _vb: Float32Array | undefined;
    protected _ib: Uint16Array | undefined;
    protected _vData: Float32Array | undefined;
    protected _iData: Uint16Array | undefined;
    protected _vertDirty: boolean | undefined;
    protected _vbCount: number | undefined;
    protected _ibCount: number | undefined;
    protected _dataHash: number | undefined;
    protected _isMeshBuffer: boolean | undefined;
    protected _material: Material | undefined;
    protected _texture: Texture | null = null;
    protected _textureHash: number | undefined;
    protected _sampler: Sampler | null = null;
    protected _blendHash: number | undefined;

    protected _model: Model | undefined;

    protected declare _nativeObj: NativeRenderDrawInfo;

    // SharedBuffer of pos/uv/color
    protected declare _render2dBuffer: Float32Array;

    // SharedBuffer of extra attributes
    protected declare _sharedBuffer: Int32Array;

    protected _vertexCount = 0;
    protected _stride = 0;

    constructor (batcher: Batcher2D, nativeDrawInfo?: NativeRenderDrawInfo) {
        this.init(batcher, nativeDrawInfo);
    }

    get nativeObj () {
        return this._nativeObj;
    }
    // set nativeObj (val:NativeRenderDrawInfo) {
    //     this._nativeObj = val;
    // }

    get render2dBuffer () {
        return this._render2dBuffer;
    }

    private init (batcher: Batcher2D, nativeDrawInfo?: NativeRenderDrawInfo) {
        if (JSB) {
            this._batcher = batcher;
            if (nativeDrawInfo) {
                this._nativeObj = nativeDrawInfo;
            }
            if (!this._nativeObj) {
                this._nativeObj = new NativeRenderDrawInfo(batcher.nativeObj);
            }
        }

        this.initSharedBuffer();
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
            this._nativeObj.accId = accId;
        }
    }

    public setBufferId (bufferId) {
        this._bufferId = bufferId;
        if (JSB) {
            this._nativeObj.bufferId = bufferId;
        }
    }

    public setVertexOffset (vertexOffset) {
        this._vertexOffset = vertexOffset;
        if (JSB) {
            this._nativeObj.vertexOffset = vertexOffset;
        }
    }

    public setIndexOffset (indexOffset) {
        this._indexOffset = indexOffset;
        if (JSB) {
            this._nativeObj.indexOffset = indexOffset;
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
            this._nativeObj.vbCount = vbCount;
        }
    }

    public setIBCount (ibCount) {
        if (JSB) {
            this._nativeObj.ibCount = ibCount;
        }
    }

    public setVertDirty (val: boolean) {
        if (JSB) {
            this._nativeObj.vertDirty = val;
        }
        this._vertDirty = val;
    }

    public setDataHash (dataHash: number) {
        if (JSB) {
            if (this._dataHash !== dataHash) {
                this._nativeObj.dataHash = dataHash;
            }
        }
        this._dataHash = dataHash;
    }

    public setIsMeshBuffer (isMeshBuffer: boolean) {
        if (JSB) {
            if (this._isMeshBuffer !== isMeshBuffer) {
                this._nativeObj.isMeshBuffer = isMeshBuffer;
            }
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
            if (this._textureHash !== textureHash) {
                this._nativeObj.textureHash = textureHash;
            }
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

    public setBlendHash (blendHash: number) {
        if (JSB) {
            if (this._blendHash !== blendHash) {
                this._nativeObj.blendHash = blendHash;
            }
        }
        this._blendHash = blendHash;
    }

    public setModel (model: Model) {
        if (JSB) {
            if (this._model !== model) {
                this._nativeObj.model = model;
            }
        }
    }

    public initRender2dBuffer (vertexCount: number, stride: number) {
        if (JSB) {
            this._stride = stride;
            this._vertexCount = vertexCount;
            this._render2dBuffer = new Float32Array(vertexCount * stride);
        }
    }

    public fillRender2dBuffer (vertexDataArr: IRenderData[]) {
        if (JSB) {
            const fillLength = Math.min(this._vertexCount, vertexDataArr.length);
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

    public setRender2dBufferToNative () {
        if (JSB) {
            this._nativeObj.setRender2dBufferToNative(this._render2dBuffer, this._stride, this._vertexCount * this._stride);
        }
    }

    private initSharedBuffer () {
        if (JSB) {
            //this._sharedBuffer = new Int32Array(RenderDrawInfoSharedBufferView.count);
            this._sharedBuffer = new Int32Array(this._nativeObj.getAttrSharedBufferForJS());
        }
    }
}
