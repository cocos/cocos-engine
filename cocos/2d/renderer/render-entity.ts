import { BaseRenderData, IRenderData } from './render-data';
import { Stage } from './stencil-manager';
import { JSB } from '../../core/default-constants';
import { NativeAdvanceRenderData, NativeRenderEntity } from '../../core/renderer/2d/native-2d';
import { AdvanceRenderData } from './AdvanceRenderData';
import { NULL_HANDLE, Render2dHandle, Render2dPool } from '../../core/renderer';

export class RenderEntity {
    public renderData: BaseRenderData=null!;
    public stencilStage:Stage = Stage.DISABLED;

    //节点树渲染index
    static static_entityIndex = 0;
    protected _entityId = 0;
    public get entityId () {
        return this._entityId;
    }

    //前置渲染数据
    public dataArr: AdvanceRenderData[] = [];
    public nativeDataArr:NativeAdvanceRenderData[] = [];

    //具体的渲染数据
    public bufferId: number | undefined;
    public vertexOffset: number | undefined;
    public indexOffset: number | undefined;
    public vb: Float32Array | undefined;
    public vData: Float32Array | undefined;//要考虑是否每个组件都需要存这个指针
    public iData: Uint16Array | undefined;

    protected declare _nativeObj: NativeRenderEntity;

    // 顶点数据存储的共享内存 set dataLength 时就可以确定这个buffer的长度
    protected declare _render2dBuffer: Float32Array;

    protected _vertexCount = 0;
    protected _stride = 0;

    constructor () {
        this._entityId = RenderEntity.static_entityIndex++;
        if (JSB) {
            if (!this._nativeObj) {
                this._nativeObj = new NativeRenderEntity();
            }
        }
    }

    get nativeObj () {
        return this._nativeObj;
    }

    get render2dBuffer () {
        return this._render2dBuffer;
    }

    public setBufferId (bufferId) {
        this.bufferId = bufferId;
        if (JSB) {
            this._nativeObj.bufferId = bufferId;
        }
    }

    public setVertexOffset (vertexOffset) {
        this.vertexOffset = vertexOffset;
        if (JSB) {
            this._nativeObj.vertexOffset = vertexOffset;
        }
    }

    public setIndexOffset (indexOffset) {
        this.indexOffset = indexOffset;
        if (JSB) {
            this._nativeObj.indexOffset = indexOffset;
        }
    }

    public setVB (vbBuffer: ArrayBufferLike) {
        // TODO: how to set vb in framework
        if (JSB) {
            this._nativeObj.vbBuffer = vbBuffer;
        }
    }

    public setVData (vDataBuffer:ArrayBufferLike) {
        if (JSB) {
            this._nativeObj.vDataBuffer = vDataBuffer;
        }
    }

    public setIData (iDataBuffer:ArrayBufferLike) {
        if (JSB) {
            this._nativeObj.iDataBuffer = iDataBuffer;
        }
    }

    //初始化sharedBuffer
    public initRender2dBuffer (vertexCount:number, stride:number) {
        this._stride = stride;
        this._vertexCount = vertexCount;
        this._render2dBuffer = new Float32Array(vertexCount * stride);
    }

    //填充所有顶点
    public fillRender2dBuffer (vertexDataArr:IRenderData[]) {
        const fillLength = Math.min(this._vertexCount, vertexDataArr.length);
        let bufferOffset = 0;
        for (let i = 0; i < fillLength; i++) {
            this.updateVertexBuffer(bufferOffset, vertexDataArr[i]);
            bufferOffset += this._stride;
        }
    }

    //更新某个顶点buffer
    public updateVertexBuffer (bufferOffset:number, vertexData:IRenderData) {
        if (bufferOffset >= this.render2dBuffer.length) {
            return;
        }
        const temp:IRenderData = vertexData;
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

    //同步到native
    public setRender2dBufferToNative () {
        if (JSB) {
            //this._nativeObj.setRender2dBufferToNativeNew(this._render2dBuffer);
            this._nativeObj.setRender2dBufferToNative(this._render2dBuffer, this._stride, this._vertexCount * this._stride);
        }
    }

    // //不能这样传，这样的话会导致频繁调用JSB
    // //改用3.4的node的那个typedarray的写法
    // //传递给native
    // //1.这里每个组件收集完之后要设置给对应的nativeObj
    // //2.然后再由batcher2d把所有的RenderEntity的nativeObj传给c++
    // public setAdvanceRenderDataArrToNative () {
    //     if (JSB) {
    //         const len = this.dataArr.length;
    //         const nativeDataArr: NativeAdvanceRenderData[] = [];
    //         for (let i = 0; i < len; i++) {
    //             nativeDataArr.push(this.dataArr[i].nativeObj);
    //         }
    //         this._nativeObj.setAdvanceRenderDataArr(nativeDataArr);
    //     }
    // }

    //加一个顶点数据
    public addAdvanceRenderData (data: AdvanceRenderData) {
        this.dataArr.push(data);
        if (JSB) {
            this.nativeDataArr.push(data.nativeObj);
        }
    }

    //清理当前前置渲染数据
    public clearAdvanceRenderDataArr () {
        this.dataArr = [];
    }
}
