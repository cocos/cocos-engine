/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { JSB } from 'internal:constants';
import { NativeRenderEntity } from './native-2d';
import { RenderDrawInfo } from './render-draw-info';
import { Color } from '../../core';
import { Stage } from './stencil-manager';
import { Node } from '../../scene-graph';

export enum RenderEntityFillColorType {
    COLOR = 0,
    VERTEX
}

export enum RenderEntityType {
    STATIC,
    DYNAMIC,
    CROSSED,
}

enum RenderEntityUInt32SharedBufferView {
    priority,
    count,
}

enum RenderEntityUInt8SharedBufferView {
    colorR,
    colorG,
    colorB,
    colorA,
    maskMode,
    fillColorType,
    count,
}

enum RenderEntityBoolSharedBufferViewBitIndex {
    enabled,
    useLocal,
    count,
}

export enum MaskMode {
    NONE,
    MASK,
    MASK_INVERTED,
    MASK_NODE,
    MASK_NODE_INVERTED
}

/** @mangle */
export class RenderEntity {
    private _renderEntityType: RenderEntityType = RenderEntityType.STATIC;

    private _dynamicDrawInfoArr: RenderDrawInfo[] = [];

    protected _node: Node | null = null;
    protected _renderTransform: Node | null = null;
    protected _stencilStage: Stage = Stage.DISABLED;

    protected _colorDirty = true;
    protected _enabled = false;
    protected _useLocal = false;
    protected _maskMode = MaskMode.NONE;

    protected declare _uint32SharedBuffer: Uint32Array;
    protected declare _uint8SharedBuffer: Uint8Array;
    protected declare _boolSharedBuffer: Uint8Array;

    private declare _nativeObj: NativeRenderEntity;
    get nativeObj (): NativeRenderEntity {
        return this._nativeObj;
    }

    get renderDrawInfoArr (): RenderDrawInfo[] {
        return this._dynamicDrawInfoArr;
    }

    get renderEntityType (): RenderEntityType {
        return this._renderEntityType;
    }
    // set renderEntityType (val:RenderEntityType) {
    //     this._renderEntityType = val;
    // }

    setPriority (val: number): void {
        if (JSB) {
            this._uint32SharedBuffer[RenderEntityUInt32SharedBufferView.priority] = val;
        }
    }

    protected _color: Color = Color.WHITE.clone();
    get color (): Color {
        return this._color;
    }
    set color (val: Color) {
        this._color = val;
        if (JSB) {
            this._uint8SharedBuffer[RenderEntityUInt8SharedBufferView.colorR] = val.r;
            this._uint8SharedBuffer[RenderEntityUInt8SharedBufferView.colorG] = val.g;
            this._uint8SharedBuffer[RenderEntityUInt8SharedBufferView.colorB] = val.b;
            this._uint8SharedBuffer[RenderEntityUInt8SharedBufferView.colorA] = val.a;
        }
    }

    get colorDirty (): boolean {
        if (JSB && this._node) {
            this._colorDirty = (this._node as any)._colorDirty;
        }
        return this._colorDirty;
    }

    set colorDirty (val: boolean) {
        this._colorDirty = val;
        if (JSB && this._node) {
            (this._node as any)._colorDirty = val;
        }
    }

    get enabled (): boolean {
        return this._enabled;
    }

    set enabled (val: boolean) {
        this._enabled = val;
        if (JSB) {
            if (val) {
                this._boolSharedBuffer[0] |= (1 << RenderEntityBoolSharedBufferViewBitIndex.enabled);
            } else {
                this._boolSharedBuffer[0] &= ~(1 << RenderEntityBoolSharedBufferViewBitIndex.enabled);
            }
        }
    }

    setUseLocal (useLocal: boolean): void {
        this._useLocal = useLocal;
        if (JSB) {
            if (useLocal) {
                this._boolSharedBuffer[0] |= (1 << RenderEntityBoolSharedBufferViewBitIndex.useLocal);
            } else {
                this._boolSharedBuffer[0] &= ~(1 << RenderEntityBoolSharedBufferViewBitIndex.useLocal);
            }
        }
    }

