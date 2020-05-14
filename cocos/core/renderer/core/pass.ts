/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @category material
 */

import { EDITOR } from 'internal:constants';
import { builtinResMgr } from '../../3d/builtin/init';
import { IPassInfo, IPassStates, IPropertyInfo } from '../../assets/effect-asset';
import { TextureBase } from '../../assets/texture-base';
import { GFXBindingLayout, IGFXBinding, IGFXBindingLayoutInfo } from '../../gfx/binding-layout';
import { GFXBuffer, IGFXBufferInfo } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXDynamicState,
    GFXGetTypeSize, GFXMemoryUsageBit, GFXPrimitiveMode, GFXType } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../../gfx/pipeline-layout';
import { GFXBlendState, GFXBlendTarget, GFXDepthStencilState,
    GFXInputState, GFXPipelineState, GFXRasterizerState, IGFXPipelineStateInfo } from '../../gfx/pipeline-state';
import { GFXRenderPass } from '../../gfx/render-pass';
import { GFXSampler } from '../../gfx/sampler';
import { GFXShader } from '../../gfx/shader';
import { GFXTextureView } from '../../gfx/texture-view';
import { BatchedBuffer } from '../../pipeline/batched-buffer';
import { isBuiltinBinding, RenderPassStage, RenderPriority } from '../../pipeline/define';
import { InstancedBuffer } from '../../pipeline/instanced-buffer';
import { getPhaseID } from '../../pipeline/pass-phase';
import { Root } from '../../root';
import { murmurhash2_32_gc } from '../../utils/murmurhash2_gc';
import { customizeType, getBindingFromHandle, getBindingTypeFromHandle,
    getDefaultFromType, getOffsetFromHandle, getTypeFromHandle, IDefineMap, MaterialProperty, type2reader, type2writer } from './pass-utils';
import { IProgramInfo, programLib } from './program-lib';
import { samplerLib } from './sampler-lib';
import { legacyCC } from '../../global-exports';

export interface IPassInfoFull extends IPassInfo {
    // generated part
    idxInTech: number;
    defines: IDefineMap;
    stateOverrides?: PassOverrides;
}
export type PassOverrides = RecursivePartial<IPassStates>;

export interface IBlock {
    view: Float32Array;
    dirty: boolean;
}

export interface IMacroPatch {
    name: string;
    value: boolean | number | string;
}

interface IPassResources {
    bindingLayout: GFXBindingLayout;
    pipelineLayout: GFXPipelineLayout;
    pipelineState: GFXPipelineState;
}

interface IPassDynamics {
    [type: number]: {
        dirty: boolean,
        value: number[],
    };
}

interface IPSOHashInfo {
    program: string;
    defines: IDefineMap;
    stage: RenderPassStage;
    primitive: GFXPrimitiveMode;
    rasterizerState: GFXRasterizerState;
    depthStencilState: GFXDepthStencilState;
    blendState: GFXBlendState;
    dynamicStates: GFXDynamicState[];
}

const _bfInfo: IGFXBufferInfo = {
    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
    size: 0,
    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
};

const _blInfo: IGFXBindingLayoutInfo = {
    bindings: null!,
};

const _plInfo: IGFXPipelineLayoutInfo = {
    layouts: null!,
};

const _psoInfo: IGFXPipelineStateInfo & IPSOHashInfo = {
    primitive: 0,
    shader: null!,
    inputState: null!,
    rasterizerState: null!,
    depthStencilState: null!,
    blendState: null!,
    dynamicStates: null!,
    layout: null!,
    renderPass: null!,
    hash: 0,

    program: '',
    defines: null!,
    stage: 0,
};

/**
 * @zh
 * 渲染 pass，储存实际描述绘制过程的各项资源。
 */
export class Pass {
    /**
     * @zh
     * 根据 handle 获取 unform 的绑定类型（UBO 或贴图等）。
     */
    public static getBindingTypeFromHandle = getBindingTypeFromHandle;
    /**
     * @zh
     * 根据 handle 获取 UBO member 的具体类型。
     */
    public static getTypeFromHandle = getTypeFromHandle;
    /**
     * @zh
     * 根据 handle 获取 binding。
     */
    public static getBindingFromHandle = getBindingFromHandle;

