/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module material
 */

import { EDITOR } from 'internal:constants';
import { Root } from '../../root';
import { TextureBase } from '../../assets/texture-base';
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { getPhaseID } from '../../pipeline/pass-phase';
import { murmurhash2_32_gc } from '../../utils/murmurhash2_gc';
import { samplerLib } from './sampler-lib';
import {
    BufferUsageBit, DynamicStateFlagBit, DynamicStateFlags, Feature, GetTypeSize, MemoryUsageBit, PrimitiveMode, Type, Color,
    BlendState, BlendTarget, Buffer, BufferInfo, BufferViewInfo, DepthStencilState, DescriptorSet,
    DescriptorSetInfo, DescriptorSetLayout, Device, RasterizerState, Sampler, Texture, PipelineLayout,
} from '../../gfx';
import {
    DSPool, NULL_HANDLE, PassHandle, PassPool, PassView, ShaderHandle, DescriptorSetHandle, PipelineLayoutHandle, PipelineLayoutPool,
} from './memory-pools';
import { IPassInfo, IPassStates, IPropertyInfo } from '../../assets/effect-asset';
import { IProgramInfo, programLib } from './program-lib';
import {
    MacroRecord, MaterialProperty, PropertyType, customizeType,
    getBindingFromHandle, getDefaultFromType, getOffsetFromHandle, getPropertyTypeFromHandle, getTypeFromHandle, type2reader, type2writer,
} from './pass-utils';
import { RenderPassStage, RenderPriority } from '../../pipeline/define';
import { errorID } from '../../platform/debug';

export interface IPassInfoFull extends IPassInfo {
    // generated part
    passIndex: number;
    defines: MacroRecord;
    stateOverrides?: PassOverrides;
}
export type PassOverrides = RecursivePartial<IPassStates>;

export interface IMacroPatch {
    name: string;
    value: boolean | number | string;
}

interface IPassDynamics {
    [type: number]: {
        dirty: boolean;
        value: number;
    };
}

const _bufferInfo = new BufferInfo(
    BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
    MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
);

const _bufferViewInfo = new BufferViewInfo(null!);

const _dsInfo = new DescriptorSetInfo(null!);

export enum BatchingSchemes {
    INSTANCING = 1,
    VB_MERGING = 2,
}

export declare namespace Pass {
    export type getPropertyTypeFromHandle = typeof getPropertyTypeFromHandle;
    export type getTypeFromHandle = typeof getTypeFromHandle;
    export type getBindingFromHandle = typeof getBindingFromHandle;
    export type fillPipelineInfo = typeof Pass.fillPipelineInfo;
    export type getPassHash = typeof Pass.getPassHash;
    export type getOffsetFromHandle = typeof getOffsetFromHandle;
    export type PropertyType = typeof PropertyType;
}

/**
 * @en Render pass, store actual resources for the rendering process
 * @zh 渲染 pass，储存实际描述绘制过程的各项资源。
 */
export class Pass {
    /**
     * @en The binding type enums of the property
     * @zh Uniform 的绑定类型（UBO 或贴图等）
     */
    public static PropertyType = PropertyType;

    /**
     * @en Gets the binding type of the property with handle
     * @zh 根据 handle 获取 uniform 的绑定类型（UBO 或贴图等）。
     */
    public static getPropertyTypeFromHandle = getPropertyTypeFromHandle;

    /**
     * @en Gets the type of member in uniform buffer object with the handle
     * @zh 根据 handle 获取 UBO member 的具体类型。
     */
    public static getTypeFromHandle = getTypeFromHandle;

    /**
     * @en Gets the binding with handle
     * @zh 根据 handle 获取 binding。
     */
    public static getBindingFromHandle = getBindingFromHandle;

    protected static getOffsetFromHandle = getOffsetFromHandle;

