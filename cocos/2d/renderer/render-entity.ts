import { JSB } from 'internal:constants';
import { NativeRenderEntity } from './native-2d';
import { UIRenderer } from '../framework/ui-renderer';
import { Batcher2D } from './batcher-2d';
import { RenderData } from './render-data';
import { RenderDrawInfo } from './render-draw-info';
import { color, Color, Material, Node } from '../../core';
import { EmitLocation } from '../../particle/enum';
import { Stage } from './stencil-manager';

export enum RenderEntityType {
    STATIC,
    DYNAMIC,
}

export enum RenderEntityFloatSharedBufferView {
    colorR,
    colorG,
    colorB,
    colorA,
    localOpacity,
    count,
}
export enum RenderEntityBoolSharedBufferView{
    colorDirty,
    enabled,
    padding0,
    padding1,
    count,
}

export class RenderEntity {
    private _renderEntityType: RenderEntityType = RenderEntityType.STATIC;

    private _dynamicDrawInfoArr: RenderDrawInfo[] = [];

    private _batcher: Batcher2D | undefined;

    protected _node: Node | null = null;
    protected _stencilStage: Stage = Stage.DISABLED;
    protected _customMaterial: Material | null = null;
    protected _commitModelMaterial: Material | null = null;

    // is it entity a mask node
    protected _isMask = false;
    // is it entity a sub mask node
    protected _isSubMask = false;
    // is mask inverted
    protected _isMaskInverted = false;

    protected declare _floatSharedBuffer: Float32Array;
    protected declare _boolSharedBuffer:Uint8Array;

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

    protected _color: Color = Color.WHITE;
    get color () {
        return this._color;
    }
    set color (val: Color) {
        this._color = val;
        if (JSB) {
            this._floatSharedBuffer[RenderEntityFloatSharedBufferView.colorR] = val.r;
            this._floatSharedBuffer[RenderEntityFloatSharedBufferView.colorG] = val.g;
            this._floatSharedBuffer[RenderEntityFloatSharedBufferView.colorB] = val.b;
            this._floatSharedBuffer[RenderEntityFloatSharedBufferView.colorA] = val.a;
        }
    }

    protected _localOpacity = 255;
    get localOpacity () {
        return this._localOpacity;
    }
    set localOpacity (val: number) {
        this._localOpacity = val;
        if (JSB) {
            this._floatSharedBuffer[RenderEntityFloatSharedBufferView.localOpacity] = val;
        }
    }

    protected _colorDirty = true;
    get colorDirty () {
        return this._colorDirty;
    }
    set colorDirty (val: boolean) {
        this._colorDirty = val;
        if (JSB) {
            this._boolSharedBuffer[RenderEntityBoolSharedBufferView.colorDirty] = val ? 1 : 0;
        }
    }

    protected _enabled = true;
    get enabled () {
        return this._enabled;
    }
    set enabled (val: boolean) {
        this._enabled = val;
        if (JSB) {
            this._boolSharedBuffer[RenderEntityBoolSharedBufferView.enabled] = val ? 1 : 0;
        }
    }

    constructor (batcher: Batcher2D, entityType: RenderEntityType) {
        if (JSB) {
            this._batcher = batcher;
            if (!this._nativeObj) {
                this._nativeObj = new NativeRenderEntity(batcher.nativeObj);
            }
            this.setRenderEntityType(entityType);

            this.initSharedBuffer();
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

    public removeDynamicRenderDrawInfo () {
        if (JSB) {
            this._dynamicDrawInfoArr.pop();
            this._nativeObj.removeDynamicRenderDrawInfo();
        }
    }

    public clearDynamicRenderDrawInfos () {
        if (JSB) {
            this._dynamicDrawInfoArr.length = 0;
            this._nativeObj.clearDynamicRenderDrawInfos();
        }
    }

    public setDynamicRenderDrawInfo (renderDrawInfo: RenderDrawInfo | null, index: number) {
        if (JSB) {
            if (renderDrawInfo) {
                if (this._dynamicDrawInfoArr.length < index + 1) {
                    this._dynamicDrawInfoArr.push(renderDrawInfo);
                    this._nativeObj.addDynamicRenderDrawInfo(renderDrawInfo.nativeObj);
                } else {
                    this._dynamicDrawInfoArr[index] = renderDrawInfo;
                    this._nativeObj.setDynamicRenderDrawInfo(renderDrawInfo.nativeObj, index);
                }
            }
        }
    }

    public getStaticRenderDrawInfo (): RenderDrawInfo | null {
        if (JSB) {
            const nativeDrawInfo = this._nativeObj.getStaticRenderDrawInfo(this._nativeObj.staticDrawInfoSize++);
            const drawInfo = new RenderDrawInfo(this._batcher!, nativeDrawInfo);
            return drawInfo;
        }
        return null;
    }

    public destroy () {
        this.setNode(null);
        this.enabled = false;
        this.setCustomMaterial(null);
        this.setStencilStage(0);
        this.setCommitModelMaterial(null);
        // @ts-expect-error temporary no care
        this._nativeObj = null;
        this._dynamicDrawInfoArr = [];
    }

    public assignExtraEntityAttrs (comp: UIRenderer) {
        if (JSB) {
            this.setNode(comp.node);
            this.enabled = comp.enabled;
        }
    }

    setIsMask (val:boolean) {
        if (JSB) {
            if (this._isMask !== val) {
                this._nativeObj.isMask = val;
            }
        }
        this._isMask = val;
    }

    setIsSubMask (val:boolean) {
        if (JSB) {
            if (this._isSubMask !== val) {
                this._nativeObj.isSubMask = val;
            }
        }
        this._isSubMask = val;
    }

    setIsMaskInverted (val:boolean) {
        if (JSB) {
            if (this._isMaskInverted !== val) {
                this._nativeObj.isMaskInverted = val;
            }
        }
        this._isMaskInverted = val;
    }

    setNode (node: Node | null) {
        if (JSB) {
            if (this._node !== node) {
                this._nativeObj.node = node;
            }
        }
        this._node = node;
    }

    setStencilStage (stage: Stage) {
        if (JSB) {
            if (this._stencilStage !== stage) {
                this._nativeObj.stencilStage = stage;
            }
        }
        this._stencilStage = stage;
    }

    setCustomMaterial (mat: Material | null) {
        if (JSB) {
            if (this._customMaterial !== mat) {
                this._nativeObj.customMaterial = mat!;
            }
        }
        this._customMaterial = mat;
    }

    setCommitModelMaterial (mat:Material|null) {
        if (JSB) {
            if (this._commitModelMaterial !== mat) {
                this._nativeObj.commitModelMaterial = mat!;
            }
        }
        this._commitModelMaterial = mat;
    }

    setRenderEntityType (type: RenderEntityType) {
        if (JSB) {
            if (this._renderEntityType !== type) {
                this._nativeObj.setRenderEntityType(type);
            }
        }
        this._renderEntityType = type;
    }

    private initSharedBuffer () {
        if (JSB) {
            //this._sharedBuffer = new Float32Array(RenderEntitySharedBufferView.count);
            const buffer = this._nativeObj.getEntitySharedBufferForJS();
            this._floatSharedBuffer = new Float32Array(buffer, 0, RenderEntityFloatSharedBufferView.count);
            this._boolSharedBuffer = new Uint8Array(buffer, RenderEntityFloatSharedBufferView.count * 4, RenderEntityBoolSharedBufferView.count);
        }
    }
}
