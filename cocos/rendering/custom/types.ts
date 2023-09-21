/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { ResolveMode, ShaderStageFlagBit, Type, UniformBlock } from '../../gfx';
import { ReflectionProbe } from '../../render-scene/scene/reflection-probe';
import { Light } from '../../render-scene/scene';
import { OutputArchive, InputArchive } from './archive';
import { saveUniformBlock, loadUniformBlock } from './serialization';
import { RecyclePool } from '../../core/memop';

export enum UpdateFrequency {
    PER_INSTANCE,
    PER_BATCH,
    PER_PHASE,
    PER_PASS,
    COUNT,
}

export function getUpdateFrequencyName (e: UpdateFrequency): string {
    switch (e) {
    case UpdateFrequency.PER_INSTANCE:
        return 'PER_INSTANCE';
    case UpdateFrequency.PER_BATCH:
        return 'PER_BATCH';
    case UpdateFrequency.PER_PHASE:
        return 'PER_PHASE';
    case UpdateFrequency.PER_PASS:
        return 'PER_PASS';
    case UpdateFrequency.COUNT:
        return 'COUNT';
    default:
        return '';
    }
}

export enum ParameterType {
    CONSTANTS,
    CBV,
    UAV,
    SRV,
    TABLE,
    SSV,
}

export function getParameterTypeName (e: ParameterType): string {
    switch (e) {
    case ParameterType.CONSTANTS:
        return 'CONSTANTS';
    case ParameterType.CBV:
        return 'CBV';
    case ParameterType.UAV:
        return 'UAV';
    case ParameterType.SRV:
        return 'SRV';
    case ParameterType.TABLE:
        return 'TABLE';
    case ParameterType.SSV:
        return 'SSV';
    default:
        return '';
    }
}

export enum ResourceResidency {
    MANAGED,
    MEMORYLESS,
    PERSISTENT,
    EXTERNAL,
    BACKBUFFER,
}

export function getResourceResidencyName (e: ResourceResidency): string {
    switch (e) {
    case ResourceResidency.MANAGED:
        return 'MANAGED';
    case ResourceResidency.MEMORYLESS:
        return 'MEMORYLESS';
    case ResourceResidency.PERSISTENT:
        return 'PERSISTENT';
    case ResourceResidency.EXTERNAL:
        return 'EXTERNAL';
    case ResourceResidency.BACKBUFFER:
        return 'BACKBUFFER';
    default:
        return '';
    }
}

export enum QueueHint {
    NONE,
    OPAQUE,
    MASK,
    BLEND,
    RENDER_OPAQUE = OPAQUE,
    RENDER_CUTOUT = MASK,
    RENDER_TRANSPARENT = BLEND,
}

export function getQueueHintName (e: QueueHint): string {
    switch (e) {
    case QueueHint.NONE:
        return 'NONE';
    case QueueHint.OPAQUE:
        return 'OPAQUE';
    case QueueHint.MASK:
        return 'MASK';
    case QueueHint.BLEND:
        return 'BLEND';
    default:
        return '';
    }
}

export enum ResourceDimension {
    BUFFER,
    TEXTURE1D,
    TEXTURE2D,
    TEXTURE3D,
}

export function getResourceDimensionName (e: ResourceDimension): string {
    switch (e) {
    case ResourceDimension.BUFFER:
        return 'BUFFER';
    case ResourceDimension.TEXTURE1D:
        return 'TEXTURE1D';
    case ResourceDimension.TEXTURE2D:
        return 'TEXTURE2D';
    case ResourceDimension.TEXTURE3D:
        return 'TEXTURE3D';
    default:
        return '';
    }
}

export enum ResourceFlags {
    NONE = 0,
    UNIFORM = 0x1,
    INDIRECT = 0x2,
    STORAGE = 0x4,
    SAMPLED = 0x8,
    COLOR_ATTACHMENT = 0x10,
    DEPTH_STENCIL_ATTACHMENT = 0x20,
    INPUT_ATTACHMENT = 0x40,
    SHADING_RATE = 0x80,
    TRANSFER_SRC = 0x100,
    TRANSFER_DST = 0x200,
}