    /**
     * @en Fill a pass represented by the given pass handle with the given override info
     * @param hPass The pass handle point to the pass
     * @param info The pass override info
     */
    public static fillPipelineInfo (pass: Pass, info: PassOverrides): void {
        if (info.priority !== undefined) { pass.priority = info.priority; }
        if (info.primitive !== undefined) { pass.primitive = info.primitive; }
        if (info.stage !== undefined) { pass.stage = info.stage; }
        if (info.dynamicStates !== undefined) { pass.dynamicStates = info.dynamicStates; }
        if (info.phase !== undefined) { pass.phase = getPhaseID(info.phase); }

        const bs = pass._bs;
        if (info.blendState) {
            const bsInfo = info.blendState;
            const { targets } = bsInfo;
            if (targets) {
                targets.forEach((t, i) => {
                    bs.setTarget(i, t as BlendTarget);
                });
            }

            if (bsInfo.isA2C !== undefined) { bs.isA2C = bsInfo.isA2C; }
            if (bsInfo.isIndepend !== undefined) { bs.isIndepend = bsInfo.isIndepend; }
            if (bsInfo.blendColor !== undefined) { bs.blendColor = bsInfo.blendColor as Color; }
        }
        pass._rs.assign(info.rasterizerState as RasterizerState);
        pass._dss.assign(info.depthStencilState as DepthStencilState);
    }

    /**
     * @en Get pass hash value by [[Pass]] hash information.
     * @zh 根据 [[Pass]] 的哈希信息获取哈希值。
     *
     * @param hPass Handle of the pass info used to compute hash value.
     */
    public static getPassHash (pass: Pass, hShader: ShaderHandle): number {
        let res = `${hShader as unknown as number},${pass.primitive},${pass.dynamicStates}`;
        res += serializeBlendState(pass._bs);
        res += serializeDepthStencilState(pass._dss);
        res += serializeRasterizerState(pass._rs);

        return murmurhash2_32_gc(res, 666);
    }

    // internal resources
    protected _rootBuffer: Buffer | null = null;
    protected _rootBufferDirty = false;
    protected _buffers: Buffer[] = [];
    protected _descriptorSet: DescriptorSet = null!;
    protected _priority = RenderPriority.DEFAULT;
    protected _hash = 0;
    protected _pipelineLayout: PipelineLayout = null!;
    protected _primitiveMode = PrimitiveMode.TRIANGLE_LIST;
    protected _dynamicStates = DynamicStateFlagBit.NONE;
    protected _stage = RenderPassStage.DEFAULT;
    protected _phase = getPhaseID('default');
    protected _batchingSchemes = 0;
    // internal data
    protected _passIndex = 0;
    protected _propertyIndex = 0;
    protected _programName = '';
    protected _dynamics: IPassDynamics = {};
    protected _propertyHandleMap: Record<string, number> = {};
    protected _rootBlock: ArrayBuffer | null = null;
    protected _blocks: Float32Array[] = [];
    protected _shaderInfo: IProgramInfo = null!;
    protected _defines: MacroRecord = {};
    protected _properties: Record<string, IPropertyInfo> = {};
    // external references
    protected _root: Root;
    protected _device: Device;
    // native data
    protected _hShaderDefault: ShaderHandle = NULL_HANDLE;
    protected _handle: PassHandle = NULL_HANDLE;
    protected _bs: BlendState = new BlendState();
    protected _dss: DepthStencilState = new DepthStencilState();
    protected _rs: RasterizerState = new RasterizerState();

    constructor (root: Root) {
        this._root = root;
        this._device = root.device;
    }

    /**
     * @en Initialize the pass with given pass info, shader will be compiled in the init process
     * @zh 根据指定参数初始化当前 pass，shader 会在这一阶段就尝试编译。
     */
    public initialize (info: IPassInfoFull): void {
        this._doInit(info);
        this.resetUBOs();
        this.resetTextures();
        this.tryCompile();
    }