    public static fillinPipelineInfo (target: Pass, info: PassOverrides) {
        if (info.priority !== undefined) { target._priority = info.priority; }
        if (info.primitive !== undefined) { target._primitive = info.primitive; }
        if (info.stage !== undefined) { target._stage = info.stage; }
        if (info.dynamicStates !== undefined) { target._dynamicStates = info.dynamicStates as GFXDynamicState[]; }
        if (info.customizations) { target._customizations = info.customizations as string[]; }
        if (info.phase) { target._phase = getPhaseID(info.phase); }

        const bs = target._bs;
        if (info.blendState) {
            const bsInfo = Object.assign({}, info.blendState);
            if (bsInfo.targets) {
                bsInfo.targets.forEach((t, i) => Object.assign(
                bs.targets[i] || (bs.targets[i] = new GFXBlendTarget()), t));
            }
            delete bsInfo.targets;
            Object.assign(bs, bsInfo);
        }
        Object.assign(target._rs, info.rasterizerState);
        Object.assign(target._dss, info.depthStencilState);
    }

    /**
     * @zh
     * 根据指定 PSO 信息计算 hash
     * @param psoInfo 用于计算 PSO hash 的最小必要信息
     */
    public static getPSOHash (psoInfo: IPSOHashInfo) {
        const shaderKey = programLib.getKey(psoInfo.program, psoInfo.defines);
        let res = `${shaderKey},${psoInfo.stage},${psoInfo.primitive}`;
        res += serializeBlendState(psoInfo.blendState);
        res += serializeDepthStencilState(psoInfo.depthStencilState);
        res += serializeRasterizerState(psoInfo.rasterizerState);
        return murmurhash2_32_gc(res, 666);
    }

    protected static getOffsetFromHandle = getOffsetFromHandle;
    // internal resources
    protected _buffers: Record<number, GFXBuffer> = {};
    protected _samplers: Record<number, GFXSampler> = {};
    protected _textureViews: Record<number, GFXTextureView> = {};
    protected _resources: IPassResources[] = [];
    // internal data
    protected _phase = getPhaseID('default');
    protected _idxInTech = 0;
    protected _programName = '';
    protected _priority: RenderPriority = RenderPriority.DEFAULT;
    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
    protected _stage: RenderPassStage = RenderPassStage.DEFAULT;
    protected _bindings: IGFXBinding[] = [];
    protected _inputState: GFXInputState = new GFXInputState();
    protected _bs: GFXBlendState = new GFXBlendState();
    protected _dss: GFXDepthStencilState = new GFXDepthStencilState();
    protected _rs: GFXRasterizerState = new GFXRasterizerState();
    protected _dynamicStates: GFXDynamicState[] = [];
    protected _dynamics: IPassDynamics = {};
    protected _customizations: string[] = [];
    protected _handleMap: Record<string, number> = {};
    protected _blocks: IBlock[] = [];
    protected _shaderInfo: IProgramInfo = null!;
    protected _defines: IDefineMap = {};
    protected _properties: Record<string, IPropertyInfo> = {};
    protected _hash = 0;
    // external references
    protected _device: GFXDevice;
    protected _renderPass: GFXRenderPass | null = null;
    protected _shader: GFXShader | null = null;
    // for dynamic batching
    protected _batchedBuffer: BatchedBuffer | null = null;
    protected _instancedBuffer: InstancedBuffer | null = null;

    public constructor (device: GFXDevice) {
        this._device = device;
    }

    /**
     * @zh
     * 根据指定参数初始化当前 pass，shader 会在这一阶段就尝试编译。
     */
    public initialize (info: IPassInfoFull) {
        this._doInit(info);
        this.resetUBOs();
        this.resetTextures();
    }

    /**
     * @en
     * Get the handle of a UBO member, or specific channels of it.
     * @zh
     * 获取指定 UBO 成员，或其更具体分量的读写句柄。默认以成员自身的类型为目标读写类型（即读写时必须传入与成员类型相同的变量）。
     * @param name Name of the target UBO member.
     * @param offset Channel offset into the member.
     * @param targetType Target type of the handle, i.e. the type of data when read/write to it.
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
    public getHandle (name: string, offset = 0, targetType = GFXType.UNKNOWN): number | undefined {
        let handle = this._handleMap[name]; if (!handle) { return; }
        if (targetType) { handle = customizeType(handle, targetType); }
        else if (offset) { handle = customizeType(handle, getTypeFromHandle(handle) - offset); }
        return handle + offset;
    }

    /**
     * @zh
     * 获取指定 uniform 的 binding。
     * @param name 目标 uniform 名。
     */
    public getBinding (name: string) {
        const handle = this.getHandle(name);
        if (handle === undefined) { return; }
        return Pass.getBindingFromHandle(handle);
    }

