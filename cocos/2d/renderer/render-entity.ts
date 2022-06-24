import { JSB } from '../../core/default-constants';
import { NativeRenderEntity } from '../../core/renderer/2d/native-2d';
import { UIRenderer } from '../framework/ui-renderer';
import { Batcher2D } from './batcher-2d';
import { RenderData } from './render-data';
import { RenderDrawInfo } from './render-draw-info';
import { Material, Node } from '../../core';
import { EmitLocation } from '../../particle/enum';

export enum RenderEntityType {
    STATIC,
    DYNAMIC,
}

export class RenderEntity {
    private _renderEntityType: RenderEntityType = RenderEntityType.STATIC;

    private _dynamicDrawInfoArr: RenderDrawInfo[] = [];

    private _batcher: Batcher2D | undefined;

    protected _node: Node | undefined;

    private declare _nativeObj: NativeRenderEntity;
    get nativeObj () {
        return this._nativeObj;
    }

    get renderDrawInfoArr () {
        return this._dynamicDrawInfoArr;
    }

    get renderEntityType () {
        return this._renderEntityType;
    }
    // set renderEntityType (val:RenderEntityType) {
    //     this._renderEntityType = val;
    // }

    constructor (batcher: Batcher2D, entityType: RenderEntityType) {
        if (JSB) {
            this._batcher = batcher;
            if (!this._nativeObj) {
                this._nativeObj = new NativeRenderEntity(batcher.nativeObj);
            }
            this.setRenderEntityType(entityType);
        }
    }

    public addDynamicRenderDrawInfo (renderDrawInfo: RenderDrawInfo | null) {
        if (JSB) {
            if (renderDrawInfo) {
                this._dynamicDrawInfoArr.push(renderDrawInfo);
                this._nativeObj.addDynamicRenderDrawInfo(renderDrawInfo.nativeObj);
            }
        }
    }

    public setDynamicRenderDrawInfo (renderDrawInfo: RenderDrawInfo | null, index: number) {
        if (JSB) {
            if (renderDrawInfo) {
                if (this._dynamicDrawInfoArr.length > index) {
                    this._dynamicDrawInfoArr[index] = renderDrawInfo;
                }
                this._nativeObj.setDynamicRenderDrawInfo(renderDrawInfo.nativeObj, index);
            }
        }
    }

    public getStaticRenderDrawInfo (): RenderDrawInfo | null {
        if (JSB) {
            const nativeDrawInfo = this._nativeObj.getStaticRenderDrawInfo(0);
            const drawInfo = new RenderDrawInfo(this._batcher!, nativeDrawInfo);
            return drawInfo;
        }
        return null;
    }

    public destroy () {
        this._dynamicDrawInfoArr = [];
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

    setRenderEntityType (type:RenderEntityType) {
        if (JSB) {
            if (this._renderEntityType !== type) {
                this._nativeObj.setRenderEntityType(this._renderEntityType);
            }
        }
        this._renderEntityType = type;
    }
}