    /**
     * @en Get the handle of a UBO member, or specific channels of it.
     * @zh 获取指定 UBO 成员，或其更具体分量的读写句柄。默认以成员自身的类型为目标读写类型（即读写时必须传入与成员类型相同的变量）。
     * @param name Name of the target UBO member.
     * @param offset Channel offset into the member.
     * @param targetType Target type of the handle, i.e. the type of data when read/write to it.
     * @example
     * ```
     * import { Vec3, gfx } from 'cc';
     * // say 'pbrParams' is a uniform vec4
     * const hParams = pass.getHandle('pbrParams'); // get the default handle
     * pass.setUniform(hAlbedo, new Vec3(1, 0, 0)); // wrong! pbrParams.w is NaN now
     *
     * // say 'albedoScale' is a uniform vec4, and we only want to modify the w component in the form of a single float
     * const hThreshold = pass.getHandle('albedoScale', 3, gfx.Type.FLOAT);
     * pass.setUniform(hThreshold, 0.5); // now, albedoScale.w = 0.5
     * ```
     */
    public getHandle (name: string, offset = 0, targetType = Type.UNKNOWN): number {
        let handle = this._propertyHandleMap[name]; if (!handle) { return 0; }
        if (targetType) {
            handle = customizeType(handle, targetType);
        } else if (offset) {
            handle = customizeType(handle, getTypeFromHandle(handle) - offset);
        }
        return handle + offset;
    }

    /**
     * @en Gets the uniform binding with its name
     * @zh 获取指定 uniform 的 binding。
     * @param name The name of target uniform
     */
    public getBinding (name: string): number {
        const handle = this.getHandle(name);
        if (!handle) { return -1; }
        return Pass.getBindingFromHandle(handle);
    }

    /**
     * @en Sets a vector type uniform value, if a uniform requires frequent update, please use this method.
     * @zh 设置指定普通向量类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle The handle for the target uniform
     * @param value New value
     */
    public setUniform (handle: number, value: MaterialProperty): void {
        const binding = Pass.getBindingFromHandle(handle);
        const type = Pass.getTypeFromHandle(handle);
        const ofs = Pass.getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        type2writer[type](block, value, ofs);
        this._rootBufferDirty = true;
    }

    /**
     * @en Gets a uniform's value.
     * @zh 获取指定普通向量类 uniform 的值。
     * @param handle The handle for the target uniform
     * @param out The output property to store the result
     */
    public getUniform<T extends MaterialProperty> (handle: number, out: T): T {
        const binding = Pass.getBindingFromHandle(handle);
        const type = Pass.getTypeFromHandle(handle);
        const ofs = Pass.getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        return type2reader[type](block, out, ofs) as T;
    }

    /**
     * @en Sets an array type uniform value, if a uniform requires frequent update, please use this method.
     * @zh 设置指定数组类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle The handle for the target uniform
     * @param value New value
     */
    public setUniformArray (handle: number, value: MaterialProperty[]): void {
        const binding = Pass.getBindingFromHandle(handle);
        const type = Pass.getTypeFromHandle(handle);
        const stride = GetTypeSize(type) >> 2;
        const block = this._blocks[binding];
        let ofs = Pass.getOffsetFromHandle(handle);
        for (let i = 0; i < value.length; i++, ofs += stride) {
            if (value[i] === null) { continue; }
            type2writer[type](block, value[i], ofs);
        }
        this._rootBufferDirty = true;
    }

    /**
     * @en Bind a GFX [[Texture]] the the given uniform binding
     * @zh 绑定实际 GFX [[Texture]] 到指定 binding。
     * @param binding The binding for target uniform of texture type
     * @param value Target texture
     */
    public bindTexture (binding: number, value: Texture, index?: number): void {
        this._descriptorSet.bindTexture(binding, value, index || 0);
    }

    /**
     * @en Bind a GFX [[Sampler]] the the given uniform binding
     * @zh 绑定实际 GFX [[Sampler]] 到指定 binding。
     * @param binding The binding for target uniform of sampler type
     * @param value Target sampler
     */
    public bindSampler (binding: number, value: Sampler, index?: number): void {
        this._descriptorSet.bindSampler(binding, value, index || 0);
    }

    /**
     * @en Sets the dynamic pipeline state property at runtime
     * @zh 设置运行时 pass 内可动态更新的管线状态属性。
     * @param state Target dynamic state
     * @param value Target value
     */
    public setDynamicState (state: DynamicStateFlagBit, value: number): void {
        const ds = this._dynamics[state];
        if (ds && ds.value === value) { return; }
        ds.value = value; ds.dirty = true;
    }

