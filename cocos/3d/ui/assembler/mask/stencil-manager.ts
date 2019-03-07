import { GFXComparisonFunc, GFXStencilOp } from '../../../../gfx/define';
import { Pass } from '../../../../renderer';
import { Material } from '../../../assets/material';
import { MaskComponent } from '../../components/mask-component';

// import { GFXStencilOp } from '../../../../gfx/define';
// import { MaskComponent } from '../../components/mask-component';

// /****************************************************************************
//  Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

//  http://www.cocos.com

//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated engine source code (the "Software"), a limited,
//  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
//  to use Cocos Creator solely to develop games on your target platforms. You shall
//  not use Cocos Creator software for developing other software or tools that's
//  used for developing games. You are not granted to publish, distribute,
//  sublicense, and/or sell copies of Cocos Creator.

//  The software or tools in this License Agreement are licensed, not sold.
//  Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//  ****************************************************************************/

// Stage types
export enum Stage {
    // Stencil disabled
    DISABLED = 0,
    // Clear stencil buffer
    CLEAR = 1,
    // Entering a new level, should handle new stencil
    ENTER_LEVEL = 2,
    // In content
    ENABLED = 3,
    // Exiting a level, should restore old stencil or disable
    EXIT_LEVEL = 4,
}

interface IStencilState {
    stencilTest?: boolean;
    func?: GFXComparisonFunc;
    stencilMask?: number;
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

function updateDynamicStencilStates (material: Material, state: IStencilStateUpdate){

}

export class StencilManager {
    public static sharedManager: StencilManager | null = null;
    public stage = Stage.DISABLED;
    private _maskStack: MaskComponent[] = [];
    private _stencilPattern = {
        stencilTest: true,
        func: GFXComparisonFunc.ALWAYS,
        stencilMask: 0xffffffff,
        writeMask: 0xffffffff,
        failOp: GFXStencilOp.KEEP,
        zFailOp: GFXStencilOp.KEEP,
        passOp: GFXStencilOp.KEEP,
        ref: 1,
    };

    private _defaultPipelineState = {
        depthStencilState: {},
        rasterizerState: {},
        blendState: {},
    };

    public pushMask (mask: MaskComponent) {
        this._maskStack.push(mask);
    }

    public clear () {
        this.stage = Stage.CLEAR;
    }

    public enterLevel () {
        this.stage = Stage.ENTER_LEVEL;
    }

    public enableMask (){
        this.stage = Stage.ENABLED;
    }

    public exitMask () {
        if (this._maskStack.length === 0) {
            // cc.errorID(9001);
            return;
        }
        this._maskStack.pop();
        if (this._maskStack.length === 0) {
            this.stage = Stage.DISABLED;
        }
        else {
            this.stage = Stage.ENABLED;
        }
    }

    public handleMaterial (mat: Material){
        const pattern = this._stencilPattern;
        if (this.stage === Stage.DISABLED) {
            pattern.stencilTest = false;
        } else {
            pattern.stencilTest = true;
            if (this.stage === Stage.ENABLED) {
                pattern.func = GFXComparisonFunc.EQUAL;
                pattern.failOp = GFXStencilOp.KEEP;
                pattern.stencilMask = pattern.ref = this.getStencilRef();
                pattern.writeMask = this.getWriteMask();
            } else if (this.stage === Stage.CLEAR) {
                pattern.func = GFXComparisonFunc.NEVER;
                pattern.failOp = GFXStencilOp.ZERO;
                pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
            } else if (this.stage === Stage.ENTER_LEVEL) {
                pattern.func = GFXComparisonFunc.NEVER;
                pattern.failOp = GFXStencilOp.REPLACE;
                pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
            }
        }

        const state = this._stencilPattern;
        const pass = mat.passes[0];
        if (this._changed(pass)){
            this._defaultPipelineState.depthStencilState = {
                stencilTestFront: state.stencilTest,
                stencilFuncFront: state.func,
                stencilReadMaskFront: state.stencilMask,
                stencilWriteMaskFront: state.writeMask,
                stencilFailOpFront: state.failOp,
                stencilZFailOpFront: state.zFailOp,
                stencilPassOpFront: state.passOp,
                stencilRefFront: state.ref,
                stencilTestBack: state.stencilTest,
                stencilFuncBack: state.func,
                stencilReadMaskBack: state.stencilMask,
                stencilWriteMaskBack: state.writeMask,
                stencilFailOpBack: state.failOp,
                stencilZFailOpBack: state.zFailOp,
                stencilPassOpBack: state.passOp,
                stencilRefBack: state.ref,
            };
            this._defaultPipelineState.blendState = pass.blendState;
            this._defaultPipelineState.rasterizerState = pass.rasterizerState;
            mat.overridePipelineStates(this._defaultPipelineState);
        }
    }

    public getWriteMask () {
        return 0x00000001 << (this._maskStack.length - 1);
    }

    public getExitWriteMask () {
        return 0x00000001 << this._maskStack.length;
    }

    public getStencilRef () {
        let result = 0;
        for (let i = 0; i < this._maskStack.length; ++i) {
            result += (0x00000001 << i);
        }
        return result;
    }

    public getInvertedRef () {
        let result = 0;
        for (let i = 0; i < this._maskStack.length - 1; ++i) {
            result += (0x01 << i);
        }
        return result;
    }

    public reset () {
        // reset stack and stage
        this._maskStack.length = 0;
        this.stage = Stage.DISABLED;
    }

    private _changed (pass: Pass) {
        const stencilState = pass.depthStencilState;
        const pattern = this._stencilPattern;
        if (pattern.stencilTest !== stencilState.stencilTestFront ||
            pattern.func !== stencilState.stencilFuncFront ||
            pattern.failOp !== stencilState.stencilFailOpFront ||
            pattern.zFailOp !== stencilState.stencilZFailOpFront ||
            pattern.passOp !== stencilState.stencilPassOpFront ||
            pattern.stencilMask !== stencilState.stencilReadMaskFront ||
            pattern.writeMask !== stencilState.stencilWriteMaskFront ||
            pattern.ref !== stencilState.stencilRefFront) {
            return true;
        }

        return false;
    }
}

StencilManager.sharedManager = new StencilManager();