export enum TaskType {
    SYNC,
    ASYNC,
}

export function getTaskTypeName (e: TaskType): string {
    switch (e) {
    case TaskType.SYNC:
        return 'SYNC';
    case TaskType.ASYNC:
        return 'ASYNC';
    default:
        return '';
    }
}

export enum SceneFlags {
    NONE = 0,
    OPAQUE = 0x1,
    MASK = 0x2,
    BLEND = 0x4,
    OPAQUE_OBJECT = OPAQUE,
    CUTOUT_OBJECT = MASK,
    TRANSPARENT_OBJECT = BLEND,
    SHADOW_CASTER = 0x8,
    UI = 0x10,
    DEFAULT_LIGHTING = 0x20,
    VOLUMETRIC_LIGHTING = 0x40,
    CLUSTERED_LIGHTING = 0x80,
    PLANAR_SHADOW = 0x100,
    GEOMETRY = 0x200,
    PROFILER = 0x400,
    DRAW_INSTANCING = 0x800,
    DRAW_NON_INSTANCING = 0x1000,
    REFLECTION_PROBE = 0x2000,
    GPU_DRIVEN = 0x4000,
    NON_BUILTIN = 0x8000,
    ALL = 0xFFFFFFFF,
}

export enum LightingMode {
    NONE,
    DEFAULT,
    CLUSTERED,
}

export function getLightingModeName (e: LightingMode): string {
    switch (e) {
    case LightingMode.NONE:
        return 'NONE';
    case LightingMode.DEFAULT:
        return 'DEFAULT';
    case LightingMode.CLUSTERED:
        return 'CLUSTERED';
    default:
        return '';
    }
}

export enum AttachmentType {
    RENDER_TARGET,
    DEPTH_STENCIL,
    SHADING_RATE,
}

export function getAttachmentTypeName (e: AttachmentType): string {
    switch (e) {
    case AttachmentType.RENDER_TARGET:
        return 'RENDER_TARGET';
    case AttachmentType.DEPTH_STENCIL:
        return 'DEPTH_STENCIL';
    case AttachmentType.SHADING_RATE:
        return 'SHADING_RATE';
    default:
        return '';
    }
}

export enum AccessType {
    READ,
    READ_WRITE,
    WRITE,
}

export function getAccessTypeName (e: AccessType): string {
    switch (e) {
    case AccessType.READ:
        return 'READ';
    case AccessType.READ_WRITE:
        return 'READ_WRITE';
    case AccessType.WRITE:
        return 'WRITE';
    default:
        return '';
    }
}

export enum ClearValueType {
    NONE,
    FLOAT_TYPE,
    INT_TYPE,
}

export function getClearValueTypeName (e: ClearValueType): string {
    switch (e) {
    case ClearValueType.NONE:
        return 'NONE';
    case ClearValueType.FLOAT_TYPE:
        return 'FLOAT_TYPE';
    case ClearValueType.INT_TYPE:
        return 'INT_TYPE';
    default:
        return '';
    }
}

export class LightInfo {
    constructor (light: Light | null = null, level = 0, culledByLight = false, probe: ReflectionProbe | null = null) {
        this.light = light;
        this.probe = probe;
        this.level = level;
        this.culledByLight = culledByLight;
    }
    reset (light: Light | null = null, level = 0, culledByLight = false, probe: ReflectionProbe | null = null): void {
        this.light = light;
        this.probe = probe;
        this.level = level;
        this.culledByLight = culledByLight;
    }
    /*refcount*/ light: Light | null;
    /*pointer*/ probe: ReflectionProbe | null;
    level: number;
    culledByLight: boolean;
}

