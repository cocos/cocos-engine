/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { GFXComparisonFunc, GFXStencilOp } from '../../../gfx/define';
import { UI } from '../../../renderer/ui/ui';
import { Material } from '../../assets/material';
import { MaskComponent } from '../components/mask-component';
import { MeshBuffer } from '../mesh-buffer';
import { IAssembler } from './assembler';

interface IStencilState {
    stencilTest?: boolean;
    func?: GFXComparisonFunc;
    readMask?: number;
    writeMask?: number;
    failOp?: GFXStencilOp;
    zFailOp?: GFXStencilOp;
    passOp?: GFXStencilOp;
    ref?: number;
}

interface IStencilStateUpdate {
    func: GFXComparisonFunc;
    writeMask: number;
    ref: number;
}

function overrideStencilState (material: Material, state: IStencilState) {
    material.overridePipelineStates({
        depthStencilState: {
            stencilTestFront: state.stencilTest,
            stencilFuncFront: state.func,
            stencilReadMaskFront: state.readMask,
            stencilWriteMaskFront: state.writeMask,
            stencilFailOpFront: state.failOp,
            stencilZFailOpFront: state.zFailOp,
            stencilPassOpFront: state.passOp,
            stencilRefFront: state.ref,
            stencilTestBack: state.stencilTest,
            stencilFuncBack: state.func,
            stencilReadMaskBack: state.readMask,
            stencilWriteMaskBack: state.writeMask,
            stencilFailOpBack: state.failOp,
            stencilZFailOpBack: state.zFailOp,
            stencilPassOpBack: state.passOp,
            stencilRefBack: state.ref,
        },
    });
}

function updateDynamicStencilStates (material: Material, state: IStencilStateUpdate) {

}

class StencilManager {
    private _maskStack: MaskComponent[] = [];

    public enter (mask: MaskComponent) {
        this._maskStack.push(mask);
    }

    public exit () {
        this._maskStack.pop();
    }

    public updateMaskMaterial (material: Material) {
        updateDynamicStencilStates(material, {
            func: GFXComparisonFunc.ALWAYS,
            writeMask: this._protectAncestorMasks(),
            ref: this._getWriteMaskForTopMask(),
        });
    }

    public updateClearMaskMaterial (material: Material) {
        updateDynamicStencilStates(material, {
            func: GFXComparisonFunc.ALWAYS,
            writeMask: this._protectAncestorMasks(),
            ref: 0,
        });
    }

    private _readAncestorMasks (): number {
        let result = 0;
        this._maskStack.forEach((mask, iBit) => {
            result |= (1 << iBit);
        });
        return result;
    }

    private _protectAncestorMasks (): number {
        return ~this._readAncestorMasks();
    }

    private _getWriteMaskForTopMask (): number {
        return 1 << this._maskStack.length;
    }
}

const stencilManager = new StencilManager();

export const maskAssembler: IAssembler = {
    useModel : false,

    updateRenderData (mask: MaskComponent) {
    },

    fillBuffers (mask: MaskComponent, ui: UI) {
        stencilManager.enter(mask);
        mask._createRenderData(ui);
    },
};

export const maskEndAssembler: IAssembler = {
    fillBuffers (mask: MaskComponent, meshBuffer: MeshBuffer) {
        stencilManager.exit();
    },
};

export function setupMaskMaterial (material: Material) {
    overrideStencilState(material, {
        stencilTest: true,
        func: GFXComparisonFunc.ALWAYS,
        readMask: 0xffffffff,
        failOp: GFXStencilOp.KEEP,
        zFailOp: GFXStencilOp.KEEP,
        passOp: GFXStencilOp.REPLACE,
    });
}

export function setupClearMaskMaterial (material: Material) {
    overrideStencilState(material, {
        stencilTest: true,
        func: GFXComparisonFunc.ALWAYS,
        readMask: 0xffffffff,
        failOp: GFXStencilOp.KEEP,
        zFailOp: GFXStencilOp.KEEP,
        passOp: GFXStencilOp.REPLACE,
        ref: 0,
    });
}

export function setupMaskTargetMaterial (material: Material) {
    overrideStencilState(material, {
        stencilTest: true,
        func: GFXComparisonFunc.NOT_EQUAL,
        readMask: 0xffffffff,
        writeMask: 0xffffffff,
        failOp: GFXStencilOp.KEEP,
        zFailOp: GFXStencilOp.KEEP,
        passOp: GFXStencilOp.KEEP,
        ref: 0,
    });
}
