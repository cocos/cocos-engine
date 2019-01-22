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

import { vec3 } from '../../../core/vmath';
import { GFXComparisonFunc, GFXStencilOp } from '../../../gfx/define';
import { IUIRenderData, UI } from '../../../renderer/ui/ui';
import { Material } from '../../assets/material';
import { IGeometry } from '../../primitive/define';
import { MaskComponent } from '../components/mask-component';
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
    fillBuffers (mask: MaskComponent, ui: UI) {
        stencilManager.enter(mask);

        const maskGeometry = mask._getMaskGeometry();
        const maskMaterial = mask._getMaskMaterial();
        if (maskGeometry && maskMaterial) {
            const meshBuffer = createMeshBuffer(ui, maskGeometry);
            const nVert = Math.floor(maskGeometry.positions.length / 3);
            const v = new vec3();
            const worldMatrix = mask.node.getWorldMatrix();
            for (let i = 0; i < nVert; ++i) {
                vec3.set(v,
                    maskGeometry.positions[3 * i + 0],
                    maskGeometry.positions[3 * i + 1],
                    maskGeometry.positions[3 * i + 2]);
                vec3.transformMat4(v, v, worldMatrix);
                meshBuffer.vData![3 * i + 0] = v.x;
                meshBuffer.vData![3 * i + 1] = v.y;
                meshBuffer.vData![3 * i + 2] = v.z;
            }
            const maskRenderData = ui.createUIRenderData() as IUIRenderData;
            maskRenderData.meshBuffer = meshBuffer;
            maskRenderData.material = maskMaterial;
            ui.addToQueue(maskRenderData);
        }
    },
};

export const maskEndAssembler: IAssembler = {
    fillBuffers (mask: MaskComponent, ui: UI) {
        stencilManager.exit();

        const clearGeometry = mask._getClearGeometry();
        const clearMaterial = mask._getClearMaterial();
        if (clearGeometry && clearMaterial) {
            const meshBuffer = createMeshBuffer(ui, clearGeometry);
            meshBuffer.vData!.set(clearGeometry.positions);
            const clearMaskRenderData = ui.createUIRenderData() as IUIRenderData;
            clearMaskRenderData.meshBuffer = meshBuffer;
            clearMaskRenderData.material = clearMaterial;
        }
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

function createMeshBuffer (ui: UI, geometry: IGeometry) {
    const nVert = Math.floor(geometry.positions.length / 3);
    const meshBuffer =  ui.createBuffer(nVert, geometry.indices ? geometry.indices.length : 0);
    if (geometry.indices) {
        meshBuffer.iData!.set(geometry.indices);
    }
    // geometry.primitiveMode === undefined ? GFXPrimitiveMode.TRIANGLE_LIST : geometry.primitiveMode;
    return meshBuffer;
}