export enum DescriptorTypeOrder {
    UNIFORM_BUFFER,
    DYNAMIC_UNIFORM_BUFFER,
    SAMPLER_TEXTURE,
    SAMPLER,
    TEXTURE,
    STORAGE_BUFFER,
    DYNAMIC_STORAGE_BUFFER,
    STORAGE_IMAGE,
    INPUT_ATTACHMENT,
}

export function getDescriptorTypeOrderName (e: DescriptorTypeOrder): string {
    switch (e) {
    case DescriptorTypeOrder.UNIFORM_BUFFER:
        return 'UNIFORM_BUFFER';
    case DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER:
        return 'DYNAMIC_UNIFORM_BUFFER';
    case DescriptorTypeOrder.SAMPLER_TEXTURE:
        return 'SAMPLER_TEXTURE';
    case DescriptorTypeOrder.SAMPLER:
        return 'SAMPLER';
    case DescriptorTypeOrder.TEXTURE:
        return 'TEXTURE';
    case DescriptorTypeOrder.STORAGE_BUFFER:
        return 'STORAGE_BUFFER';
    case DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER:
        return 'DYNAMIC_STORAGE_BUFFER';
    case DescriptorTypeOrder.STORAGE_IMAGE:
        return 'STORAGE_IMAGE';
    case DescriptorTypeOrder.INPUT_ATTACHMENT:
        return 'INPUT_ATTACHMENT';
    default:
        return '';
    }
}

export class Descriptor {
    constructor (type: Type = Type.UNKNOWN) {
        this.type = type;
    }
    reset (type: Type = Type.UNKNOWN): void {
        this.type = type;
        this.count = 1;
    }
    type: Type;
    count = 1;
}

export class DescriptorBlock {
    reset (): void {
        this.descriptors.clear();
        this.uniformBlocks.clear();
        this.capacity = 0;
        this.count = 0;
    }
    readonly descriptors: Map<string, Descriptor> = new Map<string, Descriptor>();
    readonly uniformBlocks: Map<string, UniformBlock> = new Map<string, UniformBlock>();
    capacity = 0;
    count = 0;
}

export class DescriptorBlockFlattened {
    reset (): void {
        this.descriptorNames.length = 0;
        this.uniformBlockNames.length = 0;
        this.descriptors.length = 0;
        this.uniformBlocks.length = 0;
        this.capacity = 0;
        this.count = 0;
    }
    readonly descriptorNames: string[] = [];
    readonly uniformBlockNames: string[] = [];
    readonly descriptors: Descriptor[] = [];
    readonly uniformBlocks: UniformBlock[] = [];
    capacity = 0;
    count = 0;
}

export class DescriptorBlockIndex {
    constructor (updateFrequency: UpdateFrequency = UpdateFrequency.PER_INSTANCE, parameterType: ParameterType = ParameterType.CONSTANTS, descriptorType: DescriptorTypeOrder = DescriptorTypeOrder.UNIFORM_BUFFER, visibility: ShaderStageFlagBit = ShaderStageFlagBit.NONE) {
        this.updateFrequency = updateFrequency;
        this.parameterType = parameterType;
        this.descriptorType = descriptorType;
        this.visibility = visibility;
    }
    updateFrequency: UpdateFrequency;
    parameterType: ParameterType;
    descriptorType: DescriptorTypeOrder;
    visibility: ShaderStageFlagBit;
}

export enum ResolveFlags {
    NONE = 0,
    COLOR = 1 << 0,
    DEPTH = 1 << 1,
    STENCIL = 1 << 2,
}

export class ResolvePair {
    constructor (
        source = '',
        target = '',
        resolveFlags: ResolveFlags = ResolveFlags.NONE,
        mode: ResolveMode = ResolveMode.SAMPLE_ZERO,
        mode1: ResolveMode = ResolveMode.SAMPLE_ZERO,
    ) {
        this.source = source;
        this.target = target;
        this.resolveFlags = resolveFlags;
        this.mode = mode;
        this.mode1 = mode1;
    }
    reset (
        source = '',
        target = '',
        resolveFlags: ResolveFlags = ResolveFlags.NONE,
        mode: ResolveMode = ResolveMode.SAMPLE_ZERO,
        mode1: ResolveMode = ResolveMode.SAMPLE_ZERO,
    ): void {
        this.source = source;
        this.target = target;
        this.resolveFlags = resolveFlags;
        this.mode = mode;
        this.mode1 = mode1;
    }
    source: string;
    target: string;
    resolveFlags: ResolveFlags;
    mode: ResolveMode;
    mode1: ResolveMode;
}

