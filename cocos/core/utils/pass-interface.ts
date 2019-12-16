import { IProgramInfo, programLib } from '../../core/renderer/core/program-lib';
import { IPassInfo, IPropertyInfo } from '../assets/effect-asset';
import { GFXBuffer, GFXDevice, GFXDynamicState, GFXPipelineState, GFXPrimitiveMode, GFXRenderPass, GFXSampler, GFXShader, GFXTextureView, GFXType } from '../gfx';
import { IGFXBinding } from '../gfx/binding-layout';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../gfx/pipeline-state';
import { BatchedBuffer } from '../pipeline/batched-buffer';
import { RenderPassStage, RenderPriority } from '../pipeline/define';
import { IDefineMap, PassOverrides } from '../renderer/core/pass';
import { murmurhash2_32_gc } from './murmurhash2_gc';

export interface IBlock {
    buffer: ArrayBuffer;
    view: Float32Array;
    dirty: boolean;
}

export interface IPassDynamics {
    [type: number]: {
        dirty: boolean,
        value: number[],
    };
}

export interface IPSOHashInfo {
    program: string;
    defines: IDefineMap;
    stage: RenderPassStage;
    primitive: GFXPrimitiveMode;
    rasterizerState: GFXRasterizerState;
    depthStencilState: GFXDepthStencilState;
    blendState: GFXBlendState;
    dynamicStates: GFXDynamicState[];
}

function serializeBlendState (bs: GFXBlendState) {
    let res = `,bs,${bs.isA2C},${bs.blendColor}`;
    for (const t of bs.targets) {
        res += `,bt,${t.blend},${t.blendEq},${t.blendAlphaEq},${t.blendColorMask}`;
        res += `,${t.blendSrc},${t.blendDst},${t.blendSrcAlpha},${t.blendDstAlpha}`;
    }
    return res;
}

function serializeRasterizerState (rs: GFXRasterizerState) {
    const res = `,rs,${rs.cullMode},${rs.depthBias},${rs.isFrontFaceCCW}`;
    return res;
}

function serializeDepthStencilState (dss: GFXDepthStencilState) {
    let res = `,dss,${dss.depthTest},${dss.depthWrite},${dss.depthFunc}`;
    res += `,${dss.stencilTestFront},${dss.stencilFuncFront},${dss.stencilRefFront},${dss.stencilReadMaskFront}`;
    res += `,${dss.stencilFailOpFront},${dss.stencilZFailOpFront},${dss.stencilPassOpFront},${dss.stencilWriteMaskFront}`;
    res += `,${dss.stencilTestBack},${dss.stencilFuncBack},${dss.stencilRefBack},${dss.stencilReadMaskBack}`;
    res += `,${dss.stencilFailOpBack},${dss.stencilZFailOpBack},${dss.stencilPassOpBack},${dss.stencilWriteMaskBack}`;
    return res;
}

export function generatePassPSOHash (pass: IPass) {
    const shaderKey = programLib.getKey(pass.program, pass.defines);
    let res = `${shaderKey},${pass.stage},${pass.primitive}`;
    res += serializeBlendState(pass.blendState);
    res += serializeDepthStencilState(pass.depthStencilState);
    res += serializeRasterizerState(pass.rasterizerState);
    return murmurhash2_32_gc(res, 666);
}

export interface IPass {

    readonly parent: IPass | null;
    readonly psoHash: number;
    readonly batchedBuffer: BatchedBuffer | null;
    // states
    readonly priority: RenderPriority;
    readonly primitive: GFXPrimitiveMode;
    readonly stage: RenderPassStage;
    readonly rasterizerState: GFXRasterizerState;
    readonly depthStencilState: GFXDepthStencilState;
    readonly blendState: GFXBlendState;
    readonly dynamicStates: GFXDynamicState[];
    readonly customizations: string[];
    readonly phase: number;
    // infos
    readonly shaderInfo: IProgramInfo;
    readonly program: string;
    readonly properties: Record<string, IPropertyInfo>;
    readonly defines: IDefineMap;
    readonly idxInTech: number;
    // resources
    readonly device: GFXDevice;
    readonly bindings: IGFXBinding[];
    readonly shader: GFXShader;
    readonly renderPass: GFXRenderPass;
    readonly dynamics: IPassDynamics;
    readonly blocks: IBlock[];
    /**
     * @zh
     * 获取指定 UBO 成员，或其更具体分量的读写句柄。默认以成员自身的类型为目标读写类型（即读写时必须传入与成员类型相同的变量）。
     * @param name 目标 UBO 成员名
     * @param offset 目标分量在成员内的偏移量
     * @param targetType 目标读写类型，用于定制化在使用此句柄时，将以什么类型进行读写操作
     * @example
     * ```
     * // say 'pbrParams' is a uniform vec4
     * const hParams = pass.getHandle('pbrParams'); // get the default handle
     * pass.setUniform(hAlbedo, cc.v3(1, 0, 0)); // wrong! pbrParams.w is NaN now
     *
     * // say 'albedoScale' is a uniform vec4, and we only want to modify the w component in the form of a single float
     * const hThreshold = pass.getHandle('albedoScale', 3, cc.GFXType.FLOAT);
     * pass.setUniform(hThreshold, 0.5); // now, albedoScale.w = 0.5
     * ```
     */
    getHandle (name: string, offset?: number, targetType?: GFXType): number | undefined;