    /**
     * @en Override all pipeline states with the given pass override info.
     * @zh 重载当前所有管线状态。
     * @param original The original pass info
     * @param value The override pipeline state info
     */
    public overridePipelineStates (original: IPassInfo, overrides: PassOverrides): void {
        console.warn('base pass cannot override states, please use pass instance instead.');
    }

    /**
     * @en Update the current uniforms data.
     * @zh 更新当前 Uniform 数据。
     */
    public update (): void {
        if (!this._descriptorSet) {
            errorID(12006);
            return;
        }

        if (this._rootBuffer && this._rootBufferDirty) {
            this._rootBuffer.update(this._rootBlock!);
            this._rootBufferDirty = false;
        }
        this._descriptorSet.update();
    }

    /**
     * @en Destroy the current pass.
     * @zh 销毁当前 pass。
     */
    public destroy (): void {
        for (let i = 0; i < this._shaderInfo.blocks.length; i++) {
            const u = this._shaderInfo.blocks[i];
            this._buffers[u.binding].destroy();
        }
        this._buffers = [];

        if (this._rootBuffer) {
            this._rootBuffer.destroy();
            this._rootBuffer = null;
        }

        // textures are reused
        this._descriptorSet = null!;

        this._rs.destroy();
        this._dss.destroy();
        this._bs.destroy();

        if (this._handle) {
            DSPool.free(PassPool.get(this._handle, PassView.DESCRIPTOR_SET));
            PassPool.free(this._handle);
            this._handle = NULL_HANDLE;
        }
    }

    /**
     * @en Resets the value of the given uniform by name to the default value in [[EffectAsset]].
     * This method does not support array type uniform.
     * @zh 重置指定（非数组） Uniform 为 [[EffectAsset]] 默认值。
     */
    public resetUniform (name: string): void {
        const handle = this.getHandle(name);
        if (!handle) { return; }
        const type = Pass.getTypeFromHandle(handle);
        const binding = Pass.getBindingFromHandle(handle);
        const ofs = Pass.getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        const info = this._properties[name];
        const value = (info && info.value) || getDefaultFromType(type);
        type2writer[type](block, value, ofs);
        this._rootBufferDirty = true;
    }

    /**
     * @en Resets the value of the given texture by name to the default value in [[EffectAsset]].
     * @zh 重置指定贴图为 [[EffectAsset]] 默认值。
     */
    public resetTexture (name: string, index?: number): void {
        const handle = this.getHandle(name);
        if (!handle) { return; }
        const type = Pass.getTypeFromHandle(handle);
        const binding = Pass.getBindingFromHandle(handle);
        const info = this._properties[name];
        const value = info && info.value;
        const texName = value ? `${value as string}-texture` : getDefaultFromType(type) as string;
        const textureBase = builtinResMgr.get<TextureBase>(texName);
        const texture = textureBase && textureBase.getGFXTexture()!;
        const samplerHash = info && (info.samplerHash !== undefined) ? info.samplerHash : textureBase && textureBase.getSamplerHash();
        const sampler = samplerLib.getSampler(this._device, samplerHash);
        this._descriptorSet.bindSampler(binding, sampler, index);
        this._descriptorSet.bindTexture(binding, texture, index);
    }

    /**
     * @en Resets all uniform buffer objects to the default values in [[EffectAsset]]
     * @zh 重置所有 UBO 为默认值。
     */
    public resetUBOs (): void {
        for (let i = 0; i < this._shaderInfo.blocks.length; i++) {
            const u = this._shaderInfo.blocks[i];
            const block = this._blocks[u.binding];
            let ofs = 0;
            for (let j = 0; j < u.members.length; j++) {
                const cur = u.members[j];
                const info = this._properties[cur.name];
                const givenDefault = info && info.value;
                const value = (givenDefault || getDefaultFromType(cur.type)) as number[];
                const size = (GetTypeSize(cur.type) >> 2) * cur.count;
                for (let k = 0; k + value.length <= size; k += value.length) { block.set(value, ofs + k); }
                ofs += size;
            }
        }
        this._rootBufferDirty = true;
    }

