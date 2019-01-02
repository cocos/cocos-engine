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
    isDepthTest: boolean = true;
    isWriteDepth: boolean = true;
    depthFunc: GFXComparisonFunc = GFXComparisonFunc.LESS;
    isFrontStencilTest: boolean = false;
    frontStencilFunc: GFXComparisonFunc = GFXComparisonFunc.ALWAYS;
    frontStencilReadMask: number = 0xffffffff;
    frontStencilWriteMask: number = 0xffffffff;
    frontStencilFailOp: GFXStencilOp = GFXStencilOp.KEEP;
    frontStencilDepthFailOp: GFXStencilOp = GFXStencilOp.KEEP;
    frontStencilPassOp: GFXStencilOp = GFXStencilOp.KEEP;
    frontStencilRef: number = 1;
    isBackStencilTest: boolean = false;
    backStencilFunc: GFXComparisonFunc = GFXComparisonFunc.ALWAYS;
    backStencilReadMask: number = 0xffffffff;
    backStencilWriteMask: number = 0xffffffff;
    backStencilFailOp: GFXStencilOp = GFXStencilOp.KEEP;
    backStencilDepthFailOp: GFXStencilOp = GFXStencilOp.KEEP;
    backStencilPassOp: GFXStencilOp = GFXStencilOp.KEEP;
    backStencilRef: number = 1;

    public compare(state: GFXDepthStencilState): boolean {
        return (this.isDepthTest === state.isDepthTest) &&
            (this.isWriteDepth === state.isWriteDepth) &&
            (this.depthFunc === state.depthFunc) &&
            (this.isFrontStencilTest === state.isFrontStencilTest) &&
            (this.frontStencilFunc === state.frontStencilFunc) &&
            (this.frontStencilReadMask === state.frontStencilReadMask) &&
            (this.frontStencilWriteMask === state.frontStencilWriteMask) &&
            (this.frontStencilFailOp === state.frontStencilFailOp) &&
            (this.frontStencilDepthFailOp === state.frontStencilDepthFailOp) &&
            (this.frontStencilPassOp === state.frontStencilPassOp) &&
            (this.frontStencilRef === state.frontStencilRef) &&
            (this.isBackStencilTest === state.isBackStencilTest) &&
            (this.backStencilFunc === state.backStencilFunc) &&
            (this.backStencilReadMask === state.backStencilReadMask) &&
            (this.backStencilWriteMask === state.backStencilWriteMask) &&
            (this.backStencilFailOp === state.backStencilFailOp) &&
            (this.backStencilDepthFailOp === state.backStencilDepthFailOp) &&
            (this.backStencilPassOp === state.backStencilPassOp) &&
            (this.backStencilRef === state.backStencilRef);
    }
};

export class GFXBlendTarget {
    isBlend: boolean = false;
    srcBlend: GFXBlendFactor = GFXBlendFactor.ONE;
    dstBlend: GFXBlendFactor = GFXBlendFactor.ZERO;
    blendOp: GFXBlendOp = GFXBlendOp.ADD;
    srcAlphaBlend: GFXBlendFactor = GFXBlendFactor.ONE;
    dstAlphaBlend: GFXBlendFactor = GFXBlendFactor.ZERO;
    alphBlendOp: GFXBlendOp = GFXBlendOp.ADD;
    colorWriteMask: GFXColorMask = GFXColorMask.ALL;

    public compare(state: GFXBlendTarget): boolean {
        return (this.isBlend === state.isBlend) &&
            (this.srcBlend === state.srcBlend) &&
            (this.dstBlend === state.dstBlend) &&
            (this.blendOp === state.blendOp) &&
            (this.srcAlphaBlend === state.srcAlphaBlend) &&
            (this.dstAlphaBlend === state.dstAlphaBlend) &&
            (this.alphBlendOp === state.alphBlendOp) &&
            (this.colorWriteMask === state.colorWriteMask);
    }
};

export class GFXBlendState {
    isA2C: boolean = false;
    isIndepend: boolean = false;
    factor: number[] = [0, 0, 0, 0];
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