    /**
     * @zh
     * 设置指定普通向量类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle 目标 uniform 的 handle。
     * @param value 目标值。
     */
    public setUniform (handle: number, value: MaterialProperty) {
        const binding = Pass.getBindingFromHandle(handle);
        const type = Pass.getTypeFromHandle(handle);
        const ofs = Pass.getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        type2writer[type](block.view, value, ofs);
        block.dirty = true;
    }

    /**
     * @zh
     * 获取指定普通向量类 uniform 的值。
     * @param handle 目标 uniform 的 handle。
     * @param out 输出向量。
     */
    public getUniform (handle: number, out: MaterialProperty) {
        const binding = Pass.getBindingFromHandle(handle);
        const type = Pass.getTypeFromHandle(handle);
        const ofs = Pass.getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        return type2reader[type](block.view, out, ofs);
    }

    /**
     * @zh
     * 设置指定数组类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle 目标 uniform 的 handle。
     * @param value 目标值。
     */
    public setUniformArray (handle: number, value: MaterialProperty[]) {
        const binding = Pass.getBindingFromHandle(handle);
        const type = Pass.getTypeFromHandle(handle);
        const stride = GFXGetTypeSize(type) >> 2;
        const block = this._blocks[binding];
        let ofs = Pass.getOffsetFromHandle(handle);
        for (let i = 0; i < value.length; i++, ofs += stride) {
            if (value[i] === null) { continue; }
            type2writer[type](block.view, value[i], ofs);
        }
        block.dirty = true;
    }

    /**
     * @zh
     * 绑定实际 [[GFXBuffer]] 到指定 binding。
     * @param binding 目标 UBO 的 binding。
     * @param value 目标 buffer。
     */
    public bindBuffer (binding: number, value: GFXBuffer) {
        if (this._buffers[binding] === value) { return; }
        this._buffers[binding] = value;
        const len = this._resources.length;
        for (let i = 0; i < len; i++) {
            const res = this._resources[i];
            res.bindingLayout.bindBuffer(binding, value);
        }
    }

    /**
     * @zh
     * 绑定实际 [[GFXTextureView]] 到指定 binding。
     * @param binding 目标贴图类 uniform 的 binding。
     * @param value 目标 texture view。
     */
    public bindTextureView (binding: number, value: GFXTextureView) {
        if (this._textureViews[binding] === value) { return; }
        this._textureViews[binding] = value;
        const len = this._resources.length;
        for (let i = 0; i < len; i++) {
            const res = this._resources[i];
            res.bindingLayout.bindTextureView(binding, value);
        }
    }

    /**
     * @zh
     * 绑定实际 [[GFXSampler]] 到指定 binding。
     * @param binding 目标贴图类 uniform 的 binding。
     * @param value 目标 sampler。
     */
    public bindSampler (binding: number, value: GFXSampler) {
        if (this._samplers[binding] === value) { return; }
        this._samplers[binding] = value;
        const len = this._resources.length;
        for (let i = 0; i < len; i++) {
            const res = this._resources[i];
            res.bindingLayout.bindSampler(binding, value);
        }
    }

    /**
     * @zh
     * 设置运行时 pass 内可动态更新的管线状态属性。
     * @param state 目标管线状态。
     * @param value 目标值。
     */
    public setDynamicState (state: GFXDynamicState, value: any) {
        const ds = this._dynamics[state];
        if (ds && ds.value === value) { return; }
        ds.value = value; ds.dirty = true;
    }

    /**
     * @zh
     * 重载当前所有管线状态。
     * @param original 原始管线状态。
     * @param value 管线状态重载值。
     */
    public overridePipelineStates (original: IPassInfo, overrides: PassOverrides) {
        console.warn('base pass cannot override states, please use pass instance instead.');
    }