export class CopyPair {
    constructor (
        source = '',
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        sourceMostDetailedMip = 0,
        sourceFirstSlice = 0,
        sourcePlaneSlice = 0,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ) {
        this.source = source;
        this.target = target;
        this.mipLevels = mipLevels;
        this.numSlices = numSlices;
        this.sourceMostDetailedMip = sourceMostDetailedMip;
        this.sourceFirstSlice = sourceFirstSlice;
        this.sourcePlaneSlice = sourcePlaneSlice;
        this.targetMostDetailedMip = targetMostDetailedMip;
        this.targetFirstSlice = targetFirstSlice;
        this.targetPlaneSlice = targetPlaneSlice;
    }
    reset (
        source = '',
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        sourceMostDetailedMip = 0,
        sourceFirstSlice = 0,
        sourcePlaneSlice = 0,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ): void {
        this.source = source;
        this.target = target;
        this.mipLevels = mipLevels;
        this.numSlices = numSlices;
        this.sourceMostDetailedMip = sourceMostDetailedMip;
        this.sourceFirstSlice = sourceFirstSlice;
        this.sourcePlaneSlice = sourcePlaneSlice;
        this.targetMostDetailedMip = targetMostDetailedMip;
        this.targetFirstSlice = targetFirstSlice;
        this.targetPlaneSlice = targetPlaneSlice;
    }
    source: string;
    target: string;
    mipLevels: number;
    numSlices: number;
    sourceMostDetailedMip: number;
    sourceFirstSlice: number;
    sourcePlaneSlice: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}

export class UploadPair {
    constructor (
        source: Uint8Array = new Uint8Array(0),
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ) {
        this.source = source;
        this.target = target;
        this.mipLevels = mipLevels;
        this.numSlices = numSlices;
        this.targetMostDetailedMip = targetMostDetailedMip;
        this.targetFirstSlice = targetFirstSlice;
        this.targetPlaneSlice = targetPlaneSlice;
    }
    reset (
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ): void {
        // source: Uint8Array size unchanged
        this.target = target;
        this.mipLevels = mipLevels;
        this.numSlices = numSlices;
        this.targetMostDetailedMip = targetMostDetailedMip;
        this.targetFirstSlice = targetFirstSlice;
        this.targetPlaneSlice = targetPlaneSlice;
    }
    readonly source: Uint8Array;
    target: string;
    mipLevels: number;
    numSlices: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}

export class MovePair {
    constructor (
        source = '',
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ) {
        this.source = source;
        this.target = target;
        this.mipLevels = mipLevels;
        this.numSlices = numSlices;
        this.targetMostDetailedMip = targetMostDetailedMip;
        this.targetFirstSlice = targetFirstSlice;
        this.targetPlaneSlice = targetPlaneSlice;
    }
    reset (
        source = '',
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ): void {
        this.source = source;
        this.target = target;
        this.mipLevels = mipLevels;
        this.numSlices = numSlices;
        this.targetMostDetailedMip = targetMostDetailedMip;
        this.targetFirstSlice = targetFirstSlice;
        this.targetPlaneSlice = targetPlaneSlice;
    }
    source: string;
    target: string;
    mipLevels: number;
    numSlices: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}