    /**
     * @zh
     * 获取指定 uniform 的 binding。
     * @param name 目标 uniform 名。
     */
    getBinding (name: string): number | undefined;

    /**
     * @zh
     * 设置指定普通向量类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle 目标 uniform 的 handle。
     * @param value 目标值。
     */
    setUniform (handle: number, value: any): void;

    /**
     * @zh
     * 获取指定普通向量类 uniform 的值。
     * @param handle 目标 uniform 的 handle。
     * @param out 输出向量。
     */
    getUniform (handle: number, out: any): any;

    /**
     * @zh
     * 设置指定数组类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle 目标 uniform 的 handle。
     * @param value 目标值。
     */
    setUniformArray (handle: number, value: any[]): void;

    /**
     * @zh
     * 绑定实际 [[GFXBuffer]] 到指定 binding。
     * @param binding 目标 UBO 的 binding。
     * @param value 目标 buffer。
     */
    bindBuffer (binding: number, value: GFXBuffer): void;

    /**
     * @zh
     * 绑定实际 [[GFXTextureView]] 到指定 binding。
     * @param binding 目标贴图类 uniform 的 binding。
     * @param value 目标 texture view。
     */
    bindTextureView (binding: number, value: GFXTextureView): void;

    /**
     * @zh
     * 绑定实际 [[GFXSampler]] 到指定 binding。
     * @param binding 目标贴图类 uniform 的 binding。
     * @param value 目标 sampler。
     */
    bindSampler (binding: number, value: GFXSampler): void;

    /**
     * @zh
     * 设置运行时 pass 内可动态更新的管线状态属性。
     * @param state 目标管线状态。
     * @param value 目标值。
     */
    setDynamicState (state: GFXDynamicState, value: any): void;

    /**
     * @zh
     * 重载当前所有管线状态。
     * @param original 原始管线状态。
     * @param value 管线状态重载值。
     */
    overridePipelineStates (original: IPassInfo, overrides: PassOverrides): void;

    /**
     * @zh
     * 更新当前 Uniform 数据。
     */
    update (): void;

    /**
     * @zh
     * 销毁当前 pass。
     */
    destroy (): void;

    /**
     * @zh
     * 重置所有 UBO 为初始默认值。
     */
    resetUBOs (): void;

    /**
     * @zh
     * 重置所有 texture 和 sampler 为初始默认值。
     */
    resetTextures (): void;

    /**
     * @zh
     * 尝试编译 shader 并获取相关资源引用。
     * @param defineOverrides shader 预处理宏定义重载
     */
    tryCompile (defineOverrides?: IDefineMap, saveOverrides?: boolean): any;

    /**
     * @zh
     * 根据当前 pass 持有的信息创建 [[GFXPipelineState]]。
     */
    createPipelineState (): GFXPipelineState | null;

    /**
     * @zh
     * 销毁指定的 [[GFXPipelineState]]，如果它是这个 pass 创建的。
     */
    destroyPipelineState (pipelineStates?: GFXPipelineState): void;

    createBatchedBuffer (): void;

    clearBatchedBuffer (): void;

    /**
     * @zh
     * 用于在component的pso变化的回调中调用以取消pso变化的通知，一般情况下不应该调用该函数，如果必须调用，请先检查上层逻辑是否合理。
     */
    beginChangeStatesSilently (): void;
    endChangeStatesSilently (): void;
}
