/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module gfx
 */

import { PipelineLayout } from './pipeline-layout';
import { RenderPass } from './render-pass';
import { Shader } from './shader';
import {
    BlendFactor,
    BlendOp,
    ColorMask,
    ComparisonFunc,
    CullMode,
    DynamicStateFlagBit,
    DynamicStateFlags,
    GFXObject,
    ObjectType,
    PolygonMode,
    PrimitiveMode,
    ShadeModel,
    StencilOp,
    InputState,
    Color,
    PipelineBindPoint,
} from './define';

/**
 * @en GFX rasterizer state.
 * @zh GFX 光栅化状态。
 */
export class RasterizerState {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    get native () {
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

    public reset () {
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

    public assign (rs: RasterizerState) {
        Object.assign(this, rs);
    }

    public destroy () {}
}

/**
 * @en GFX depth stencil state.
 * @zh GFX 深度模板状态。
 */
export class DepthStencilState {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    get native () {
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

    public reset () {
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

    public assign (dss: DepthStencilState) {
        Object.assign(this, dss);
    }

    public destroy () {}
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

    public reset () {
        this.blend = false;
        this.blendSrc = BlendFactor.ONE;
        this.blendDst = BlendFactor.ZERO;
        this.blendEq = BlendOp.ADD;
        this.blendSrcAlpha = BlendFactor.ONE;
        this.blendDstAlpha = BlendFactor.ZERO;
        this.blendAlphaEq = BlendOp.ADD;
        this.blendColorMask = ColorMask.ALL;
    }

    public assign (target: BlendTarget) {
        Object.assign(this, target);
    }

    public destroy () {}
}

/**
 * @en GFX blend state.
 * @zh GFX 混合状态。
 */
export class BlendState {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    get native () {
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
    public setTarget (index: number, target: BlendTarget) {
        let tg = this.targets[index];
        if (!tg) {
            tg = this.targets[index] = new BlendTarget();
        }
        Object.assign(tg, target);
    }

    public reset () {
        this.isA2C = false;
        this.isIndepend = false;
        this.blendColor.x = 0;
        this.blendColor.y = 0;
        this.blendColor.z = 0;
        this.blendColor.w = 0;
        this.targets.length = 1;
        this.targets[0].reset();
    }

    public destroy () {}
}

export class PipelineStateInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public shader: Shader = null!,
        public pipelineLayout: PipelineLayout = null!,
        public renderPass: RenderPass = null!,
        public inputState: InputState = new InputState(),
        public rasterizerState: RasterizerState = new RasterizerState(),
        public depthStencilState: DepthStencilState = new DepthStencilState(),
        public blendState: BlendState = new BlendState(),
        public primitive: PrimitiveMode = PrimitiveMode.TRIANGLE_LIST,
        public dynamicStates: DynamicStateFlags = DynamicStateFlagBit.NONE,
        public bindPoint: PipelineBindPoint = PipelineBindPoint.GRAPHICS,
    ) {}
}

/**
 * @en GFX pipeline state.
 * @zh GFX 管线状态。
 */
export abstract class PipelineState extends GFXObject {
    /**
     * @en Get current shader.
     * @zh GFX 着色器。
     */
    get shader (): Shader {
        return this._shader!;
    }

    /**
     * @en Get current pipeline layout.
     * @zh GFX 管线布局。
     */
    get pipelineLayout (): PipelineLayout {
        return this._pipelineLayout!;
    }

    /**
     * @en Get current primitve mode.
     * @zh GFX 图元模式。
     */
    get primitive (): PrimitiveMode {
        return this._primitive;
    }

    /**
     * @en Get current rasterizer state.
     * @zh GFX 光栅化状态。
     */
    get rasterizerState (): RasterizerState {
        return this._rs;
    }

    /**
     * @en Get current depth stencil state.
     * @zh GFX 深度模板状态。
     */
    get depthStencilState (): DepthStencilState {
        return this._dss;
    }

    /**
     * @en Get current blend state.
     * @zh GFX 混合状态。
     */
    get blendState (): BlendState {
        return this._bs;
    }

    /**
     * @en Get current input state.
     * @zh GFX 输入状态。
     */
    get inputState (): InputState {
        return this._is as InputState;
    }

    /**
     * @en Get current dynamic states.
     * @zh GFX 动态状态数组。
     */
    get dynamicStates (): DynamicStateFlags {
        return this._dynamicStates;
    }

    /**
     * @en Get current render pass.
     * @zh GFX 渲染过程。
     */
    get renderPass (): RenderPass {
        return this._renderPass as RenderPass;
    }

    protected _shader: Shader | null = null;
    protected _pipelineLayout: PipelineLayout | null = null;
    protected _primitive: PrimitiveMode = PrimitiveMode.TRIANGLE_LIST;
    protected _is: InputState | null = null;
    protected _rs: RasterizerState = new RasterizerState();
    protected _dss: DepthStencilState = new DepthStencilState();
    protected _bs: BlendState = new BlendState();
    protected _dynamicStates: DynamicStateFlags = DynamicStateFlagBit.NONE;
    protected _renderPass: RenderPass | null = null;

    constructor () {
        super(ObjectType.PIPELINE_STATE);
    }

    public abstract initialize (info: Readonly<PipelineStateInfo>): void;

    public abstract destroy (): void;
}