export class PipelineStatistics {
    reset (): void {
        this.numRenderPasses = 0;
        this.numManagedTextures = 0;
        this.totalManagedTextures = 0;
        this.numUploadBuffers = 0;
        this.numUploadBufferViews = 0;
        this.numFreeUploadBuffers = 0;
        this.numFreeUploadBufferViews = 0;
        this.numDescriptorSets = 0;
        this.numFreeDescriptorSets = 0;
        this.numInstancingBuffers = 0;
        this.numInstancingUniformBlocks = 0;
    }
    numRenderPasses = 0;
    numManagedTextures = 0;
    totalManagedTextures = 0;
    numUploadBuffers = 0;
    numUploadBufferViews = 0;
    numFreeUploadBuffers = 0;
    numFreeUploadBufferViews = 0;
    numDescriptorSets = 0;
    numFreeDescriptorSets = 0;
    numInstancingBuffers = 0;
    numInstancingUniformBlocks = 0;
}

export class RenderCommonObjectPoolSettings {
    constructor (batchSize: number) {
        this.lightInfoBatchSize = batchSize;
        this.descriptorBatchSize = batchSize;
        this.descriptorBlockBatchSize = batchSize;
        this.descriptorBlockFlattenedBatchSize = batchSize;
        this.descriptorBlockIndexBatchSize = batchSize;
        this.resolvePairBatchSize = batchSize;
        this.copyPairBatchSize = batchSize;
        this.uploadPairBatchSize = batchSize;
        this.movePairBatchSize = batchSize;
        this.pipelineStatisticsBatchSize = batchSize;
    }
    lightInfoBatchSize = 16;
    descriptorBatchSize = 16;
    descriptorBlockBatchSize = 16;
    descriptorBlockFlattenedBatchSize = 16;
    descriptorBlockIndexBatchSize = 16;
    resolvePairBatchSize = 16;
    copyPairBatchSize = 16;
    uploadPairBatchSize = 16;
    movePairBatchSize = 16;
    pipelineStatisticsBatchSize = 16;
}

