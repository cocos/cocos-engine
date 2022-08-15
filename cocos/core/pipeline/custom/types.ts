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
import { ClearFlagBit, Color, LoadOp, StoreOp } from '../../gfx';
import { Light } from '../../renderer/scene';

export const enum UpdateFrequency {
    PER_INSTANCE,
    PER_BATCH,
    PER_QUEUE,
    PER_PASS,
    COUNT,
}

export function getUpdateFrequencyName (e: UpdateFrequency): string {
    switch (e) {
    case UpdateFrequency.PER_INSTANCE:
        return 'PER_INSTANCE';
    case UpdateFrequency.PER_BATCH:
        return 'PER_BATCH';
    case UpdateFrequency.PER_QUEUE:
        return 'PER_QUEUE';
    case UpdateFrequency.PER_PASS:
        return 'PER_PASS';
    case UpdateFrequency.COUNT:
        return 'COUNT';
    default:
        return '';
    }
}

export const enum ParameterType {
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

export const enum ResourceResidency {
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

export const enum QueueHint {
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

export const enum ResourceDimension {
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

export const enum ResourceFlags {
    NONE = 0,
    UNIFORM = 0x1,
    INDIRECT = 0x2,
    STORAGE = 0x4,
    SAMPLED = 0x8,
    COLOR_ATTACHMENT = 0x10,
    DEPTH_STENCIL_ATTACHMENT = 0x20,
    INPUT_ATTACHMENT = 0x40,
}

export const enum TaskType {
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

export const enum SceneFlags {
    NONE = 0,
    OPAQUE_OBJECT = 1,
    CUTOUT_OBJECT = 2,
    TRANSPARENT_OBJECT = 4,
    SHADOW_CASTER = 8,
    UI = 16,
    DEFAULT_LIGHTING = 32,
    VOLUMETRIC_LIGHTING = 64,
    CLUSTERED_LIGHTING = 128,
    PLANAR_SHADOW = 256,
    GEOMETRY = 512,
    PROFILER = 1024,
    ALL = 0xFFFFFFFF,
}

export const enum LightingMode {
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

export const enum AttachmentType {
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

export const enum AccessType {
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

export const enum ClearValueType {
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
    /*object*/ light: Light | null;
    level: number;
}
