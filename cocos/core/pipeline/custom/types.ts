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
    Constants,
    CBV,
    UAV,
    SRV,
    Table,
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