export class RenderCommonObjectPool {
    constructor (settings: RenderCommonObjectPoolSettings) {
        this._lightInfo = new RecyclePool<LightInfo>(() => new LightInfo(), settings.lightInfoBatchSize);
        this._descriptor = new RecyclePool<Descriptor>(() => new Descriptor(), settings.descriptorBatchSize);
        this._descriptorBlock = new RecyclePool<DescriptorBlock>(() => new DescriptorBlock(), settings.descriptorBlockBatchSize);
        this._descriptorBlockFlattened = new RecyclePool<DescriptorBlockFlattened>(() => new DescriptorBlockFlattened(), settings.descriptorBlockFlattenedBatchSize);
        this._descriptorBlockIndex = new RecyclePool<DescriptorBlockIndex>(() => new DescriptorBlockIndex(), settings.descriptorBlockIndexBatchSize);
        this._resolvePair = new RecyclePool<ResolvePair>(() => new ResolvePair(), settings.resolvePairBatchSize);
        this._copyPair = new RecyclePool<CopyPair>(() => new CopyPair(), settings.copyPairBatchSize);
        this._uploadPair = new RecyclePool<UploadPair>(() => new UploadPair(), settings.uploadPairBatchSize);
        this._movePair = new RecyclePool<MovePair>(() => new MovePair(), settings.movePairBatchSize);
        this._pipelineStatistics = new RecyclePool<PipelineStatistics>(() => new PipelineStatistics(), settings.pipelineStatisticsBatchSize);
    }
    reset (): void {
        this._lightInfo.reset();
        this._descriptor.reset();
        this._descriptorBlock.reset();
        this._descriptorBlockFlattened.reset();
        this._descriptorBlockIndex.reset();
        this._resolvePair.reset();
        this._copyPair.reset();
        this._uploadPair.reset();
        this._movePair.reset();
        this._pipelineStatistics.reset();
    }
    createLightInfo (
        light: Light | null = null,
        level = 0,
        culledByLight = false,
        probe: ReflectionProbe | null = null,
    ): LightInfo {
        const v = this._lightInfo.add();
        v.reset(light, level, culledByLight, probe);
        return v;
    }
    createDescriptor (
        type: Type = Type.UNKNOWN,
    ): Descriptor {
        const v = this._descriptor.add();
        v.reset(type);
        return v;
    }
    createDescriptorBlock (): DescriptorBlock {
        const v = this._descriptorBlock.add();
        v.reset();
        return v;
    }
    createDescriptorBlockFlattened (): DescriptorBlockFlattened {
        const v = this._descriptorBlockFlattened.add();
        v.reset();
        return v;
    }
    createDescriptorBlockIndex (
        updateFrequency: UpdateFrequency = UpdateFrequency.PER_INSTANCE,
        parameterType: ParameterType = ParameterType.CONSTANTS,
        descriptorType: DescriptorTypeOrder = DescriptorTypeOrder.UNIFORM_BUFFER,
        visibility: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
    ): DescriptorBlockIndex {
        const v = this._descriptorBlockIndex.add();
        v.updateFrequency = updateFrequency;
        v.parameterType = parameterType;
        v.descriptorType = descriptorType;
        v.visibility = visibility;
        return v;
    }
    createResolvePair (
        source = '',
        target = '',
        resolveFlags: ResolveFlags = ResolveFlags.NONE,
        mode: ResolveMode = ResolveMode.SAMPLE_ZERO,
        mode1: ResolveMode = ResolveMode.SAMPLE_ZERO,
    ): ResolvePair {
        const v = this._resolvePair.add();
        v.reset(source, target, resolveFlags, mode, mode1);
        return v;
    }
    createCopyPair (
        source = '',
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        sourceMostDetailedMip = 0,
        sourceFirstSlice = 0,
        sourcePlaneSlice = 0,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ): CopyPair {
        const v = this._copyPair.add();
        v.reset(source, target, mipLevels, numSlices, sourceMostDetailedMip, sourceFirstSlice, sourcePlaneSlice, targetMostDetailedMip, targetFirstSlice, targetPlaneSlice);
        return v;
    }
    createUploadPair (
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ): UploadPair {
        const v = this._uploadPair.add();
        v.reset(target, mipLevels, numSlices, targetMostDetailedMip, targetFirstSlice, targetPlaneSlice);
        return v;
    }
    createMovePair (
        source = '',
        target = '',
        mipLevels = 0xFFFFFFFF,
        numSlices = 0xFFFFFFFF,
        targetMostDetailedMip = 0,
        targetFirstSlice = 0,
        targetPlaneSlice = 0,
    ): MovePair {
        const v = this._movePair.add();
        v.reset(source, target, mipLevels, numSlices, targetMostDetailedMip, targetFirstSlice, targetPlaneSlice);
        return v;
    }
    createPipelineStatistics (): PipelineStatistics {
        const v = this._pipelineStatistics.add();
        v.reset();
        return v;
    }
    private readonly _lightInfo: RecyclePool<LightInfo>;
    private readonly _descriptor: RecyclePool<Descriptor>;
    private readonly _descriptorBlock: RecyclePool<DescriptorBlock>;
    private readonly _descriptorBlockFlattened: RecyclePool<DescriptorBlockFlattened>;
    private readonly _descriptorBlockIndex: RecyclePool<DescriptorBlockIndex>;
    private readonly _resolvePair: RecyclePool<ResolvePair>;
    private readonly _copyPair: RecyclePool<CopyPair>;
    private readonly _uploadPair: RecyclePool<UploadPair>;
    private readonly _movePair: RecyclePool<MovePair>;
    private readonly _pipelineStatistics: RecyclePool<PipelineStatistics>;
}

export function saveLightInfo (ar: OutputArchive, v: LightInfo): void {
    // skip, v.light: Light
    // skip, v.probe: ReflectionProbe
    ar.writeNumber(v.level);
    ar.writeBool(v.culledByLight);
}

export function loadLightInfo (ar: InputArchive, v: LightInfo): void {
    // skip, v.light: Light
    // skip, v.probe: ReflectionProbe
    v.level = ar.readNumber();
    v.culledByLight = ar.readBool();
}