    /**
     * @zh
     * 更新当前 Uniform 数据。
     */
    public update () {
        const len = this._blocks.length;
        for (let i = 0; i < len; i++) {
            const block = this._blocks[i];
            if (block.dirty) {
                this._buffers[i].update(block.view);
                block.dirty = false;
            }
        }
        const source = (legacyCC.director.root as Root).pipeline.globalBindings;
        const target = this._shaderInfo.builtins.globals;
        const samplerLen = target.samplers.length;
        for (let i = 0; i < samplerLen; i++) {
            const s = target.samplers[i];
            const info = source.get(s.name)!;
            if (info.sampler) { this.bindSampler(info.samplerInfo!.binding, info.sampler); }
            this.bindTextureView(info.samplerInfo!.binding, info.textureView!);
        }
    }

    /**
     * @zh
     * 销毁当前 pass。
     */
    public destroy () {
        for (const u of this._shaderInfo.blocks) {
            if (isBuiltinBinding(u.binding)) { continue; }
            this._buffers[u.binding].destroy();
        }
        this._buffers = {};
        // textures are reused
        this._samplers = {};
        this._textureViews = {};
        if (this._instancedBuffer) {
            this._instancedBuffer.destroy();
            this._instancedBuffer = null;
        }
        if (this._batchedBuffer) {
            this._batchedBuffer.destroy();
            this._batchedBuffer = null;
        }
    }

    /**
     * @zh
     * 重置指定（非数组） Uniform  为 Effect 默认值。
     */
    public resetUniform (name: string) {
        const handle = this.getHandle(name)!;
        const type = Pass.getTypeFromHandle(handle);
        const binding = Pass.getBindingFromHandle(handle);
        const ofs = Pass.getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        const info = this._properties[name];
        const value = info && info.value || getDefaultFromType(type);
        type2writer[type](block.view, value, ofs);
        block.dirty = true;
    }

    /**
     * @zh
     * 重置指定贴图为 Effect 默认值。
     */
    public resetTexture (name: string) {
        const handle = this.getHandle(name)!;
        const type = Pass.getTypeFromHandle(handle);
        const binding = Pass.getBindingFromHandle(handle);
        const info = this._properties[name];
        const value = info && info.value;
        const texName = value ? value + '-texture' : getDefaultFromType(type) as string;
        const texture = builtinResMgr.get<TextureBase>(texName);
        const textureView = texture && texture.getGFXTextureView()!;
        const samplerHash = info && (info.samplerHash !== undefined) ? info.samplerHash : texture.getSamplerHash();
        const sampler = samplerLib.getSampler(this._device, samplerHash);
        this._textureViews[binding] = textureView;
        this._samplers[binding] = sampler;
        for (let i = 0; i < this._resources.length; i++) {
            const res = this._resources[i];
            res.bindingLayout.bindSampler(binding, sampler);
            res.bindingLayout.bindTextureView(binding, textureView);
        }
    }

    /**
     * @zh
     * 重置所有 UBO 为默认值。
     */
    public resetUBOs () {
        for (const u of this._shaderInfo.blocks) {
            if (isBuiltinBinding(u.binding)) { continue; }
            const block: IBlock = this._blocks[u.binding];
            if (!block) { continue; }
            let ofs = 0;
            for (let i = 0; i < u.members.length; i++) {
                const cur = u.members[i];
                const info = this._properties[cur.name];
                const givenDefault = info && info.value;
                const value = (givenDefault ? givenDefault : getDefaultFromType(cur.type)) as number[];
                const size = (GFXGetTypeSize(cur.type) >> 2) * cur.count;
                for (let j = 0; j + value.length <= size; j += value.length) { block.view.set(value, ofs + j); }
                ofs += size;
            }
            block.dirty = true;
        }
    }

    /**
     * @zh
     * 重置所有 texture 和 sampler 为初始默认值。
     */
    public resetTextures () {
        for (const u of this._shaderInfo.samplers) {
            if (isBuiltinBinding(u.binding)) { continue; }
            this.resetTexture(u.name);
        }
    }

