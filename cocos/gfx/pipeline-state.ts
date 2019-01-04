import { GFXDevice } from './device';
import { GFXShader } from './shader';
import { GFXRenderPass } from './render-pass';
import { GFXPipelineLayout } from './pipeline-layout';
import { GFXInputAttribute } from './input-assembler';
import { GFXPolygonMode, GFXShadeModel, GFXCullMode, GFXComparisonFunc, GFXStencilOp, GFXBlendFactor, GFXBlendOp, GFXColorMask, GFXPrimitiveMode } from './define';

export class GFXRasterizerState {
    isDiscard: boolean = false;
    polygonMode: GFXPolygonMode = GFXPolygonMode.FILL;
    shadeModel: GFXShadeModel = GFXShadeModel.GOURAND;
    cullMode: GFXCullMode = GFXCullMode.BACK;
    isFrontFaceCCW: boolean = true;
    depthBias: number = 0.0;
    depthBiasFactor: number = 0.0;
    isDepthClip: boolean = true;
    isMultisample: boolean = false;
    // lineWidth: number = 1.0;

    public compare(state: GFXRasterizerState): boolean {
        return (this.isDiscard === state.isDiscard) &&
            (this.polygonMode === state.polygonMode) &&
            (this.shadeModel === state.shadeModel) &&
            (this.cullMode === state.cullMode) &&
            (this.isFrontFaceCCW === state.isFrontFaceCCW) &&
            (this.depthBias === state.depthBias) &&
            (this.depthBiasFactor === state.depthBiasFactor) &&
            (this.isDepthClip === state.isDepthClip) &&
            // (this.lineWidth === state.lineWidth) &&
            (this.isMultisample === state.isMultisample);
    }
};

export class GFXDepthStencilState {
    depthTest: boolean = true;
    depthWrite: boolean = true;
    depthFunc: GFXComparisonFunc = GFXComparisonFunc.LESS;
    stencilTestFront: boolean = false;
    stencilFuncFront: GFXComparisonFunc = GFXComparisonFunc.ALWAYS;
    stencilReadMaskFront: number = 0xffffffff;
    stencilWriteMaskFront: number = 0xffffffff;
    stencilFailOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    stencilZFailOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    stencilPassOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    stencilRefFront: number = 1;
    stencilTestBack: boolean = false;
    stencilFuncBack: GFXComparisonFunc = GFXComparisonFunc.ALWAYS;
    stencilReadMaskBack: number = 0xffffffff;
    stencilWriteMaskBack: number = 0xffffffff;
    stencilFailOpBack: GFXStencilOp = GFXStencilOp.KEEP;
    stencilZFailOpBack: GFXStencilOp = GFXStencilOp.KEEP;
    stencilPassOpBack: GFXStencilOp = GFXStencilOp.KEEP;
    stencilRefBack: number = 1;

    public compare(state: GFXDepthStencilState): boolean {
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
};

export class GFXBlendTarget {
    blend: boolean = false;
    blendSrc: GFXBlendFactor = GFXBlendFactor.ONE;
    blendDst: GFXBlendFactor = GFXBlendFactor.ZERO;
    blendEq: GFXBlendOp = GFXBlendOp.ADD;
    blendSrcAlpha: GFXBlendFactor = GFXBlendFactor.ONE;
    blendDstAlpha: GFXBlendFactor = GFXBlendFactor.ZERO;
    blendAlphaEq: GFXBlendOp = GFXBlendOp.ADD;
    blendColorMask: GFXColorMask = GFXColorMask.ALL;

    public compare(state: GFXBlendTarget): boolean {
        return (this.blend === state.blend) &&
            (this.blendSrc === state.blendSrc) &&
            (this.blendDst === state.blendDst) &&
            (this.blendEq === state.blendEq) &&
            (this.blendSrcAlpha === state.blendSrcAlpha) &&
            (this.blendDstAlpha === state.blendDstAlpha) &&
            (this.blendAlphaEq === state.blendAlphaEq) &&
            (this.blendColorMask === state.blendColorMask);
    }
};

export class GFXBlendState {
    isA2C: boolean = false;
    isIndepend: boolean = false;
    blendColor: number[] = [0, 0, 0, 0];
    targets: GFXBlendTarget[] = [new GFXBlendTarget];
}

export class GFXInputState {
    attributes: GFXInputAttribute[] = [];
};

export interface GFXPipelineStateInfo {
    primitive: GFXPrimitiveMode;
    shader: GFXShader;
    is: GFXInputState;
    rs: GFXRasterizerState;
    dss: GFXDepthStencilState;
    bs: GFXBlendState;
    layout: GFXPipelineLayout;
    renderPass: GFXRenderPass;
};

export abstract class GFXPipelineState {

    constructor(device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info: GFXPipelineStateInfo): boolean;
    public abstract destroy(): void;

    protected _device: GFXDevice;
    protected _shader: GFXShader | null = null;
    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
    protected _is: GFXInputState | null = null;
    protected _rs: GFXRasterizerState | null = null;
    protected _dss: GFXDepthStencilState | null = null;
    protected _bs: GFXBlendState | null = null;
    protected _layout: GFXPipelineLayout | null = null;
    protected _renderPass: GFXRenderPass | null = null;
};