export function saveDescriptor (ar: OutputArchive, v: Descriptor): void {
    ar.writeNumber(v.type);
    ar.writeNumber(v.count);
}

export function loadDescriptor (ar: InputArchive, v: Descriptor): void {
    v.type = ar.readNumber();
    v.count = ar.readNumber();
}

export function saveDescriptorBlock (ar: OutputArchive, v: DescriptorBlock): void {
    ar.writeNumber(v.descriptors.size); // Map<string, Descriptor>
    for (const [k1, v1] of v.descriptors) {
        ar.writeString(k1);
        saveDescriptor(ar, v1);
    }
    ar.writeNumber(v.uniformBlocks.size); // Map<string, UniformBlock>
    for (const [k1, v1] of v.uniformBlocks) {
        ar.writeString(k1);
        saveUniformBlock(ar, v1);
    }
    ar.writeNumber(v.capacity);
    ar.writeNumber(v.count);
}

export function loadDescriptorBlock (ar: InputArchive, v: DescriptorBlock): void {
    let sz = 0;
    sz = ar.readNumber(); // Map<string, Descriptor>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = new Descriptor();
        loadDescriptor(ar, v1);
        v.descriptors.set(k1, v1);
    }
    sz = ar.readNumber(); // Map<string, UniformBlock>
    for (let i1 = 0; i1 !== sz; ++i1) {
        const k1 = ar.readString();
        const v1 = new UniformBlock();
        loadUniformBlock(ar, v1);
        v.uniformBlocks.set(k1, v1);
    }
    v.capacity = ar.readNumber();
    v.count = ar.readNumber();
}

export function saveDescriptorBlockFlattened (ar: OutputArchive, v: DescriptorBlockFlattened): void {
    ar.writeNumber(v.descriptorNames.length); // string[]
    for (const v1 of v.descriptorNames) {
        ar.writeString(v1);
    }
    ar.writeNumber(v.uniformBlockNames.length); // string[]
    for (const v1 of v.uniformBlockNames) {
        ar.writeString(v1);
    }
    ar.writeNumber(v.descriptors.length); // Descriptor[]
    for (const v1 of v.descriptors) {
        saveDescriptor(ar, v1);
    }
    ar.writeNumber(v.uniformBlocks.length); // UniformBlock[]
    for (const v1 of v.uniformBlocks) {
        saveUniformBlock(ar, v1);
    }
    ar.writeNumber(v.capacity);
    ar.writeNumber(v.count);
}

export function loadDescriptorBlockFlattened (ar: InputArchive, v: DescriptorBlockFlattened): void {
    let sz = 0;
    sz = ar.readNumber(); // string[]
    v.descriptorNames.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        v.descriptorNames[i1] = ar.readString();
    }
    sz = ar.readNumber(); // string[]
    v.uniformBlockNames.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        v.uniformBlockNames[i1] = ar.readString();
    }
    sz = ar.readNumber(); // Descriptor[]
    v.descriptors.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = new Descriptor();
        loadDescriptor(ar, v1);
        v.descriptors[i1] = v1;
    }
    sz = ar.readNumber(); // UniformBlock[]
    v.uniformBlocks.length = sz;
    for (let i1 = 0; i1 !== sz; ++i1) {
        const v1 = new UniformBlock();
        loadUniformBlock(ar, v1);
        v.uniformBlocks[i1] = v1;
    }
    v.capacity = ar.readNumber();
    v.count = ar.readNumber();
}

export function saveDescriptorBlockIndex (ar: OutputArchive, v: DescriptorBlockIndex): void {
    ar.writeNumber(v.updateFrequency);
    ar.writeNumber(v.parameterType);
    ar.writeNumber(v.descriptorType);
    ar.writeNumber(v.visibility);
}

export function loadDescriptorBlockIndex (ar: InputArchive, v: DescriptorBlockIndex): void {
    v.updateFrequency = ar.readNumber();
    v.parameterType = ar.readNumber();
    v.descriptorType = ar.readNumber();
    v.visibility = ar.readNumber();
}

