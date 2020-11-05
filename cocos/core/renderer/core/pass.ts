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
import { builtinResMgr } from '../../3d/builtin/init';
import { IPassInfo, IPassStates, IPropertyInfo } from '../../assets/effect-asset';
import { TextureBase } from '../../assets/texture-base';
import { RenderPassStage, RenderPriority } from '../../pipeline/define';
import { getPhaseID } from '../../pipeline/pass-phase';
import { Root } from '../../root';
import { murmurhash2_32_gc } from '../../utils/murmurhash2_gc';
import { IProgramInfo, programLib } from './program-lib';
import { samplerLib } from './sampler-lib';
import { PassView, BlendStatePool, RasterizerStatePool, DepthStencilStatePool,
    PassPool, DSPool, PassHandle, ShaderHandle, NULL_HANDLE } from './memory-pools';
import { customizeType, getBindingFromHandle, getPropertyTypeFromHandle, getDefaultFromType,
    getOffsetFromHandle, getTypeFromHandle, MacroRecord, MaterialProperty, type2reader, type2writer, PropertyType } from './pass-utils';
import { DescriptorSetLayoutInfo, Texture,  Device, Buffer, BufferInfo, BufferViewInfo,
    Sampler, DescriptorSet, DescriptorSetInfo, BlendState, BlendTarget, DepthStencilState,
    RasterizerState, BufferUsageBit, GetTypeSize, MemoryUsageBit, PrimitiveMode,
    Type, DynamicStateFlagBit, DynamicStateFlags, Feature } from '../../gfx';

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
        dirty: boolean,
        value: number[],
    };
}

const _bufferInfo = new BufferInfo(
    BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
    MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
);

const _bufferViewInfo = new BufferViewInfo(null!);
const _dsLayoutInfo = new DescriptorSetLayoutInfo();

const _dsInfo = new DescriptorSetInfo(null!);

export enum BatchingSchemes {
    INSTANCING = 1,
    VB_MERGING = 2,
};

