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