    /**
     * @zh
     * 尝试编译 shader 并获取相关资源引用。
     * @param defineOverrides shader 预处理宏定义重载
     */
    public tryCompile () {
        const pipeline = (legacyCC.director.root as Root).pipeline;
        if (!pipeline) { return null; }
        this._dynamicBatchingSync();
        this._renderPass = pipeline.getRenderPass(this._stage);
        if (!this._renderPass) { console.warn(`illegal pass stage.`); return false; }
        const res = programLib.getGFXShader(this._device, this._programName, this._defines, pipeline);
        if (!res.shader) { console.warn(`create shader ${this._programName} failed`); return false; }
        this._shader = res.shader; this._bindings = res.bindings; this._inputState = res.inputState;
        return true;
    }

    /**
     * @zh
     * 根据当前 pass 持有的信息创建 [[GFXPipelineState]]。
     */
    public createPipelineState (patches?: IMacroPatch[]): GFXPipelineState | null {
        if ((!this._renderPass || !this._shader || !this._bindings.length) && !this.tryCompile()) {
            console.warn(`pass resources not complete, create PSO failed`);
            return null;
        }
        const res = patches ? this._getShaderWithBuiltinMacroPatches (patches) : null;
        const shader = res && res.shader || this._shader!;
        _blInfo.bindings = res && res.bindings || this._bindings;
        // bind resources
        const bindingLayout = this._device.createBindingLayout(_blInfo);
        for (const b in this._buffers) {
            bindingLayout.bindBuffer(parseInt(b), this._buffers[b]);
        }
        for (const s in this._samplers) {
            bindingLayout.bindSampler(parseInt(s), this._samplers[s]);
        }
        for (const t in this._textureViews) {
            bindingLayout.bindTextureView(parseInt(t), this._textureViews[t]);
        }
        // bind pipeline builtins
        const source = (legacyCC.director.root as Root).pipeline.globalBindings;
        const target = this._shaderInfo.builtins.globals;
        for (const b of target.blocks) {
            const info = source.get(b.name);
            if (!info || info.type !== GFXBindingType.UNIFORM_BUFFER) { console.warn(`builtin UBO '${b.name}' not available!`); continue; }
            bindingLayout.bindBuffer(info.blockInfo!.binding, info.buffer!);
        }
        for (const s of target.samplers) {
            const info = source.get(s.name);
            if (!info || info.type !== GFXBindingType.SAMPLER) { console.warn(`builtin texture '${s.name}' not available!`); continue; }
            if (info.sampler) { bindingLayout.bindSampler(info.samplerInfo!.binding, info.sampler); }
            bindingLayout.bindTextureView(info.samplerInfo!.binding, info.textureView!);
        }
        _plInfo.layouts = [bindingLayout];
        const pipelineLayout = this._device.createPipelineLayout(_plInfo);
        // create pipeline state
        _psoInfo.inputState = res && res.inputState || this._inputState;
        _psoInfo.primitive = this._primitive;
        _psoInfo.shader = shader;
        _psoInfo.rasterizerState = this._rs;
        _psoInfo.depthStencilState = this._dss;
        _psoInfo.blendState = this._bs;
        _psoInfo.dynamicStates = this._dynamicStates;
        _psoInfo.layout = pipelineLayout;
        _psoInfo.renderPass = this._renderPass!;
        _psoInfo.program = this._programName;
        _psoInfo.defines = this._defines;
        _psoInfo.stage = this._stage;
        _psoInfo.hash = this._hash;
        const pipelineState = this._device.createPipelineState(_psoInfo);
        this._resources.push({ bindingLayout, pipelineLayout, pipelineState });
        return pipelineState;
    }

    /**
     * @zh
     * 销毁指定的 [[GFXPipelineState]]，如果它是这个 pass 创建的。
     */
    public destroyPipelineState (pipelineStates: GFXPipelineState) {
        const idx = this._resources.findIndex((res) => res.pipelineState === pipelineStates);
        if (idx >= 0) {
            const { bindingLayout: bl, pipelineLayout: pl, pipelineState: ps } = this._resources[idx];
            bl.destroy(); pl.destroy(); ps.destroy();
            this._resources.splice(idx, 1);
        }
    }

    // internal use
    public beginChangeStatesSilently () {}
    public endChangeStatesSilently () {}

