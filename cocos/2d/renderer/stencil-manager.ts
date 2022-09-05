/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { JSB } from 'internal:constants';
import { ComparisonFunc, StencilOp, DepthStencilState } from '../../core/gfx';
import { Mask } from '../components/mask';
import { Material } from '../../core';
import { NativeStencilManager } from './native-2d';

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
    // Clear stencil buffer & USE INVERTED
    CLEAR_INVERTED = 5,
    // Entering a new level & USE INVERTED
    ENTER_LEVEL_INVERTED = 6,
}

export enum StencilSharedBufferView {
    stencilTest,
    func,
    stencilMask,
    writeMask,
    failOp,
    zFailOp,
    passOp,
    ref,
    count,
}

export class StencilManager {
    public static sharedManager: StencilManager | null = null;
    private _maskStack: any[] = [];
    private _stencilPattern = {
        stencilTest: true,
        func: ComparisonFunc.ALWAYS,
        stencilMask: 0xffff,
        writeMask: 0xffff,
        failOp: StencilOp.KEEP,
        zFailOp: StencilOp.KEEP,
        passOp: StencilOp.KEEP,
        ref: 1,
    };

    private _stage:Stage = Stage.DISABLED;
    get stage () {
        return this._stage;
    }
    set stage (val:Stage) {
        this._stage = val;
    }

    get pattern () {
        return this._stencilPattern;
    }

    public pushMask (mask: any) {
        this._maskStack.push(mask);
    }

    public clear (comp: Mask) {
        comp.stencilStage = comp.inverted ? Stage.CLEAR_INVERTED : Stage.CLEAR;
        // this.stage = Stage.CLEAR;
    }

    public enterLevel (comp: Mask) {
        comp.subComp!.stencilStage = comp.inverted ? Stage.ENTER_LEVEL_INVERTED : Stage.ENTER_LEVEL;
        // this.stage = Stage.ENTER_LEVEL;
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
        } else {
            this.stage = Stage.ENABLED;
        }
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

    public destroy () {
        this.stencilStateMap.forEach((value, key) => {
            value.destroy();
        });
        this.stencilStateMap.clear();
    }

    private stencilStateMap = new Map<number, DepthStencilState>();
    private stencilStateMapWithDepth = new Map<number, DepthStencilState>();

    public getStencilStage (stage: Stage, mat?: Material) {
        let key = 0;
        let depthTest = false;
        let depthWrite = false;
        let depthFunc = ComparisonFunc.LESS;
        let cacheMap = this.stencilStateMap;
        if (mat && mat.passes[0]) {
            const pass = mat.passes[0];
            const dss = pass.depthStencilState;
            let depthTestValue = 0;
            let depthWriteValue = 0;
            if (dss.depthTest) depthTestValue = 1;
            if (dss.depthWrite) depthWriteValue = 1;
            key = (depthTestValue) | (depthWriteValue << 1) | (dss.depthFunc << 2)  | (stage << 6) | (this._maskStack.length << 9);
            depthTest = dss.depthTest;
            depthWrite = dss.depthWrite;
            depthFunc = dss.depthFunc;
            cacheMap = this.stencilStateMapWithDepth;
        } else {
            key = (stage << 16) | this._maskStack.length;
        }
        if (cacheMap && cacheMap.has(key)) {
            return cacheMap.get(key) as DepthStencilState;
        }
        this.setStateFromStage(stage);
        const depthStencilState = new DepthStencilState(
            depthTest,
            depthWrite,
            depthFunc,
            this._stencilPattern.stencilTest,
            this._stencilPattern.func,
            this._stencilPattern.stencilMask,
            this._stencilPattern.writeMask,
            this._stencilPattern.failOp,
            this._stencilPattern.zFailOp,
            this._stencilPattern.passOp,
            this._stencilPattern.ref,
            this._stencilPattern.stencilTest,
            this._stencilPattern.func,
            this._stencilPattern.stencilMask,
            this._stencilPattern.writeMask,
            this._stencilPattern.failOp,
            this._stencilPattern.zFailOp,
            this._stencilPattern.passOp,
            this._stencilPattern.ref,
        );
        cacheMap.set(key, depthStencilState);
        return depthStencilState;
    }

    public getStencilHash (stage: Stage) {
        return (stage << 8) | this._maskStack.length;
    }

    // Notice: Only children node in Mask need use this.stage
    private setStateFromStage (stage) {
        const pattern = this._stencilPattern;
        if (stage === Stage.DISABLED) {
            pattern.stencilTest = false;
            pattern.func = ComparisonFunc.ALWAYS;
            pattern.failOp = StencilOp.KEEP;
            pattern.stencilMask = pattern.writeMask = 0xffff;
            pattern.ref = 1;
        } else {
            pattern.stencilTest = true;
            if (stage === Stage.ENABLED) {
                pattern.func = ComparisonFunc.EQUAL;
                pattern.failOp = StencilOp.KEEP;
                pattern.stencilMask = pattern.ref = this.getStencilRef();
                pattern.writeMask = this.getWriteMask();
            } else if (stage === Stage.CLEAR) {
                pattern.func = ComparisonFunc.NEVER;
                pattern.failOp = StencilOp.ZERO;
                pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
            } else if (stage === Stage.CLEAR_INVERTED) {
                pattern.func = ComparisonFunc.NEVER;
                pattern.failOp = StencilOp.REPLACE;
                pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
            } else if (stage === Stage.ENTER_LEVEL) {
                pattern.func = ComparisonFunc.NEVER;
                pattern.failOp = StencilOp.REPLACE;
                pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
            }  else if (stage === Stage.ENTER_LEVEL_INVERTED) {
                pattern.func = ComparisonFunc.NEVER;
                pattern.failOp = StencilOp.ZERO;
                pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
            }
        }
    }
}

StencilManager.sharedManager = new StencilManager();
