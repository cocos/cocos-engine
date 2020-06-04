/**
 * @category gfx
 */

import {
    GFXBlendFactor,
    GFXBlendOp,
    GFXColorMask,
    GFXComparisonFunc,
    GFXCullMode,
    GFXDynamicState,
    GFXObject,
    GFXObjectType,
    GFXPolygonMode,
    GFXPrimitiveMode,
    GFXShadeModel,
    GFXStencilOp,
    IGFXColor,
} from './define';
import { GFXDevice } from './device';
import { IGFXAttribute, GFXInputAssembler } from './input-assembler';
import { GFXPipelineLayout } from './pipeline-layout';
import { GFXRenderPass } from './render-pass';
import { GFXShader } from './shader';

/**
 * @en GFX rasterizer state.
 * @zh GFX 光栅化状态。
 */
export class GFXRasterizerState {
    public isDiscard: boolean = false;
    public polygonMode: GFXPolygonMode = GFXPolygonMode.FILL;
    public shadeModel: GFXShadeModel = GFXShadeModel.GOURAND;
    public cullMode: GFXCullMode = GFXCullMode.BACK;
    public isFrontFaceCCW: boolean = true;
    public depthBias: number = 0;
    public depthBiasClamp: number = 0.0;
    public depthBiasSlop: number = 0.0;
    public isDepthClip: boolean = true;
    public isMultisample: boolean = false;
    public lineWidth: number = 1.0;

    public compare (state: GFXRasterizerState): boolean {
        return (this.isDiscard === state.isDiscard) &&
            (this.polygonMode === state.polygonMode) &&
            (this.shadeModel === state.shadeModel) &&
            (this.cullMode === state.cullMode) &&
            (this.isFrontFaceCCW === state.isFrontFaceCCW) &&
            (this.depthBias === state.depthBias) &&
            (this.depthBiasClamp === state.depthBiasClamp) &&
            (this.depthBiasSlop === state.depthBiasSlop) &&
            (this.isDepthClip === state.isDepthClip) &&
            (this.lineWidth === state.lineWidth) &&
            (this.isMultisample === state.isMultisample);
    }
}

/**
 * @en GFX depth stencil state.
 * @zh GFX 深度模板状态。
 */
export class GFXDepthStencilState {
    public depthTest: boolean = true;
    public depthWrite: boolean = true;
    public depthFunc: GFXComparisonFunc = GFXComparisonFunc.LESS;
    public stencilTestFront: boolean = false;
    public stencilFuncFront: GFXComparisonFunc = GFXComparisonFunc.ALWAYS;
    public stencilReadMaskFront: number = 0xffff;
    public stencilWriteMaskFront: number = 0xffff;
    public stencilFailOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilZFailOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilPassOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilRefFront: number = 1;
    public stencilTestBack: boolean = false;
    public stencilFuncBack: GFXComparisonFunc = GFXComparisonFunc.ALWAYS;
    public stencilReadMaskBack: number = 0xffff;
    public stencilWriteMaskBack: number = 0xffff;
    public stencilFailOpBack: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilZFailOpBack: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilPassOpBack: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilRefBack: number = 1;

    public compare (state: GFXDepthStencilState): boolean {
        return (this.depthTest === state.depthTest) &&
            (this.depthWrite === state.depthWrite) &&
            (this.depthFunc === state.depthFunc) &&
            (this.stencilTestFront === state.stencilTestFront) &&
            (this.stencilFuncFront === state.stencilFuncFront) &&
            (this.stencilReadMaskFront === state.stencilReadMaskFront) &&
            (this.stencilWriteMaskFront === state.stencilWriteMaskFront) &&
            (this.stencilFailOpFront === state.stencilFailOpFront) &&
            (this.stencilZFailOpFront === state.stencilZFailOpFront) &&
            (this.stencilPassOpFront === state.stencilPassOpFront) &&
            (this.stencilRefFront === state.stencilRefFront) &&
            (this.stencilTestBack === state.stencilTestBack) &&
            (this.stencilFuncBack === state.stencilFuncBack) &&
            (this.stencilReadMaskBack === state.stencilReadMaskBack) &&
            (this.stencilWriteMaskBack === state.stencilWriteMaskBack) &&
            (this.stencilFailOpBack === state.stencilFailOpBack) &&
            (this.stencilZFailOpBack === state.stencilZFailOpBack) &&
            (this.stencilPassOpBack === state.stencilPassOpBack) &&
            (this.stencilRefBack === state.stencilRefBack);
    }
}

/**
 * @en GFX blend target.
 * @zh GFX 混合目标。
 */