    /**
     * @en Resets all textures and samplers to the default values in [[EffectAsset]]
     * @zh 重置所有 texture 和 sampler 为初始默认值。
     */
    public resetTextures (): void {
        for (let i = 0; i < this._shaderInfo.samplerTextures.length; i++) {
            const u = this._shaderInfo.samplerTextures[i];
            for (let j = 0; j < u.count; j++) {
                this.resetTexture(u.name, j);
            }
        }
    }

    /**
     * @en Try to compile the shader and retrieve related resources references.
     * @zh 尝试编译 shader 并获取相关资源引用。
     */
    public tryCompile (): boolean {
        const { pipeline } = this._root;
        if (!pipeline) { return false; }
        this._syncBatchingScheme();
        this._hShaderDefault = programLib.getGFXShader(this._device, this._programName, this._defines, pipeline);
        if (!this._hShaderDefault) { console.warn(`create shader ${this._programName} failed`); return false; }
        this.pipelineLayoutHandle = programLib.getTemplateInfo(this._programName).hPipelineLayout;
        this.hash = Pass.getPassHash(this, this._hShaderDefault);
        return true;
    }

    /**
     * @en Gets the shader variant of the current pass and given macro patches
     * @zh 结合指定的编译宏组合获取当前 Pass 的 Shader Variant
     * @param patches The macro patches
     */
    public getShaderVariant (patches: IMacroPatch[] | null = null): ShaderHandle {
        if (!this._hShaderDefault && !this.tryCompile()) {
            console.warn('pass resources incomplete');
            return NULL_HANDLE as ShaderHandle;
        }

        if (!patches) {
            return this._hShaderDefault;
        }

        if (EDITOR) {
            for (let i = 0; i < patches.length; i++) {
                if (!patches[i].name.startsWith('CC_')) {
                    console.warn('cannot patch non-builtin macros');
                    return NULL_HANDLE as ShaderHandle;
                }
            }
        }

        const { pipeline } = this._root;
        for (let i = 0; i < patches.length; i++) {
            const patch = patches[i];
            this._defines[patch.name] = patch.value;
        }

        const hShader = programLib.getGFXShader(this._device, this._programName, this._defines, pipeline);

        for (let i = 0; i < patches.length; i++) {
            const patch = patches[i];
            delete this._defines[patch.name];
        }
        return hShader;
    }

    // internal use
    /**
     * @private
     */
    public beginChangeStatesSilently (): void {}

    /**
     * @private
     */
    public endChangeStatesSilently (): void {}

    protected _doInit (info: IPassInfoFull, copyDefines = false): void {
        this._handle = PassPool.alloc();
        this.priority = RenderPriority.DEFAULT;
        this.stage = RenderPassStage.DEFAULT;
        this.phase = getPhaseID('default');
        this.primitive = PrimitiveMode.TRIANGLE_LIST;
        this.rasterizerState = this._rs;
        this.depthStencilState = this._dss;
        this.blendState = this._bs;

        this._passIndex = info.passIndex;
        this._propertyIndex = info.propertyIndex !== undefined ? info.propertyIndex : info.passIndex;
        this._programName = info.program;
        this._defines = copyDefines ? ({ ...info.defines }) : info.defines;
        this._shaderInfo = programLib.getTemplate(info.program);
        this._properties = info.properties || this._properties;
        // pipeline state
        const device = this._device;
        Pass.fillPipelineInfo(this, info);
        if (info.stateOverrides) { Pass.fillPipelineInfo(this, info.stateOverrides); }

        // init descriptor set
        _dsInfo.layout = programLib.getDescriptorSetLayout(this._device, info.program);
        this.descriptorSetHandle = DSPool.alloc(this._device, _dsInfo);

        // calculate total size required
        const blocks = this._shaderInfo.blocks;
        const tmplInfo = programLib.getTemplateInfo(info.program);
        const { blockSizes, handleMap } = tmplInfo;
        const alignment = device.capabilities.uboOffsetAlignment;
        const startOffsets: number[] = [];
        let lastSize = 0; let lastOffset = 0;
        for (let i = 0; i < blocks.length; i++) {
            const size = blockSizes[i];
            startOffsets.push(lastOffset);
            lastOffset += Math.ceil(size / alignment) * alignment;
            lastSize = size;
        }
        // create gfx buffer resource
        const totalSize = startOffsets[startOffsets.length - 1] + lastSize;
        if (totalSize) {
            // https://bugs.chromium.org/p/chromium/issues/detail?id=988988
            _bufferInfo.size = Math.ceil(totalSize / 16) * 16;
            this._rootBuffer = device.createBuffer(_bufferInfo);
            this._rootBlock = new ArrayBuffer(totalSize);
        }
        // create buffer views
        for (let i = 0, count = 0; i < blocks.length; i++) {
            const { binding } = blocks[i];
            const size = blockSizes[i];
            _bufferViewInfo.buffer = this._rootBuffer!;
            _bufferViewInfo.offset = startOffsets[count++];
            _bufferViewInfo.range = Math.ceil(size / 16) * 16;
            const bufferView = this._buffers[binding] = device.createBuffer(_bufferViewInfo);
            // non-builtin UBO data pools, note that the effect compiler
            // guarantees these bindings to be consecutive, starting from 0 and non-array-typed
            this._blocks[binding] = new Float32Array(this._rootBlock!, _bufferViewInfo.offset,
                size / Float32Array.BYTES_PER_ELEMENT);
            this._descriptorSet.bindBuffer(binding, bufferView);
        }
        // store handles
        const directHandleMap = this._propertyHandleMap = handleMap;
        const indirectHandleMap: Record<string, number> = {};
        for (const name in this._properties) {
            const prop = this._properties[name];
            if (!prop.handleInfo) { continue; }
            indirectHandleMap[name] = this.getHandle.apply(this, prop.handleInfo)!;
        }
        Object.assign(directHandleMap, indirectHandleMap);
    }

