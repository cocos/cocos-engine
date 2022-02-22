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

export const enum ParameterType {
    CONSTANTS,
    CBV,
    UAV,
    SRV,
    TABLE,
    SSV,
}

export const enum Boundedness {
    Bounded,
    Unbounded,
}

export const enum ResourceType {
    Constants,
    Buffer,
    Texture1D,
    Texture1DArray,
    Texture2D,
    Texture2DArray,
    Texture2DMS,
    Texture2DMSArray,
    Texture3D,
    TextureCube,
    TextureCubeArray,
    RaytracingAccelerationStructure,
    SamplerState,
    SamplerComparisonState,
}

export const enum ValueType {
    Typeless,
    Float4,
    Float3,
    Float2,
    Float1,
    Half4,
    Half3,
    Half2,
    Half1,
    Fixed4,
    Fixed3,
    Fixed2,
    Fixed1,
    Uint4,
    Uint3,
    Uint2,
    Uint1,
    Int4,
    Int3,
    Int2,
    Int1,
    Bool4,
    Bool3,
    Bool2,
    Bool1,
}

export const enum ResourceResidency {
    Managed,
    Persistent,
    Backbuffer,
    Memoryless,
}

export const enum QueueHint {
    NONE,
    RENDER_OPAQUE,
    RENDER_CUTOUT,
    RENDER_TRANSPARENT,
    COUNT,
}

export const enum ResourceDimension {
    BUFFER,
    TEXTURE1D,
    TEXTURE2D,
    TEXTURE3D,
}

export class SampleDesc {
    count = 1;
    quality = 0;
}

export const enum NodeType {
    INTERNAL,
    LEAF,
}
