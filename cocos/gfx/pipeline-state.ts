import { GFXBlendFactor, GFXBlendOp, GFXColorMask, GFXComparisonFunc, GFXCullMode, GFXObject, GFXObjectType, GFXPolygonMode, GFXPrimitiveMode, GFXShadeModel, GFXStencilOp } from './define';
import { GFXDevice } from './device';
import { IGFXInputAttribute } from './input-assembler';
import { GFXPipelineLayout } from './pipeline-layout';
import { GFXRenderPass } from './render-pass';
import { GFXShader } from './shader';

export class GFXRasterizerState {
    public isDiscard: boolean = false;
    public polygonMode: GFXPolygonMode = GFXPolygonMode.FILL;
    public shadeModel: GFXShadeModel = GFXShadeModel.GOURAND;
    public cullMode: GFXCullMode = GFXCullMode.BACK;
    public isFrontFaceCCW: boolean = true;
    public depthBias: number = 0.0;
    public depthBiasFactor: number = 0.0;
    public isDepthClip: boolean = true;
    public isMultisample: boolean = false;
    // lineWidth: number = 1.0;

    public compare (state: GFXRasterizerState): boolean {
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
}

export class GFXDepthStencilState {
    public depthTest: boolean = true;
    public depthWrite: boolean = true;
    public depthFunc: GFXComparisonFunc = GFXComparisonFunc.LESS;
    public stencilTestFront: boolean = false;
    public stencilFuncFront: GFXComparisonFunc = GFXComparisonFunc.ALWAYS;
    public stencilReadMaskFront: number = 0xffffffff;
    public stencilWriteMaskFront: number = 0xffffffff;
    public stencilFailOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilZFailOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilPassOpFront: GFXStencilOp = GFXStencilOp.KEEP;
    public stencilRefFront: number = 1;
    public stencilTestBack: boolean = false;
    public stencilFuncBack: GFXComparisonFunc = GFXComparisonFunc.ALWAYS;
    public stencilReadMaskBack: number = 0xffffffff;
    public stencilWriteMaskBack: number = 0xffffffff;
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

export class GFXBlendTarget {
    public blend: boolean = false;
    public blendSrc: GFXBlendFactor = GFXBlendFactor.ONE;
    public blendDst: GFXBlendFactor = GFXBlendFactor.ZERO;
    public blendEq: GFXBlendOp = GFXBlendOp.ADD;
    public blendSrcAlpha: GFXBlendFactor = GFXBlendFactor.ONE;
    public blendDstAlpha: GFXBlendFactor = GFXBlendFactor.ZERO;
    public blendAlphaEq: GFXBlendOp = GFXBlendOp.ADD;
    public blendColorMask: GFXColorMask = GFXColorMask.ALL;

    public compare (state: GFXBlendTarget): boolean {
        return (this.blend === state.blend) &&
            (this.blendSrc === state.blendSrc) &&
            (this.blendDst === state.blendDst) &&
            (this.blendEq === state.blendEq) &&
            (this.blendSrcAlpha === state.blendSrcAlpha) &&
            (this.blendDstAlpha === state.blendDstAlpha) &&
            (this.blendAlphaEq === state.blendAlphaEq) &&
            (this.blendColorMask === state.blendColorMask);
    }
}

export class GFXBlendState {
    public isA2C: boolean = false;
    public isIndepend: boolean = false;
    public blendColor: number[] = [0, 0, 0, 0];
    public targets: GFXBlendTarget[] = [new GFXBlendTarget()];
}

export class GFXInputState {
    public attributes: IGFXInputAttribute[] = [];
}

export interface IGFXPipelineStateInfo {
    primitive: GFXPrimitiveMode;
    shader: GFXShader;
    is: GFXInputState;
    rs: GFXRasterizerState;
    dss: GFXDepthStencilState;
    bs: GFXBlendState;
    layout: GFXPipelineLayout;
    renderPass: GFXRenderPass;
}

export abstract class GFXPipelineState extends GFXObject {

    public get shader (): GFXShader {
        return  this._shader as GFXShader;
    }

    public get primitive (): GFXPrimitiveMode {
        return this._primitive;
    }

    public get rasterizerState (): GFXRasterizerState {
        return  this._rs as GFXRasterizerState;
    }

    public get depthStencilState (): GFXDepthStencilState {
        return  this._dss as GFXDepthStencilState;
    }

    public get blendState (): GFXBlendState {
        return  this._bs as GFXBlendState;
    }

    public get pipelineLayout (): GFXPipelineLayout {
        return  this._layout as GFXPipelineLayout;
    }

    public get renderPass (): GFXRenderPass {
        return  this._renderPass as GFXRenderPass;
    }

    protected _device: GFXDevice;
    protected _shader: GFXShader | null = null;
    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
    protected _is: GFXInputState | null = null;
    protected _rs: GFXRasterizerState | null = null;
    protected _dss: GFXDepthStencilState | null = null;
    protected _bs: GFXBlendState | null = null;
    protected _layout: GFXPipelineLayout | null = null;
    protected _renderPass: GFXRenderPass | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.PIPELINE_STATE);
        this._device = device;
    }

    public abstract initialize (info: IGFXPipelineStateInfo): boolean;
    public abstract destroy (): void;
}