    protected _doInit (info: IPassInfoFull, copyDefines = false) {
        this._idxInTech = info.idxInTech;
        this._programName = info.program;
        this._defines = copyDefines ? Object.assign({}, info.defines) : info.defines;
        this._shaderInfo = programLib.getTemplate(info.program);
        this._properties = info.properties || this._properties;
        // pipeline state
        const device = this._device;
        Pass.fillinPipelineInfo(this, info);
        if (info.stateOverrides) { Pass.fillinPipelineInfo(this, info.stateOverrides); }
        this._hash = Pass.getPSOHash(this);

        const blocks = this._shaderInfo.blocks;
        for (let i = 0; i < blocks.length; i++) {
            const { size, binding } = blocks[i];
            if (isBuiltinBinding(binding)) { continue; }
            // create gfx buffer resource
            _bfInfo.size = Math.ceil(size / 16) * 16; // https://bugs.chromium.org/p/chromium/issues/detail?id=988988
            this._buffers[binding] = device.createBuffer(_bfInfo);
            // non-builtin UBO data pools, note that the effect compiler
            // guarantees these bindings to be consecutive, starting from 0
            const buffer = new ArrayBuffer(size);
            this._blocks[binding] = { view: new Float32Array(buffer), dirty: false };
        }
        // store handles
        const directHandleMap = this._handleMap = this._shaderInfo.handleMap;
        const indirectHandleMap: Record<string, number> = {};
        for (const name in this._properties) {
            const prop = this._properties[name];
            if (!prop.handleInfo) { continue; }
            indirectHandleMap[name] = this.getHandle.apply(this, prop.handleInfo)!;
        }
        Object.assign(directHandleMap, indirectHandleMap);
        this.tryCompile();
    }

    protected _dynamicBatchingSync () {
        if (this._defines.USE_INSTANCING) {
            if (!this._device.hasFeature(GFXFeature.INSTANCED_ARRAYS)) {
                this._defines.USE_INSTANCING = false;
            } else if (!this._instancedBuffer) {
                this._instancedBuffer = new InstancedBuffer(this);
            }
        } else if (this._defines.USE_BATCHING) {
            if (!this._batchedBuffer) {
                this._batchedBuffer = new BatchedBuffer(this);
            }
        }
        if (!this._defines.USE_INSTANCING && this._instancedBuffer) {
            this._instancedBuffer.destroy();
            this._instancedBuffer = null;
        }
        if (!this._defines.USE_BATCHING && this._batchedBuffer) {
            this._batchedBuffer.destroy();
            this._batchedBuffer = null;
        }
    }

    protected _getShaderWithBuiltinMacroPatches (patches: IMacroPatch[]) {
        if (EDITOR) {
            for (let i = 0; i < patches.length; i++) {
                if (!patches[i].name.startsWith('CC_')) {
                    console.warn('cannot patch non-builtin macros');
                    return null;
                }
            }
        }
        const pipeline = (legacyCC.director.root as Root).pipeline;
        if (!pipeline) { return null; }
        for (let i = 0; i < patches.length; i++) {
            const patch = patches[i];
            this._defines[patch.name] = patch.value;
        }
        const res = programLib.getGFXShader(this._device, this._programName, this._defines, pipeline);
        for (let i = 0; i < patches.length; i++) {
            const patch = patches[i];
            delete this._defines[patch.name];
        }
        return res;
    }

    // states
    get priority () { return this._priority; }
    get primitive () { return this._primitive; }
    get stage () { return this._stage; }
    get inputState () { return this._inputState; }
    get rasterizerState () { return this._rs; }
    get depthStencilState () { return this._dss; }
    get blendState () { return this._bs; }
    get dynamicStates () { return this._dynamicStates; }
    get customizations () { return this._customizations; }
    get phase () { return this._phase; }
    // infos
    get device () { return this._device; }
    get shaderInfo () { return this._shaderInfo; }
    get program () { return this._programName; }
    get properties () { return this._properties; }
    get defines () { return this._defines; }
    get idxInTech () { return this._idxInTech; }
    // resources
    get bindings () { return this._bindings; }
    get shader () { return this._shader!; }
    get renderPass () { return this._renderPass!; }
    get dynamics () { return this._dynamics; }
    get batchedBuffer () { return this._batchedBuffer; }
    get instancedBuffer () { return this._instancedBuffer; }
    get blocks () { return this._blocks; }
    get hash () { return this._hash; }
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
