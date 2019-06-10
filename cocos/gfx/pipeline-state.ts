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
} from './define';
import { GFXDevice } from './device';
import { IGFXAttribute } from './input-assembler';
import { GFXPipelineLayout } from './pipeline-layout';
import { GFXRenderPass } from './render-pass';
import { GFXShader } from './shader';

/**
 * @zh
 * GFX光栅化状态
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

    /**
     * @zh
     * 比较函数
     * @param state GFX光栅化状态
     */
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
 * @zh
 * GFX深度模板状态
 */
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

    /**
     * @zh
     * 比较函数
     * @param state GFX深度模板状态
     */
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
 * @zh
 * GFX混合目标
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

    /**
     * @zh
     * 比较函数
     * @param target GFX混合目标
     */
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
 * @zh
 * GFX混合状态
 */
export class GFXBlendState {
    public isA2C: boolean = false;
    public isIndepend: boolean = false;
    public blendColor: number[] = [0, 0, 0, 0];
    public targets: GFXBlendTarget[] = [new GFXBlendTarget()];
}

/**
 * @zh
 * GFX输入状态
 */
export class GFXInputState {
    public attributes: IGFXAttribute[] = [];
}

/**
 * @zh
 * GFX管线状态描述信息
 */
export interface IGFXPipelineStateInfo {
    primitive: GFXPrimitiveMode;
    shader: GFXShader;
    is: GFXInputState;
    rs: GFXRasterizerState;
    dss: GFXDepthStencilState;
    bs: GFXBlendState;
    dynamicStates?: GFXDynamicState[];
    layout: GFXPipelineLayout;
    renderPass: GFXRenderPass;
}

/**
 * @zh
 * GFX管线状态
 */
export abstract class GFXPipelineState extends GFXObject {

    /**
     * @zh
     * GFX着色器
     */
    public get shader (): GFXShader {
        return  this._shader as GFXShader;
    }

    /**
     * @zh
     * GFX图元模式
     */
    public get primitive (): GFXPrimitiveMode {
        return this._primitive;
    }

    /**
     * @zh
     * GFX光栅化状态
     */
    public get rasterizerState (): GFXRasterizerState {
        return  this._rs as GFXRasterizerState;
    }

    /**
     * @zh
     * GFX深度模板状态
     */
    public get depthStencilState (): GFXDepthStencilState {
        return  this._dss as GFXDepthStencilState;
    }

    /**
     * @zh
     * GFX混合状态
     */
    public get blendState (): GFXBlendState {
        return  this._bs as GFXBlendState;
    }

    /**
     * @zh
     * GFX动态状态数组
     */
    public get dynamicStates (): GFXDynamicState[] {
        return this._dynamicStates;
    }

    /**
     * @zh
     * GFX管线布局
     */
    public get pipelineLayout (): GFXPipelineLayout {
        return this._layout as GFXPipelineLayout;
    }

    /**
     * @zh
     * GFX渲染过程
     */
    public get renderPass (): GFXRenderPass {
        return this._renderPass as GFXRenderPass;
    }

    /**
     * @zh
     * GFX设备
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * GFX着色器
     */
    protected _shader: GFXShader | null = null;

    /**
     * @zh
     * GFX图元模式
     */
    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;

    /**
     * @zh
     * GFX输入状态
     */
    protected _is: GFXInputState | null = null;

    /**
     * @zh
     * GFX光栅化状态
     */
    protected _rs: GFXRasterizerState | null = null;

    /**
     * @zh
     * GFX深度模板状态
     */
    protected _dss: GFXDepthStencilState | null = null;

    /**
     * @zh
     * GFX混合状态
     */
    protected _bs: GFXBlendState | null = null;

    /**
     * @zh
     * GFX动态状态数组
     */
    protected _dynamicStates: GFXDynamicState[] = [];

    /**
     * @zh
     * GFX管线布局
     */
    protected _layout: GFXPipelineLayout | null = null;

    /**
     * @zh
     * GFX渲染过程
     */
    protected _renderPass: GFXRenderPass | null = null;

    /**
     * @zh
     * 构造函数
     * @param device GFX设备
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.PIPELINE_STATE);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数
     * @param info GFX管线状态描述信息
     */
    public abstract initialize (info: IGFXPipelineStateInfo): boolean;

    /**
     * @zh
     * 销毁函数
     */
    public abstract destroy (): void;
}
