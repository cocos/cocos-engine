/*
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
*/
/**
 * @hidden
 */

import { Material } from '../../assets/material';
import { GFXComparisonFunc, GFXStencilOp } from '../../gfx/define';
import { Pass } from '../core/pass';

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

export class StencilManager {
    public static sharedManager: StencilManager | null = null;
    public stage = Stage.DISABLED;
    private _maskStack: any[] = [];
    private _stencilPattern = {
        stencilTest: true,
        func: GFXComparisonFunc.ALWAYS,
        stencilMask: 0xffff,
        writeMask: 0xffff,
        failOp: GFXStencilOp.KEEP,
        zFailOp: GFXStencilOp.KEEP,
        passOp: GFXStencilOp.KEEP,
        ref: 1,
    };

    get pattern () {
        return this._stencilPattern;
    }

    public pushMask (mask: any) {
        this._maskStack.push(mask);
    }

    public clear () {
        this.stage = Stage.CLEAR;
    }

    public enterLevel () {
        this.stage = Stage.ENTER_LEVEL;
    }

    public enableMask () {
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

    public handleMaterial (mat: Material) {
        const pattern = this._stencilPattern;
        if (this.stage === Stage.DISABLED) {
            pattern.stencilTest = false;
            pattern.func = GFXComparisonFunc.ALWAYS;
            pattern.failOp = GFXStencilOp.KEEP;
            pattern.stencilMask = pattern.writeMask = 0xffff;
            pattern.ref = 1;
        } else {
            pattern.stencilTest = true;
            if (this.stage === Stage.ENABLED) {
                pattern.func = GFXComparisonFunc.EQUAL;
                pattern.failOp = GFXStencilOp.KEEP;
                pattern.stencilMask = pattern.ref = this.getStencilRef();
                pattern.writeMask = this.getWriteMask();
            } else if (this.stage === Stage.CLEAR) {
                const mask = this._maskStack[this._maskStack.length - 1];
                pattern.func = GFXComparisonFunc.NEVER;
                pattern.failOp = mask.inverted ? GFXStencilOp.REPLACE : GFXStencilOp.ZERO;
                pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
            } else if (this.stage === Stage.ENTER_LEVEL) {
                const mask = this._maskStack[this._maskStack.length - 1];
                pattern.func = GFXComparisonFunc.NEVER;
                pattern.failOp = mask.inverted ? GFXStencilOp.ZERO : GFXStencilOp.REPLACE;
                pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
            }
        }

        return this._changed(mat.passes[0]);
    }

    public getWriteMask () {
        return 1 << (this._maskStack.length - 1);
    }

    public getExitWriteMask () {
        return 1 << this._maskStack.length;
    }

    public getStencilRef () {
        let result = 0;
        for (let i = 0; i < this._maskStack.length; ++i) {
            result += (0x00000001 << i);
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
