import { BaseRenderData } from './render-data';
import { Stage } from './stencil-manager';
import { JSB } from '../../core/default-constants';
import { NativeAdvanceRenderData, NativeRenderEntity } from '../../core/renderer/2d/native-2d';
import { AdvanceRenderData } from './AdvanceRenderData';
import { NULL_HANDLE, Render2dHandle, Render2dPool } from '../../core/renderer';

export class RenderEntity {
    public renderData: BaseRenderData=null!;
    public stencilStage:Stage = Stage.DISABLED;

    //节点树渲染index
    static static_renderIndex:number;
    renderIndex = 0;

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

    constructor () {
        if (JSB) {
            if (!this._nativeObj) {
                this._nativeObj = new NativeRenderEntity();
            }
        }
    }

    get nativeObj () {
        return this._nativeObj;
    }

    public setBufferId (bufferId) {
        this._nativeObj.bufferId = bufferId;
    }

    public setVB (vbBuffer: ArrayBufferLike) {
        if (JSB) {
            if (this._nativeObj) {
                this._nativeObj.vbBuffer = vbBuffer;
            }
        }
    }

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

    //不能这样传，这样的话会导致频繁调用JSB
    //改用3.4的node的那个typedarray的写法
    //传递给native
    public setAdvanceRenderDataArrToNative () {
        const len = this.dataArr.length;
        const nativeDataArr: NativeAdvanceRenderData[] = [];
        for (let i = 0; i < len; i++) {
            nativeDataArr.push(this.dataArr[i].nativeObj);
        }
        this._nativeObj.setAdvanceRenderDataArr(nativeDataArr);
    }
}
