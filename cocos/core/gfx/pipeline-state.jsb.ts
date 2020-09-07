/**
 * @category gfx
 */

import {
    GFXDynamicStateFlags,
    GFXObject,
    GFXObjectType,
    GFXPrimitiveMode,
    GFXDynamicStateFlagBit,
} from './define';
import { GFXDevice } from './device';
import { IGFXAttribute } from './input-assembler';
import { GFXRenderPass } from './render-pass';
import { GFXShader } from './shader';
import { GFXPipelineLayout } from '..';

export const GFXRasterizerState = gfx.RasterizerState;
export const GFXDepthStencilState = gfx.DepthStencilState;
export const GFXBlendTarget = gfx.BlendTarget;
export const GFXBlendState = gfx.BlendState;

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
    pipelineLayout: GFXPipelineLayout;
    inputState: GFXInputState;
    rasterizerState: GFXRasterizerState;
    depthStencilState: GFXDepthStencilState;
    blendState: GFXBlendState;
    dynamicStates?: GFXDynamicStateFlags;
    renderPass: GFXRenderPass;
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
        return this._shader!;
    }

    /**
     * @en Get current pipeline layout.
     * @zh GFX 管线布局。
     */
    get pipelineLayout (): GFXPipelineLayout {
        return this._pipelineLayout!;
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
    get dynamicStates (): GFXDynamicStateFlags {
        return this._dynamicStates;
    }

    /**
     * @en Get current render pass.
     * @zh GFX 渲染过程。
     */
    get renderPass (): GFXRenderPass {
        return this._renderPass as GFXRenderPass;
    }

    protected _device: GFXDevice;

    protected _shader: GFXShader | null = null;

    protected _pipelineLayout: GFXPipelineLayout | null = null;

    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;

    protected _is: GFXInputState | null = null;

    protected _rs: GFXRasterizerState | null = null;

    protected _dss: GFXDepthStencilState | null = null;

    protected _bs: GFXBlendState | null = null;

    protected _dynamicStates: GFXDynamicStateFlags = GFXDynamicStateFlagBit.NONE;

    protected _renderPass: GFXRenderPass | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.PIPELINE_STATE);
        this._device = device;
    }

    public abstract initialize (info: IGFXPipelineStateInfo): boolean;

    public abstract destroy (): void;
}