    constructor (entityType: RenderEntityType) {
        if (JSB) {
            if (!this._nativeObj) {
                this._nativeObj = new NativeRenderEntity(entityType);
            }
            this._renderEntityType = entityType;
            this.initSharedBuffer();
        }
    }

    public addDynamicRenderDrawInfo (renderDrawInfo: RenderDrawInfo | null): void {
        if (JSB) {
            if (renderDrawInfo) {
                this._dynamicDrawInfoArr.push(renderDrawInfo);
                this._nativeObj.addDynamicRenderDrawInfo(renderDrawInfo.nativeObj);
            }
        }
    }

    public removeDynamicRenderDrawInfo (): void {
        if (JSB) {
            this._dynamicDrawInfoArr.pop();
            this._nativeObj.removeDynamicRenderDrawInfo();
        }
    }

    public clearDynamicRenderDrawInfos (): void {
        if (JSB) {
            this._dynamicDrawInfoArr.length = 0;
            this._nativeObj.clearDynamicRenderDrawInfos();
        }
    }

    public clearStaticRenderDrawInfos (): void {
        if (JSB) {
            this._nativeObj.clearStaticRenderDrawInfos();
        }
    }

    public clearRenderDrawInfos (): void {
        if (JSB) {
            if (this._renderEntityType === RenderEntityType.DYNAMIC) {
                this.removeDynamicRenderDrawInfo();
            } else if (this._renderEntityType === RenderEntityType.STATIC) {
                this.clearStaticRenderDrawInfos();
            }
        }
    }

    public setDynamicRenderDrawInfo (renderDrawInfo: RenderDrawInfo | null, index: number): void {
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

    public setMaskMode (mode: MaskMode): void {
        if (JSB) {
            this._uint8SharedBuffer[RenderEntityUInt8SharedBufferView.maskMode] = mode;
        }
        this._maskMode = mode;
    }

    public setFillColorType (fillColorType: RenderEntityFillColorType): void {
        if (JSB) {
            this._uint8SharedBuffer[RenderEntityUInt8SharedBufferView.fillColorType] = fillColorType;
        }
    }

    public getStaticRenderDrawInfo (): RenderDrawInfo | null {
        if (JSB) {
            const nativeDrawInfo = this._nativeObj.getStaticRenderDrawInfo(this._nativeObj.staticDrawInfoSize++);
            const drawInfo = new RenderDrawInfo(nativeDrawInfo);
            return drawInfo;
        }
        return null;
    }

    setNode (node: Node | null): void {
        if (JSB) {
            if (this._node !== node) {
                this._nativeObj.node = node;
            }
        }
        this._node = node;
    }

    setRenderTransform (renderTransform: Node | null): void {
        if (JSB) {
            if (this._renderTransform !== renderTransform) {
                this._nativeObj.renderTransform = renderTransform;
            }
        }
        this._renderTransform = renderTransform;
    }

    setStencilStage (stage: Stage): void {
        if (JSB) {
            if (this._stencilStage !== stage) {
                this._nativeObj.stencilStage = stage;
            }
        }
        this._stencilStage = stage;
    }

    private initSharedBuffer (): void {
        if (JSB) {
            const buffer = this._nativeObj.getEntitySharedBufferForJS();
            let offset = 0;
            this._uint32SharedBuffer = new Uint32Array(buffer, offset, RenderEntityUInt32SharedBufferView.count);
            offset += RenderEntityUInt32SharedBufferView.count * 4;
            this._uint8SharedBuffer = new Uint8Array(buffer, offset, RenderEntityUInt8SharedBufferView.count);
            offset += RenderEntityUInt8SharedBufferView.count * 1;
            this._boolSharedBuffer = new Uint8Array(buffer, offset, 1); // Only use 1 bytes for at most 8 booleans
        }
    }
}