export class GFXBlendTarget {
    public blend: boolean = false;
    public blendSrc: GFXBlendFactor = GFXBlendFactor.ONE;
    public blendDst: GFXBlendFactor = GFXBlendFactor.ZERO;
    public blendEq: GFXBlendOp = GFXBlendOp.ADD;
    public blendSrcAlpha: GFXBlendFactor = GFXBlendFactor.ONE;
    public blendDstAlpha: GFXBlendFactor = GFXBlendFactor.ZERO;
    public blendAlphaEq: GFXBlendOp = GFXBlendOp.ADD;
    public blendColorMask: GFXColorMask = GFXColorMask.ALL;

    public compare (target: GFXBlendTarget): boolean {
        return (this.blend === target.blend) &&
            (this.blendSrc === target.blendSrc) &&
            (this.blendDst === target.blendDst) &&
            (this.blendEq === target.blendEq) &&
            (this.blendSrcAlpha === target.blendSrcAlpha) &&
            (this.blendDstAlpha === target.blendDstAlpha) &&
            (this.blendAlphaEq === target.blendAlphaEq) &&
            (this.blendColorMask === target.blendColorMask);
    }
}

/**
 * @en GFX blend state.
 * @zh GFX混合状态。
 */
export class GFXBlendState {
    public isA2C: boolean = false;
    public isIndepend: boolean = false;
    public blendColor: IGFXColor = { r: 0, g: 0, b: 0, a: 0 };
    public targets: GFXBlendTarget[] = [new GFXBlendTarget()];
}

/**
 * @en GFX input state.
 * @zh GFX 输入状态。
 */
export class GFXInputState {
    public attributes: IGFXAttribute[] = [];
}

export interface IGFXPipelineStateInfo {
    primitive: GFXPrimitiveMode;
    shader: GFXShader;
    inputState: GFXInputState;
    rasterizerState: GFXRasterizerState;
    depthStencilState: GFXDepthStencilState;
    blendState: GFXBlendState;
    dynamicStates?: GFXDynamicState[];
    layout: GFXPipelineLayout;
    renderPass: GFXRenderPass;
    hash: number;
}

/**
 * @en GFX pipeline state.
 * @zh GFX 管线状态。
 */
export abstract class GFXPipelineState extends GFXObject {

    /**
     * @en Get current shader.
     * @zh GFX 着色器。
     */
    get shader (): GFXShader {
        return  this._shader as GFXShader;
    }

    /**
     * @en Get current primitve mode.
     * @zh GFX 图元模式。
     */
    get primitive (): GFXPrimitiveMode {
        return this._primitive;
    }

    /**
     * @en Get current rasterizer state.
     * @zh GFX 光栅化状态。
     */
    get rasterizerState (): GFXRasterizerState {
        return  this._rs as GFXRasterizerState;
    }

    /**
     * @en Get current depth stencil state.
     * @zh GFX 深度模板状态。
     */
    get depthStencilState (): GFXDepthStencilState {
        return  this._dss as GFXDepthStencilState;
    }

    /**
     * @en Get current blend state.
     * @zh GFX 混合状态。
     */
    get blendState (): GFXBlendState {
        return  this._bs as GFXBlendState;
    }

    /**
     * @en Get current input state.
     * @zh GFX 输入状态。
     */
    get inputState (): GFXInputState {
        return this._is as GFXInputState;
    }

    /**
     * @en Get current dynamic states.
     * @zh GFX 动态状态数组。
     */
    get dynamicStates (): GFXDynamicState[] {
        return this._dynamicStates;
    }

    /**
     * @en Get current pipeline layout.
     * @zh GFX 管线布局。
     */
    get pipelineLayout (): GFXPipelineLayout {
        return this._layout as GFXPipelineLayout;
    }

    /**
     * @en Get current render pass.
     * @zh GFX 渲染过程。
     */
    get renderPass (): GFXRenderPass {
        return this._renderPass as GFXRenderPass;
    }

    /**
     * @en Get current hash.
     * @zh 此管线状态的 hash。
     */
    get hash (): number {
        return this._hash;
    }

    protected _device: GFXDevice;

    protected _shader: GFXShader | null = null;

    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;

    protected _is: GFXInputState | null = null;

    protected _rs: GFXRasterizerState | null = null;

    protected _dss: GFXDepthStencilState | null = null;

    protected _bs: GFXBlendState | null = null;

    protected _dynamicStates: GFXDynamicState[] = [];

    protected _layout: GFXPipelineLayout | null = null;

    protected _renderPass: GFXRenderPass | null = null;

    protected _hash: number = 0;

    constructor (device: GFXDevice) {
        super(GFXObjectType.PIPELINE_STATE);
        this._device = device;
    }

    public abstract initialize (info: IGFXPipelineStateInfo): boolean;

    public abstract destroy (): void;
}