// tslint:disable: no-shadowed-variable
export declare namespace Pass {
    export type getPropertyTypeFromHandle = typeof getPropertyTypeFromHandle;
    export type getTypeFromHandle = typeof getTypeFromHandle;
    export type getBindingFromHandle = typeof getBindingFromHandle;
    export type fillPipelineInfo = typeof Pass.fillPipelineInfo;
    export type getPassHash = typeof Pass.getPassHash;
    export type getOffsetFromHandle = typeof getOffsetFromHandle;
    export type PropertyType = typeof PropertyType;
}
// tslint:enable: no-shadowed-variable

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

    /**
     * @en Fill a pass represented by the given pass handle with the given override info
     * @param hPass The pass handle point to the pass
     * @param info The pass override info
     */
    public static fillPipelineInfo (hPass: PassHandle, info: PassOverrides) {
        if (info.priority !== undefined) { PassPool.set(hPass, PassView.PRIORITY, info.priority); }
        if (info.primitive !== undefined) { PassPool.set(hPass, PassView.PRIMITIVE, info.primitive); }
        if (info.stage !== undefined) { PassPool.set(hPass, PassView.STAGE, info.stage); }
        if (info.dynamicStates !== undefined) { PassPool.set(hPass, PassView.DYNAMIC_STATES, info.dynamicStates); }
        if (info.phase !== undefined) { PassPool.set(hPass, PassView.PHASE, getPhaseID(info.phase)); }

        const bs = BlendStatePool.get(PassPool.get(hPass, PassView.BLEND_STATE));
        if (info.blendState) {
            const bsInfo = info.blendState;
            if (bsInfo.targets) {
                bsInfo.targets.forEach((t, i) => {
                    if (!bs.targets[i]) bs.setTarget(i, new BlendTarget());
                    Object.assign(bs.targets[i], t);
                });
            }
            if (bsInfo.isA2C !== undefined) { bs.isA2C = bsInfo.isA2C; }
            if (bsInfo.isIndepend !== undefined) { bs.isIndepend = bsInfo.isIndepend; }
            if (bsInfo.blendColor !== undefined) { Object.assign(bs.blendColor, bsInfo.blendColor); }
        }
        if (info.rasterizerState) {
            RasterizerStatePool.get(PassPool.get(hPass, PassView.RASTERIZER_STATE)).set(info.rasterizerState);
        }
        if (info.depthStencilState) {
            DepthStencilStatePool.get(PassPool.get(hPass, PassView.DEPTH_STENCIL_STATE)).set(info.depthStencilState);
        }
    }

    /**
     * @en Get pass hash value by [[Pass]] hash information.
     * @zh 根据 [[Pass]] 的哈希信息获取哈希值。
     *
     * @param hPass Handle of the pass info used to compute hash value.
     */
    public static getPassHash (hPass: PassHandle, hShader: ShaderHandle) {
        let res = hShader + ',' + PassPool.get(hPass, PassView.PRIMITIVE) + ',' + PassPool.get(hPass, PassView.DYNAMIC_STATES);
        res += serializeBlendState(BlendStatePool.get(PassPool.get(hPass, PassView.BLEND_STATE)));
        res += serializeDepthStencilState(DepthStencilStatePool.get(PassPool.get(hPass, PassView.DEPTH_STENCIL_STATE)));
        res += serializeRasterizerState(RasterizerStatePool.get(PassPool.get(hPass, PassView.RASTERIZER_STATE)));
        return murmurhash2_32_gc(res, 666);
    }

    protected static getOffsetFromHandle = getOffsetFromHandle;

    // internal resources
    protected _rootBuffer: Buffer | null = null;
    protected _rootBufferDirty = false;
    protected _buffers: Buffer[] = [];
    protected _descriptorSet: DescriptorSet = null!;
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

    constructor (root: Root) {
        this._root = root;
        this._device = root.device;
    }

    /**
     * @en Initialize the pass with given pass info, shader will be compiled in the init process
     * @zh 根据指定参数初始化当前 pass，shader 会在这一阶段就尝试编译。
     */
    public initialize (info: IPassInfoFull) {
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
    public getHandle (name: string, offset = 0, targetType = Type.UNKNOWN) {
        let handle = this._propertyHandleMap[name]; if (!handle) { return 0; }
        if (targetType) { handle = customizeType(handle, targetType); }
        else if (offset) { handle = customizeType(handle, getTypeFromHandle(handle) - offset); }
        return handle + offset;
    }

    /**
     * @en Gets the uniform binding with its name
     * @zh 获取指定 uniform 的 binding。
     * @param name The name of target uniform
     */
    public getBinding (name: string) {
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
    public setUniform (handle: number, value: MaterialProperty) {
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
    public getUniform (handle: number, out: MaterialProperty) {
        const binding = Pass.getBindingFromHandle(handle);
        const type = Pass.getTypeFromHandle(handle);
        const ofs = Pass.getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        return type2reader[type](block, out, ofs);
    }

    /**
     * @en Sets an array type uniform value, if a uniform requires frequent update, please use this method.
     * @zh 设置指定数组类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle The handle for the target uniform
     * @param value New value
     */
    public setUniformArray (handle: number, value: MaterialProperty[]) {
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
    public bindTexture (binding: number, value: Texture, index?: number) {
        this._descriptorSet.bindTexture(binding, value, index || 0);
    }

    /**
     * @en Bind a GFX [[Sampler]] the the given uniform binding
     * @zh 绑定实际 GFX [[Sampler]] 到指定 binding。
     * @param binding The binding for target uniform of sampler type
     * @param value Target sampler
     */
    public bindSampler (binding: number, value: Sampler, index?: number) {
        this._descriptorSet.bindSampler(binding, value, index || 0);
    }

    /**
     * @en Sets the dynamic pipeline state property at runtime
     * @zh 设置运行时 pass 内可动态更新的管线状态属性。
     * @param state Target dynamic state
     * @param value Target value
     */
    public setDynamicState (state: DynamicStateFlagBit, value: any) {
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
    public overridePipelineStates (original: IPassInfo, overrides: PassOverrides) {
        console.warn('base pass cannot override states, please use pass instance instead.');
    }

    /**
     * @en Update the current uniforms data.
     * @zh 更新当前 Uniform 数据。
     */
    public update () {
        if (this._rootBufferDirty && this._rootBuffer) {
            this._rootBuffer.update(this._rootBlock!);
            this._rootBufferDirty = false;
        }
        this._descriptorSet.update();
    }

    /**
     * @en Destroy the current pass.
     * @zh 销毁当前 pass。
     */
    public destroy () {
        for (let i = 0; i < this._shaderInfo.blocks.length; i++) {
            const u = this._shaderInfo.blocks[i];
            this._buffers[u.binding].destroy();
        }
        this._buffers = [];

        if (this._rootBuffer) {
            this._rootBuffer.destroy();
            this._rootBlock = null;
        }

        // textures are reused
        this._descriptorSet = null!;

        if (this._handle) {
            RasterizerStatePool.free(PassPool.get(this._handle, PassView.RASTERIZER_STATE));
            DepthStencilStatePool.free(PassPool.get(this._handle, PassView.DEPTH_STENCIL_STATE));
            BlendStatePool.free(PassPool.get(this._handle, PassView.BLEND_STATE));
            DSPool.free(PassPool.get(this._handle, PassView.DESCRIPTOR_SET));
            PassPool.free(this._handle); this._handle = NULL_HANDLE;
        }
    }

    /**
     * @en Resets the value of the given uniform by name to the default value in [[EffectAsset]].
     * This method does not support array type uniform.
     * @zh 重置指定（非数组） Uniform 为 [[EffectAsset]] 默认值。
     */
    public resetUniform (name: string) {
        const handle = this.getHandle(name);
        if (!handle) return;
        const type = Pass.getTypeFromHandle(handle);
        const binding = Pass.getBindingFromHandle(handle);
        const ofs = Pass.getOffsetFromHandle(handle);
        const block = this._blocks[binding];
        const info = this._properties[name];
        const value = info && info.value || getDefaultFromType(type);
        type2writer[type](block, value, ofs);
        this._rootBufferDirty = true;
    }

    /**
     * @en Resets the value of the given texture by name to the default value in [[EffectAsset]].
     * @zh 重置指定贴图为 [[EffectAsset]] 默认值。
     */
    public resetTexture (name: string, index?: number) {
        const handle = this.getHandle(name);
        if (!handle) return;
        const type = Pass.getTypeFromHandle(handle);
        const binding = Pass.getBindingFromHandle(handle);
        const info = this._properties[name];
        const value = info && info.value;
        const texName = value ? value + '-texture' : getDefaultFromType(type) as string;
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
    public resetUBOs () {
        for (let i = 0; i < this._shaderInfo.blocks.length; i++) {
            const u = this._shaderInfo.blocks[i];
            const block = this._blocks[u.binding];
            let ofs = 0;
            for (let j = 0; j < u.members.length; j++) {
                const cur = u.members[j];
                const info = this._properties[cur.name];
                const givenDefault = info && info.value;
                const value = (givenDefault ? givenDefault : getDefaultFromType(cur.type)) as number[];
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
    public resetTextures () {
        for (let i = 0; i < this._shaderInfo.samplers.length; i++) {
            const u = this._shaderInfo.samplers[i];
            for (let j = 0; j < u.count; j++) {
                this.resetTexture(u.name, j);
            }
        }
    }

    /**
     * @en Try to compile the shader and retrieve related resources references.
     * @zh 尝试编译 shader 并获取相关资源引用。
     */
    public tryCompile () {
        const pipeline = this._root.pipeline;
        if (!pipeline) { return false; }
        this._syncBatchingScheme();
        this._hShaderDefault = programLib.getGFXShader(this._device, this._programName, this._defines, pipeline);
        if (!this._hShaderDefault) { console.warn(`create shader ${this._programName} failed`); return false; }
        PassPool.set(this._handle, PassView.PIPELINE_LAYOUT, programLib.getTemplate(this._programName).hPipelineLayout);
        PassPool.set(this._handle, PassView.HASH, Pass.getPassHash(this._handle, this._hShaderDefault));
        return true;
    }

    /**
     * @en Gets the shader variant of the current pass and given macro patches
     * @zh 结合指定的编译宏组合获取当前 Pass 的 Shader Variant
     * @param patches The macro patches
     */
    public getShaderVariant (patches: IMacroPatch[] | null = null): ShaderHandle {
        if (!this._hShaderDefault && !this.tryCompile()) {
            console.warn(`pass resources incomplete`);
            return NULL_HANDLE;
        }

        if (!patches) {
            return this._hShaderDefault;
        }

        if (EDITOR) {
            for (let i = 0; i < patches.length; i++) {
                if (!patches[i].name.startsWith('CC_')) {
                    console.warn('cannot patch non-builtin macros');
                    return NULL_HANDLE;
                }
            }
        }

        const pipeline = this._root.pipeline!;
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
    public beginChangeStatesSilently () {}
    /**
     * @private
     */
    public endChangeStatesSilently () {}

    protected _doInit (info: IPassInfoFull, copyDefines = false) {
        const handle = this._handle = PassPool.alloc();
        PassPool.set(handle, PassView.PRIORITY, RenderPriority.DEFAULT);
        PassPool.set(handle, PassView.STAGE, RenderPassStage.DEFAULT);
        PassPool.set(handle, PassView.PHASE, getPhaseID('default'));
        PassPool.set(handle, PassView.PRIMITIVE, PrimitiveMode.TRIANGLE_LIST);
        PassPool.set(handle, PassView.RASTERIZER_STATE, RasterizerStatePool.alloc());
        PassPool.set(handle, PassView.DEPTH_STENCIL_STATE, DepthStencilStatePool.alloc());
        PassPool.set(handle, PassView.BLEND_STATE, BlendStatePool.alloc());

        this._passIndex = info.passIndex;
        this._propertyIndex = info.propertyIndex !== undefined ? info.propertyIndex : info.passIndex;
        this._programName = info.program;
        this._defines = copyDefines ? Object.assign({}, info.defines) : info.defines;
        this._shaderInfo = programLib.getTemplate(info.program);
        this._properties = info.properties || this._properties;
        // pipeline state
        const device = this._device;
        Pass.fillPipelineInfo(handle, info);
        if (info.stateOverrides) { Pass.fillPipelineInfo(handle, info.stateOverrides); }

        // init descriptor set
        _dsInfo.layout = programLib.getDescriptorSetLayout(this._device, info.program);
        const dsHandle = DSPool.alloc(this._device, _dsInfo);
        PassPool.set(this._handle, PassView.DESCRIPTOR_SET, dsHandle);
        this._descriptorSet = DSPool.get(dsHandle);

        // calculate total size required
        const { blocks, blockSizes } = this._shaderInfo;
        const alignment = device.uboOffsetAlignment;
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
            const binding = blocks[i].binding;
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
        const directHandleMap = this._propertyHandleMap = this._shaderInfo.handleMap;
        const indirectHandleMap: Record<string, number> = {};
        for (const name in this._properties) {
            const prop = this._properties[name];
            if (!prop.handleInfo) { continue; }
            indirectHandleMap[name] = this.getHandle.apply(this, prop.handleInfo)!;
        }
        Object.assign(directHandleMap, indirectHandleMap);
    }

    protected _syncBatchingScheme () {
        if (this._defines.USE_INSTANCING) {
            if (this._device.hasFeature(Feature.INSTANCED_ARRAYS)) {
                PassPool.set(this._handle, PassView.BATCHING_SCHEME, BatchingSchemes.INSTANCING);
            } else {
                this._defines.USE_INSTANCING = false;
                PassPool.set(this._handle, PassView.BATCHING_SCHEME, 0);
            }
        } else if (this._defines.USE_BATCHING) {
            PassPool.set(this._handle, PassView.BATCHING_SCHEME, BatchingSchemes.VB_MERGING);
        } else {
            PassPool.set(this._handle, PassView.BATCHING_SCHEME, 0);
        }
    }

    // infos
    get root () { return this._root; }
    get device () { return this._device; }
    get shaderInfo () { return this._shaderInfo; }
    get localSetLayout () { return programLib.getDescriptorSetLayout(this._device, this._programName, true); }
    get program () { return this._programName; }
    get properties () { return this._properties; }
    get defines () { return this._defines; }
    get passIndex () { return this._passIndex; }
    get propertyIndex () { return this._propertyIndex; }
    // data
    get dynamics () { return this._dynamics; }
    get blocks () { return this._blocks; }
    // states
    get handle () { return this._handle; }
    get priority () { return PassPool.get(this._handle, PassView.PRIORITY); }
    get primitive () { return PassPool.get(this._handle, PassView.PRIMITIVE); }
    get stage () { return PassPool.get(this._handle, PassView.STAGE); }
    get phase () { return PassPool.get(this._handle, PassView.PHASE); }
    get rasterizerState () { return RasterizerStatePool.get(PassPool.get(this._handle, PassView.RASTERIZER_STATE)); }
    get depthStencilState () { return DepthStencilStatePool.get(PassPool.get(this._handle, PassView.DEPTH_STENCIL_STATE)); }
    get blendState () { return BlendStatePool.get(PassPool.get(this._handle, PassView.BLEND_STATE)); }
    get dynamicStates () { return PassPool.get(this._handle, PassView.DYNAMIC_STATES); }
    get batchingScheme () { return PassPool.get(this._handle, PassView.BATCHING_SCHEME); }
    get descriptorSet () { return this._descriptorSet; }
    get hash () { return PassPool.get(this._handle, PassView.HASH); }

    get rootBufferDirty () { return this._rootBufferDirty; }
}

function serializeBlendState (bs: BlendState) {
    let res = `,bs,${bs.isA2C},${bs.blendColor}`;
    for (const t of bs.targets) {
        res += `,bt,${t.blend},${t.blendEq},${t.blendAlphaEq},${t.blendColorMask}`;
        res += `,${t.blendSrc},${t.blendDst},${t.blendSrcAlpha},${t.blendDstAlpha}`;
    }
    return res;
}

function serializeRasterizerState (rs: RasterizerState) {
    return ',rs,' + rs.cullMode + ',' + rs.depthBias + ',' + rs.isFrontFaceCCW;
}

function serializeDepthStencilState (dss: DepthStencilState) {
    let res = `,dss,${dss.depthTest},${dss.depthWrite},${dss.depthFunc}`;
    res += `,${dss.stencilTestFront},${dss.stencilFuncFront},${dss.stencilRefFront},${dss.stencilReadMaskFront}`;
    res += `,${dss.stencilFailOpFront},${dss.stencilZFailOpFront},${dss.stencilPassOpFront},${dss.stencilWriteMaskFront}`;
    res += `,${dss.stencilTestBack},${dss.stencilFuncBack},${dss.stencilRefBack},${dss.stencilReadMaskBack}`;
    res += `,${dss.stencilFailOpBack},${dss.stencilZFailOpBack},${dss.stencilPassOpBack},${dss.stencilWriteMaskBack}`;
    return res;
}

function serializeDynamicState (dynamicStates: DynamicStateFlags[]) {
    let res = ',ds';
    for (const ds in dynamicStates) {
        res += ',' + ds;
    }
    return res;
}
