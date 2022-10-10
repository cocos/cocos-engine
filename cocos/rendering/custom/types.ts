/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
****************************************************************************/

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { ClearFlagBit, Color, LoadOp, ShaderStageFlagBit, StoreOp, Type, UniformBlock } from '../../gfx';
import { Light } from '../../render-scene/scene';

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
    RENDER_OPAQUE,
    RENDER_CUTOUT,
    RENDER_TRANSPARENT,
}

export function getQueueHintName (e: QueueHint): string {
    switch (e) {
    case QueueHint.NONE:
        return 'NONE';
    case QueueHint.RENDER_OPAQUE:
        return 'RENDER_OPAQUE';
    case QueueHint.RENDER_CUTOUT:
        return 'RENDER_CUTOUT';
    case QueueHint.RENDER_TRANSPARENT:
        return 'RENDER_TRANSPARENT';
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
    OPAQUE_OBJECT = 0x1,
    CUTOUT_OBJECT = 0x2,
    TRANSPARENT_OBJECT = 0x4,
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
}

export function getAttachmentTypeName (e: AttachmentType): string {
    switch (e) {
    case AttachmentType.RENDER_TARGET:
        return 'RENDER_TARGET';
    case AttachmentType.DEPTH_STENCIL:
        return 'DEPTH_STENCIL';
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

export class RasterView {
    constructor (
        slotName = '',
        accessType: AccessType = AccessType.WRITE,
        attachmentType: AttachmentType = AttachmentType.RENDER_TARGET,
        loadOp: LoadOp = LoadOp.LOAD,
        storeOp: StoreOp = StoreOp.STORE,
        clearFlags: ClearFlagBit = ClearFlagBit.ALL,
        clearColor: Color = new Color(),
    ) {
        this.slotName = slotName;
        this.accessType = accessType;
        this.attachmentType = attachmentType;
        this.loadOp = loadOp;
        this.storeOp = storeOp;
        this.clearFlags = clearFlags;
        this.clearColor = clearColor;
    }
    slotName: string;
    accessType: AccessType;
    attachmentType: AttachmentType;
    loadOp: LoadOp;
    storeOp: StoreOp;
    clearFlags: ClearFlagBit;
    readonly clearColor: Color;
}

export enum ClearValueType {
    FLOAT_TYPE,
    INT_TYPE,
}

export function getClearValueTypeName (e: ClearValueType): string {
    switch (e) {
    case ClearValueType.FLOAT_TYPE:
        return 'FLOAT_TYPE';
    case ClearValueType.INT_TYPE:
        return 'INT_TYPE';
    default:
        return '';
    }
}

export class ComputeView {
    name = '';
    accessType: AccessType = AccessType.READ;
    clearFlags: ClearFlagBit = ClearFlagBit.NONE;
    readonly clearColor: Color = new Color();
    clearValueType: ClearValueType = ClearValueType.FLOAT_TYPE;
}

export class LightInfo {
    constructor (light: Light | null = null, level = 0) {
        this.light = light;
        this.level = level;
    }
    /*refcount*/ light: Light | null;
    level: number;
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
    type: Type;
    count = 1;
}

export class DescriptorBlock {
    readonly descriptors: Map<string, Descriptor> = new Map<string, Descriptor>();
    readonly uniformBlocks: Map<string, UniformBlock> = new Map<string, UniformBlock>();
    capacity = 0;
    count = 0;
}

export class DescriptorBlockFlattened {
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
    source: string;
    target: string;
    mipLevels: number;
    numSlices: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}