export function saveResolvePair (ar: OutputArchive, v: ResolvePair): void {
    ar.writeString(v.source);
    ar.writeString(v.target);
    ar.writeNumber(v.resolveFlags);
    ar.writeNumber(v.mode);
    ar.writeNumber(v.mode1);
}

export function loadResolvePair (ar: InputArchive, v: ResolvePair): void {
    v.source = ar.readString();
    v.target = ar.readString();
    v.resolveFlags = ar.readNumber();
    v.mode = ar.readNumber();
    v.mode1 = ar.readNumber();
}

export function saveCopyPair (ar: OutputArchive, v: CopyPair): void {
    ar.writeString(v.source);
    ar.writeString(v.target);
    ar.writeNumber(v.mipLevels);
    ar.writeNumber(v.numSlices);
    ar.writeNumber(v.sourceMostDetailedMip);
    ar.writeNumber(v.sourceFirstSlice);
    ar.writeNumber(v.sourcePlaneSlice);
    ar.writeNumber(v.targetMostDetailedMip);
    ar.writeNumber(v.targetFirstSlice);
    ar.writeNumber(v.targetPlaneSlice);
}

export function loadCopyPair (ar: InputArchive, v: CopyPair): void {
    v.source = ar.readString();
    v.target = ar.readString();
    v.mipLevels = ar.readNumber();
    v.numSlices = ar.readNumber();
    v.sourceMostDetailedMip = ar.readNumber();
    v.sourceFirstSlice = ar.readNumber();
    v.sourcePlaneSlice = ar.readNumber();
    v.targetMostDetailedMip = ar.readNumber();
    v.targetFirstSlice = ar.readNumber();
    v.targetPlaneSlice = ar.readNumber();
}

export function saveMovePair (ar: OutputArchive, v: MovePair): void {
    ar.writeString(v.source);
    ar.writeString(v.target);
    ar.writeNumber(v.mipLevels);
    ar.writeNumber(v.numSlices);
    ar.writeNumber(v.targetMostDetailedMip);
    ar.writeNumber(v.targetFirstSlice);
    ar.writeNumber(v.targetPlaneSlice);
}

export function loadMovePair (ar: InputArchive, v: MovePair): void {
    v.source = ar.readString();
    v.target = ar.readString();
    v.mipLevels = ar.readNumber();
    v.numSlices = ar.readNumber();
    v.targetMostDetailedMip = ar.readNumber();
    v.targetFirstSlice = ar.readNumber();
    v.targetPlaneSlice = ar.readNumber();
}

export function savePipelineStatistics (ar: OutputArchive, v: PipelineStatistics): void {
    ar.writeNumber(v.numRenderPasses);
    ar.writeNumber(v.numManagedTextures);
    ar.writeNumber(v.totalManagedTextures);
    ar.writeNumber(v.numUploadBuffers);
    ar.writeNumber(v.numUploadBufferViews);
    ar.writeNumber(v.numFreeUploadBuffers);
    ar.writeNumber(v.numFreeUploadBufferViews);
    ar.writeNumber(v.numDescriptorSets);
    ar.writeNumber(v.numFreeDescriptorSets);
    ar.writeNumber(v.numInstancingBuffers);
    ar.writeNumber(v.numInstancingUniformBlocks);
}

export function loadPipelineStatistics (ar: InputArchive, v: PipelineStatistics): void {
    v.numRenderPasses = ar.readNumber();
    v.numManagedTextures = ar.readNumber();
    v.totalManagedTextures = ar.readNumber();
    v.numUploadBuffers = ar.readNumber();
    v.numUploadBufferViews = ar.readNumber();
    v.numFreeUploadBuffers = ar.readNumber();
    v.numFreeUploadBufferViews = ar.readNumber();
    v.numDescriptorSets = ar.readNumber();
    v.numFreeDescriptorSets = ar.readNumber();
    v.numInstancingBuffers = ar.readNumber();
    v.numInstancingUniformBlocks = ar.readNumber();
}
