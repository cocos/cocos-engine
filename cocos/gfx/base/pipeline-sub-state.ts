/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

import {
    BlendFactor,
    BlendOp,
    ColorMask,
    ComparisonFunc,
    CullMode,
    PolygonMode,
    ShadeModel,
    StencilOp,
    Color,
} from './define';

/**
 * @en GFX rasterizer state.
 * @zh GFX 光栅化状态。
 */
export class RasterizerState {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    get native (): RasterizerState {
        return this;
    }

    constructor (
        public isDiscard: boolean = false,
        public polygonMode: PolygonMode = PolygonMode.FILL,
        public shadeModel: ShadeModel = ShadeModel.GOURAND,
        public cullMode: CullMode = CullMode.BACK,
        public isFrontFaceCCW: boolean = true,
        public depthBiasEnabled: boolean = false,
        public depthBias: number = 0,
        public depthBiasClamp: number = 0.0,
        public depthBiasSlop: number = 0.0,
        public isDepthClip: boolean = true,
        public isMultisample: boolean = false,
        public lineWidth: number = 1.0,
    ) {}

    public reset (): void {
        this.isDiscard = false;
        this.polygonMode = PolygonMode.FILL;
        this.shadeModel = ShadeModel.GOURAND;
        this.cullMode = CullMode.BACK;
        this.isFrontFaceCCW = true;
        this.depthBiasEnabled = false;
        this.depthBias = 0;
        this.depthBiasClamp = 0.0;
        this.depthBiasSlop = 0.0;
        this.isDepthClip = true;
        this.isMultisample = false;
        this.lineWidth = 1.0;
    }

    public assign (rs: RasterizerState): void {
        Object.assign(this, rs);
    }

    public destroy (): void {}
}

/**
 * @en GFX depth stencil state.
 * @zh GFX 深度模板状态。
 */
export class DepthStencilState {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    get native (): DepthStencilState {
        return this;
    }
    constructor (
        public depthTest: boolean = true,
        public depthWrite: boolean = true,
        public depthFunc: ComparisonFunc = ComparisonFunc.LESS,
        public stencilTestFront: boolean = false,
        public stencilFuncFront: ComparisonFunc = ComparisonFunc.ALWAYS,
        public stencilReadMaskFront: number = 0xffff,
        public stencilWriteMaskFront: number = 0xffff,
        public stencilFailOpFront: StencilOp = StencilOp.KEEP,
        public stencilZFailOpFront: StencilOp = StencilOp.KEEP,
        public stencilPassOpFront: StencilOp = StencilOp.KEEP,
        public stencilRefFront: number = 1,
        public stencilTestBack: boolean = false,
        public stencilFuncBack: ComparisonFunc = ComparisonFunc.ALWAYS,
        public stencilReadMaskBack: number = 0xffff,
        public stencilWriteMaskBack: number = 0xffff,
        public stencilFailOpBack: StencilOp = StencilOp.KEEP,
        public stencilZFailOpBack: StencilOp = StencilOp.KEEP,
        public stencilPassOpBack: StencilOp = StencilOp.KEEP,
        public stencilRefBack: number = 1,
    ) {}

    public reset (): void {
        this.depthTest = true;
        this.depthWrite = true;
        this.depthFunc = ComparisonFunc.LESS;
        this.stencilTestFront = false;
        this.stencilFuncFront = ComparisonFunc.ALWAYS;
        this.stencilReadMaskFront = 0xffff;
        this.stencilWriteMaskFront = 0xffff;
        this.stencilFailOpFront = StencilOp.KEEP;
        this.stencilZFailOpFront = StencilOp.KEEP;
        this.stencilPassOpFront = StencilOp.KEEP;
        this.stencilRefFront = 1;
        this.stencilTestBack = false;
        this.stencilFuncBack = ComparisonFunc.ALWAYS;
        this.stencilReadMaskBack = 0xffff;
        this.stencilWriteMaskBack = 0xffff;
        this.stencilFailOpBack = StencilOp.KEEP;
        this.stencilZFailOpBack = StencilOp.KEEP;
        this.stencilPassOpBack = StencilOp.KEEP;
        this.stencilRefBack = 1;
    }

    public assign (dss: DepthStencilState): void {
        Object.assign(this, dss);
    }

    public destroy (): void {}
}

/**
 * @en GFX blend target.
 * @zh GFX 混合目标。
 */
export class BlendTarget {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public blend: boolean = false,
        public blendSrc: BlendFactor = BlendFactor.ONE,
        public blendDst: BlendFactor = BlendFactor.ZERO,
        public blendEq: BlendOp = BlendOp.ADD,
        public blendSrcAlpha: BlendFactor = BlendFactor.ONE,
        public blendDstAlpha: BlendFactor = BlendFactor.ZERO,
        public blendAlphaEq: BlendOp = BlendOp.ADD,
        public blendColorMask: ColorMask = ColorMask.ALL,
    ) {}

    public reset (): void {
        this.blend = false;
        this.blendSrc = BlendFactor.ONE;
        this.blendDst = BlendFactor.ZERO;
        this.blendEq = BlendOp.ADD;
        this.blendSrcAlpha = BlendFactor.ONE;
        this.blendDstAlpha = BlendFactor.ZERO;
        this.blendAlphaEq = BlendOp.ADD;
        this.blendColorMask = ColorMask.ALL;
    }

    public assign (target: BlendTarget): void {
        Object.assign(this, target);
    }

    public destroy (): void {}
}

/**
 * @en GFX blend state.
 * @zh GFX 混合状态。
 */
export class BlendState {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    get native (): BlendState {
        return this;
    }

    constructor (
        public isA2C: boolean = false,
        public isIndepend: boolean = false,
        public blendColor: Color = new Color(),
        public targets: BlendTarget[] = [new BlendTarget()],
    ) {}

    /**
     * @en Should use this function to set target, or it will not work
     * on native platforms, as native can not support this feature,
     * such as `blendState[i] = target;`.
     *
     * @param index The index to set target.
     * @param target The target to be set.
     */
    public setTarget (index: number, target: BlendTarget): void {
        let tg = this.targets[index];
        if (!tg) {
            tg = this.targets[index] = new BlendTarget();
        }
        Object.assign(tg, target);
    }

    public reset (): void {
        this.isA2C = false;
        this.isIndepend = false;
        this.blendColor.x = 0;
        this.blendColor.y = 0;
        this.blendColor.z = 0;
        this.blendColor.w = 0;
        this.targets.length = 1;
        this.targets[0].reset();
    }

    public destroy (): void {}
}
