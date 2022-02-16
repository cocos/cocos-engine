/* eslint-disable max-len */
export const enum UpdateFrequency {
    PerInstance,
    PerBatch,
    PerQueue,
    PerPass,
    Count,
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
    Opaque,
    Cutout,
    Transparent,
    Count,
}

export const enum ResourceDimension {
    Buffer,
    Texture1D,
    Texture2D,
    Texture3D,
}

export class SampleDesc {
    count = 1;
    quality = 0;
}

export const enum NodeType {
    Internal,
    Leaf,
}
