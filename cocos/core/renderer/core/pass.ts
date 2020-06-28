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
import { GFXBindingLayout, IGFXBindingLayoutInfo } from '../../gfx/binding-layout';
import { GFXBuffer, IGFXBufferInfo } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXDynamicState,
    GFXGetTypeSize, GFXMemoryUsageBit, GFXPrimitiveMode, GFXType } from '../../gfx/define';
import { GFXFeature, GFXDevice } from '../../gfx/device';
import { GFXBlendState, GFXBlendTarget, GFXDepthStencilState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { GFXSampler } from '../../gfx/sampler';
import { GFXShader } from '../../gfx/shader';
import { GFXTexture } from '../../gfx/texture';
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
import { IPSOCreateInfo } from '../scene/submodel';

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

interface IPassDynamics {
    [type: number]: {
        dirty: boolean,
        value: number[],
    };
}

interface IPassHashInfo {
    program: string;
    defines: IDefineMap;
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
    shader: null!,
};

// tslint:disable: no-shadowed-variable
export namespace Pass {
    export type getBindingTypeFromHandle = typeof getBindingTypeFromHandle;
    export type getTypeFromHandle = typeof getTypeFromHandle;
    export type getBindingFromHandle = typeof getBindingFromHandle;
    export type fillinPipelineInfo = typeof Pass.fillinPipelineInfo;
    export type getPassHash = typeof Pass.getPassHash;
    export type getOffsetFromHandle = typeof getOffsetFromHandle;
}
// tslint:enable: no-shadowed-variable

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
     * @en
     * Get pass hash value by [[Pass]] hash information.
     * @zh
     * 根据 [[Pass]] 的哈希信息获取哈希值。
     *
     * @param passHashInfo the Pass hash information used to compute hash value.
     */
    public static getPassHash (passHashInfo: IPassHashInfo) {
        const shaderKey = programLib.getKey(passHashInfo.program, passHashInfo.defines);
        let res = shaderKey + ',' + passHashInfo.primitive;
        res += serializeBlendState(passHashInfo.blendState);
        res += serializeDepthStencilState(passHashInfo.depthStencilState);
        res += serializeRasterizerState(passHashInfo.rasterizerState);
        res += serializeDynamicState(passHashInfo.dynamicStates);
        return murmurhash2_32_gc(res, 666);
    }

    protected static getOffsetFromHandle = getOffsetFromHandle;
    // internal resources
    protected _buffers: Record<number, GFXBuffer> = {};
    protected _samplers: Record<number, GFXSampler> = {};
    protected _resources: GFXBindingLayout[] = [];
    protected _textures: Record<number, GFXTexture> = {};
    // internal data
    protected _phase = getPhaseID('default');
    protected _idxInTech = 0;
    protected _programName = '';
    protected _priority: RenderPriority = RenderPriority.DEFAULT;
    protected _primitive: GFXPrimitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
    protected _stage: RenderPassStage = RenderPassStage.DEFAULT;
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
    protected _root: Root;
    protected _device: GFXDevice;
    protected _shader: GFXShader | null = null;
    // for dynamic batching
    protected _batchedBuffer: BatchedBuffer | null = null;
    protected _instancedBuffer: InstancedBuffer | null = null;

    constructor (root: Root) {
        this._root = root;
        this._device = root.device;
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
            res.bindBuffer(binding, value);
        }
    }

    /**
     * @zh
     * 绑定实际 [[GFXTexture]] 到指定 binding。
     * @param binding 目标贴图类 uniform 的 binding。
     * @param value 目标 texture
     */
    public bindTexture (binding: number, value: GFXTexture) {
        if (this._textures[binding] === value) { return; }
        this._textures[binding] = value;
        const len = this._resources.length;
        for (let i = 0; i < len; i++) {
            const res = this._resources[i];
            res.bindTexture(binding, value);
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
            res.bindSampler(binding, value);
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
        const source = this._root.pipeline.globalBindings;
        const target = this._shaderInfo.builtins.globals;
        const samplerLen = target.samplers.length;
        for (let i = 0; i < samplerLen; i++) {
            const s = target.samplers[i];
            const info = source.get(s.name)!;
            if (info.sampler) { this.bindSampler(info.samplerInfo!.binding, info.sampler); }
            this.bindTexture(info.samplerInfo!.binding, info.texture!);
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
        this._textures = {};
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
        const textureBase = builtinResMgr.get<TextureBase>(texName);
        const texture = textureBase && textureBase.getGFXTexture()!;
        const samplerHash = info && (info.samplerHash !== undefined) ? info.samplerHash : textureBase.getSamplerHash();
        const sampler = samplerLib.getSampler(this._device, samplerHash);
        this._textures[binding] = texture;
        this._samplers[binding] = sampler;
        for (let i = 0; i < this._resources.length; i++) {
            const res = this._resources[i];
            res.bindSampler(binding, sampler);
            res.bindTexture(binding, texture);
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
        const pipeline = this._root.pipeline;
        if (!pipeline) { return null; }
        this._dynamicBatchingSync();
        Object.assign(this._defines, pipeline.macros);
        const key = programLib.getKey(this._programName, this._defines);
        const shader = programLib.getGFXShader(this._device, this._programName, this._defines, pipeline, key);
        if (!shader) { console.warn(`create shader ${this._programName} failed`); return false; }
        this._shader = shader;
        this._hash = Pass.getPassHash(this);
        return true;
    }

    /**
     * @zh
     * 根据当前 pass 持有的信息创建 [[IPSOCreateInfo]]。
     * @en
     * Create [[IPSOCreateInfo]] from pass.
     * @param patches the marcos to be used in shader.
     */
    public createPipelineStateCI (patches?: IMacroPatch[]): IPSOCreateInfo | null {
        if ((!this._shader) && !this.tryCompile()) {
            console.warn(`pass resources not complete, create PSO hash info failed`);
            return null;
        }
        const res = patches ? this._getShaderWithBuiltinMacroPatches (patches) : null;
        const shader = _blInfo.shader = res || this._shader!;
        // bind resources
        const bindingLayout = this._device.createBindingLayout(_blInfo);
        for (const b in this._buffers) {
            bindingLayout.bindBuffer(parseInt(b), this._buffers[b]);
        }
        for (const s in this._samplers) {
            bindingLayout.bindSampler(parseInt(s), this._samplers[s]);
        }
        for (const t in this._textures) {
            bindingLayout.bindTexture(parseInt(t), this._textures[t]);
        }
        // bind pipeline builtins
        const source = this._root.pipeline.globalBindings;
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
            bindingLayout.bindTexture(info.samplerInfo!.binding, info.texture!);
        }
        this._resources.push(bindingLayout);
        // create pipeline state
        return {
            primitive: this._primitive,
            shader,
            rasterizerState: this._rs,
            depthStencilState: this._dss,
            blendState: this._bs,
            dynamicStates: this._dynamicStates,
            bindingLayout,
            hash: this._hash,
        };
    }

    /**
     * @zh
     * 销毁此 Pass 创建的 [[IPSOCreateInfo]]。
     * @en
     * Delete [[IPSOCreateInfo]] from pass.
     * @param psoci the PSO create info created by this pass
     */
    public destroyPipelineStateCI (psoci: IPSOCreateInfo) {
        for (let i = 0; i < this._resources.length; i++) {
            if (this._resources[i] === psoci.bindingLayout) {
                psoci.bindingLayout.destroy();
                this._resources.splice(i, 1);
                break;
            }
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
        const pipeline = this._root.pipeline;
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
    get rasterizerState () { return this._rs; }
    get depthStencilState () { return this._dss; }
    get blendState () { return this._bs; }
    get dynamicStates () { return this._dynamicStates; }
    get customizations () { return this._customizations; }
    get phase () { return this._phase; }
    // infos
    get root () { return this._root; }
    get device () { return this._device; }
    get shaderInfo () { return this._shaderInfo; }
    get program () { return this._programName; }
    get properties () { return this._properties; }
    get defines () { return this._defines; }
    get idxInTech () { return this._idxInTech; }
    // resources
    get shader () { return this._shader!; }
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
    return ',rs,' + rs.cullMode + ',' + rs.depthBias + ',' + rs.isFrontFaceCCW;
}

function serializeDepthStencilState (dss: GFXDepthStencilState) {
    let res = `,dss,${dss.depthTest},${dss.depthWrite},${dss.depthFunc}`;
    res += `,${dss.stencilTestFront},${dss.stencilFuncFront},${dss.stencilRefFront},${dss.stencilReadMaskFront}`;
    res += `,${dss.stencilFailOpFront},${dss.stencilZFailOpFront},${dss.stencilPassOpFront},${dss.stencilWriteMaskFront}`;
    res += `,${dss.stencilTestBack},${dss.stencilFuncBack},${dss.stencilRefBack},${dss.stencilReadMaskBack}`;
    res += `,${dss.stencilFailOpBack},${dss.stencilZFailOpBack},${dss.stencilPassOpBack},${dss.stencilWriteMaskBack}`;
    return res;
}

function serializeDynamicState (dynamicStates: GFXDynamicState[]) {
    let res = ',ds';
    for (const ds in dynamicStates) {
        res += ',' + ds;
    }
    return res;
}