    protected _syncBatchingScheme (): void {
        if (this._defines.USE_INSTANCING) {
            if (this._device.hasFeature(Feature.INSTANCED_ARRAYS)) {
                this.batchingScheme = BatchingSchemes.INSTANCING;
            } else {
                this._defines.USE_INSTANCING = false;
                this.batchingScheme = 0;
            }
        } else if (this._defines.USE_BATCHING) {
            this.batchingScheme = BatchingSchemes.VB_MERGING;
        } else {
            this.batchingScheme = 0;
        }
    }

    // Only for UI
    private _destroyHandle () {
        if (this._handle) {
            PassPool.free(this._handle);
            this._handle = NULL_HANDLE;
        }
    }

    // Only for UI
    private _initPassFromTarget (target: Pass, dss: DepthStencilState, bs: BlendState, hashFactor: number) {
        this._passIndex = target.passIndex;
        this._propertyIndex = target.propertyIndex;
        this._programName = target.program;
        this._defines = target.defines;
        this._shaderInfo = target._shaderInfo;
        this._properties = target._properties;
        this._hShaderDefault = target._hShaderDefault;

        this._blocks = target._blocks;
        this._dynamics =  target._dynamics;

        this.priority = target.priority;
        this.stage = target.stage;
        this.phase = target.phase;
        this.batchingScheme = target.batchingScheme;
        this.primitive = target.primitive;
        this.dynamicStates = target.dynamicStates;
        this.hash = target.hash ^ hashFactor;
        this.rasterizerState = target.rasterizerState;
        this.blendState = bs;
        this.depthStencilState = dss;
        this.pipelineLayoutHandle = programLib.getTemplateInfo(this._programName).hPipelineLayout;
        this.descriptorSetHandle = PassPool.get(target.handle, PassView.DESCRIPTOR_SET);
    }

    /* eslint-disable max-len */

    // infos
    get root (): Root { return this._root; }
    get device (): Device { return this._device; }
    get shaderInfo (): IProgramInfo { return this._shaderInfo; }
    get localSetLayout (): DescriptorSetLayout { return programLib.getDescriptorSetLayout(this._device, this._programName, true); }
    get program (): string { return this._programName; }
    get properties (): Record<string, IPropertyInfo> { return this._properties; }
    get defines (): Record<string, string | number | boolean> { return this._defines; }
    get passIndex (): number { return this._passIndex; }
    get propertyIndex (): number { return this._propertyIndex; }
    // data
    get dynamics (): IPassDynamics { return this._dynamics; }
    get blocks (): Float32Array[] { return this._blocks; }
    get rootBufferDirty (): boolean { return this._rootBufferDirty; }
    // states
    get handle (): PassHandle { return this._handle; }

