import { JSB } from '../../core/default-constants';
import { NativeRenderEntity } from '../../core/renderer/2d/native-2d';
import { UIRenderer } from '../framework/ui-renderer';
import { Batcher2D } from './batcher-2d';
import { RenderData } from './render-data';
import { RenderDrawInfo } from './render-draw-info';
import { Material, Node } from '../../core';

export class RenderEntity {
    private _renderDataArr: RenderData[] = [];
    private _renderDrawInfoArr: RenderDrawInfo[] = [];

    protected _node: Node | undefined;

    get renderDataArr () {
        return this._renderDataArr;
    }

    private declare _nativeObj: NativeRenderEntity;
    get nativeObj () {
        return this._nativeObj;
    }

    constructor (batcher:Batcher2D) {
        if (JSB) {
            if (!this._nativeObj) {
                this._nativeObj = new NativeRenderEntity(batcher.nativeObj);
            }
        }
    }

    public addRenderData (renderData:RenderData|null) {
        if (JSB) {
            if (renderData && renderData.renderDrawInfo) {
                this._renderDataArr.push(renderData);
                this._renderDrawInfoArr.push(renderData.renderDrawInfo);
                this._nativeObj.addRenderDrawInfo(renderData.renderDrawInfo.nativeObj);
            }
        }
    }

    public setRenderData (renderData:RenderData|null, index:number) {
        if (JSB) {
            if (renderData && renderData.renderDrawInfo) {
                if (this.renderDataArr.length > index) {
                    this.renderDataArr[index] = renderData;
                }
                if (this._renderDrawInfoArr.length > index) {
                    this._renderDrawInfoArr[index] = renderData.renderDrawInfo;
                }
                this._nativeObj.setRenderDrawInfo(renderData.renderDrawInfo.nativeObj, index);
            }
        }
    }

    public destroy () {
        this._renderDataArr = [];
        this._renderDrawInfoArr = [];
    }

    public assignExtraEntityAttrs (comp: UIRenderer) {
        if (JSB) {
            this.setNode(comp.node);
        }
    }

    setNode (node: Node) {
        if (JSB) {
            if (this._node !== node) {
                this._nativeObj.node = node;
            }
        }
        this._node = node;
    }
}