    set priority (val: RenderPriority) { this._priority = val; PassPool.set(this._handle, PassView.PRIORITY, val); }
    get priority (): RenderPriority { return this._priority; }
    set primitive (val: PrimitiveMode) { this._primitiveMode = val; PassPool.set(this._handle, PassView.PRIMITIVE, val); }
    get primitive (): PrimitiveMode { return this._primitiveMode; }
    set stage (val: RenderPassStage) { this._stage = val; PassPool.set(this._handle, PassView.STAGE, val); }
    get stage (): RenderPassStage { return this._stage; }
    set phase (val: number) { this._phase = val; PassPool.set(this._handle, PassView.PHASE, val); }
    get phase (): number { return this._phase; }
    set dynamicStates (val: DynamicStateFlags) { this._dynamicStates = val; PassPool.set(this._handle, PassView.DYNAMIC_STATES, val); }
    get dynamicStates (): DynamicStateFlags { return this._dynamicStates; }
    set batchingScheme (val: BatchingSchemes) { this._batchingSchemes = val; PassPool.set(this._handle, PassView.BATCHING_SCHEME, val); }
    get batchingScheme (): BatchingSchemes { return this._batchingSchemes; }
    set hash (val: number) { this._hash = val; PassPool.set(this._handle, PassView.HASH, val); }
    get hash (): number { return this._hash; }
    set pipelineLayoutHandle (val: PipelineLayoutHandle) { this._pipelineLayout = PipelineLayoutPool.get(val); PassPool.set(this._handle, PassView.PIPELINE_LAYOUT, val); }
    get pipelineLayout (): PipelineLayout { return this._pipelineLayout; }
    set descriptorSetHandle (val: DescriptorSetHandle) { this._descriptorSet = DSPool.get(val); PassPool.set(this._handle, PassView.DESCRIPTOR_SET, val); }
    get descriptorSet (): DescriptorSet { return this._descriptorSet; }
    set rasterizerState (val: RasterizerState) { this._rs = val; PassPool.set(this._handle, PassView.RASTERIZER_STATE, val.handle); }
    get rasterizerState (): RasterizerState { return this._rs; }
    set depthStencilState (val: DepthStencilState) { this._dss = val; PassPool.set(this._handle, PassView.DEPTH_STENCIL_STATE, val.handle); }
    get depthStencilState (): DepthStencilState { return this._dss; }
    set blendState (val: BlendState) { this._bs = val; PassPool.set(this._handle, PassView.BLEND_STATE, val.handle); }
    get blendState (): BlendState { return this._bs; }

    /* eslint-enable max-len */
}

function serializeBlendState (bs: BlendState): string {
    let res = `,bs,${bs.isA2C}`;
    for (const t of bs.targets) {
        res += `,bt,${t.blend},${t.blendEq},${t.blendAlphaEq},${t.blendColorMask}`;
        res += `,${t.blendSrc},${t.blendDst},${t.blendSrcAlpha},${t.blendDstAlpha}`;
    }
    return res;
}

function serializeRasterizerState (rs: RasterizerState): string {
    return `,rs,${rs.cullMode},${rs.depthBias},${rs.isFrontFaceCCW}`;
}

function serializeDepthStencilState (dss: DepthStencilState): string {
    let res = `,dss,${dss.depthTest},${dss.depthWrite},${dss.depthFunc}`;
    res += `,${dss.stencilTestFront},${dss.stencilFuncFront},${dss.stencilRefFront},${dss.stencilReadMaskFront}`;
    res += `,${dss.stencilFailOpFront},${dss.stencilZFailOpFront},${dss.stencilPassOpFront},${dss.stencilWriteMaskFront}`;
    res += `,${dss.stencilTestBack},${dss.stencilFuncBack},${dss.stencilRefBack},${dss.stencilReadMaskBack}`;
    res += `,${dss.stencilFailOpBack},${dss.stencilZFailOpBack},${dss.stencilPassOpBack},${dss.stencilWriteMaskBack}`;
    return res;
}
