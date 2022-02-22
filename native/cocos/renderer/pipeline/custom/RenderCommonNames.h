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
// clang-format off
#pragma once
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"

namespace cc {

namespace render {

inline const char* getName(UpdateFrequency e) noexcept {
    switch (e) {
        case UpdateFrequency::PER_INSTANCE: return "PER_INSTANCE";
        case UpdateFrequency::PER_BATCH: return "PER_BATCH";
        case UpdateFrequency::PER_QUEUE: return "PER_QUEUE";
        case UpdateFrequency::PER_PASS: return "PER_PASS";
        case UpdateFrequency::COUNT: return "COUNT";
    }
    return "";
}
inline const char* getName(const CBVTag& /*v*/) noexcept { return "CBV"; }
inline const char* getName(const UAVTag& /*v*/) noexcept { return "UAV"; }
inline const char* getName(const SRVTag& /*v*/) noexcept { return "SRV"; }
inline const char* getName(const SSVTag& /*v*/) noexcept { return "SSV"; }
inline const char* getName(const RTVTag& /*v*/) noexcept { return "RTV"; }
inline const char* getName(const DSVTag& /*v*/) noexcept { return "DSV"; }
inline const char* getName(const IBVTag& /*v*/) noexcept { return "IBV"; }
inline const char* getName(const VBVTag& /*v*/) noexcept { return "VBV"; }
inline const char* getName(const SOVTag& /*v*/) noexcept { return "SOV"; }
inline const char* getName(const ConstantsTag& /*v*/) noexcept { return "Constants"; }
inline const char* getName(const TableTag& /*v*/) noexcept { return "Table"; }
inline const char* getName(const BoundedTag& /*v*/) noexcept { return "Bounded"; }
inline const char* getName(const UnboundedTag& /*v*/) noexcept { return "Unbounded"; }
inline const char* getName(const CBufferTag& /*v*/) noexcept { return "CBuffer"; }
inline const char* getName(const BufferTag& /*v*/) noexcept { return "Buffer"; }
inline const char* getName(const TextureTag& /*v*/) noexcept { return "Texture"; }
inline const char* getName(const RWBufferTag& /*v*/) noexcept { return "RWBuffer"; }
inline const char* getName(const RWTextureTag& /*v*/) noexcept { return "RWTexture"; }
inline const char* getName(const SamplerTag& /*v*/) noexcept { return "Sampler"; }
inline const char* getName(const Texture1DTag& /*v*/) noexcept { return "Texture1D"; }
inline const char* getName(const Texture1DArrayTag& /*v*/) noexcept { return "Texture1DArray"; }
inline const char* getName(const Texture2DTag& /*v*/) noexcept { return "Texture2D"; }
inline const char* getName(const Texture2DArrayTag& /*v*/) noexcept { return "Texture2DArray"; }
inline const char* getName(const Texture2DMSTag& /*v*/) noexcept { return "Texture2DMS"; }
inline const char* getName(const Texture2DMSArrayTag& /*v*/) noexcept { return "Texture2DMSArray"; }
inline const char* getName(const Texture3DTag& /*v*/) noexcept { return "Texture3D"; }
inline const char* getName(const TextureCubeTag& /*v*/) noexcept { return "TextureCube"; }
inline const char* getName(const TextureCubeArrayTag& /*v*/) noexcept { return "TextureCubeArray"; }
inline const char* getName(const RaytracingAccelerationStructureTag& /*v*/) noexcept { return "RaytracingAccelerationStructure"; }
inline const char* getName(const SamplerStateTag& /*v*/) noexcept { return "SamplerState"; }
inline const char* getName(const SamplerComparisonStateTag& /*v*/) noexcept { return "SamplerComparisonState"; }
inline const char* getName(const TypelessTag& /*v*/) noexcept { return "Typeless"; }
inline const char* getName(const Float4Tag& /*v*/) noexcept { return "Float4"; }
inline const char* getName(const Float3Tag& /*v*/) noexcept { return "Float3"; }
inline const char* getName(const Float2Tag& /*v*/) noexcept { return "Float2"; }
inline const char* getName(const Float1Tag& /*v*/) noexcept { return "Float1"; }
inline const char* getName(const Half4Tag& /*v*/) noexcept { return "Half4"; }
inline const char* getName(const Half3Tag& /*v*/) noexcept { return "Half3"; }
inline const char* getName(const Half2Tag& /*v*/) noexcept { return "Half2"; }
inline const char* getName(const Half1Tag& /*v*/) noexcept { return "Half1"; }
inline const char* getName(const Fixed4Tag& /*v*/) noexcept { return "Fixed4"; }
inline const char* getName(const Fixed3Tag& /*v*/) noexcept { return "Fixed3"; }
inline const char* getName(const Fixed2Tag& /*v*/) noexcept { return "Fixed2"; }
inline const char* getName(const Fixed1Tag& /*v*/) noexcept { return "Fixed1"; }
inline const char* getName(const Uint4Tag& /*v*/) noexcept { return "Uint4"; }
inline const char* getName(const Uint3Tag& /*v*/) noexcept { return "Uint3"; }
inline const char* getName(const Uint2Tag& /*v*/) noexcept { return "Uint2"; }
inline const char* getName(const Uint1Tag& /*v*/) noexcept { return "Uint1"; }
inline const char* getName(const Int4Tag& /*v*/) noexcept { return "Int4"; }
inline const char* getName(const Int3Tag& /*v*/) noexcept { return "Int3"; }
inline const char* getName(const Int2Tag& /*v*/) noexcept { return "Int2"; }
inline const char* getName(const Int1Tag& /*v*/) noexcept { return "Int1"; }
inline const char* getName(const Bool4Tag& /*v*/) noexcept { return "Bool4"; }
inline const char* getName(const Bool3Tag& /*v*/) noexcept { return "Bool3"; }
inline const char* getName(const Bool2Tag& /*v*/) noexcept { return "Bool2"; }
inline const char* getName(const Bool1Tag& /*v*/) noexcept { return "Bool1"; }
inline const char* getName(const RasterTag& /*v*/) noexcept { return "Raster"; }
inline const char* getName(const ComputeTag& /*v*/) noexcept { return "Compute"; }
inline const char* getName(const CopyTag& /*v*/) noexcept { return "Copy"; }
inline const char* getName(const MoveTag& /*v*/) noexcept { return "Move"; }
inline const char* getName(const RaytraceTag& /*v*/) noexcept { return "Raytrace"; }
inline const char* getName(const ManagedTag& /*v*/) noexcept { return "Managed"; }
inline const char* getName(const PersistentTag& /*v*/) noexcept { return "Persistent"; }
inline const char* getName(const BackbufferTag& /*v*/) noexcept { return "Backbuffer"; }
inline const char* getName(const MemorylessTag& /*v*/) noexcept { return "Memoryless"; }
inline const char* getName(QueueHint e) noexcept {
    switch (e) {
        case QueueHint::NONE: return "NONE";
        case QueueHint::RENDER_OPAQUE: return "RENDER_OPAQUE";
        case QueueHint::RENDER_CUTOUT: return "RENDER_CUTOUT";
        case QueueHint::RENDER_TRANSPARENT: return "RENDER_TRANSPARENT";
        case QueueHint::COUNT: return "COUNT";
    }
    return "";
}
inline const char* getName(ResourceDimension e) noexcept {
    switch (e) {
        case ResourceDimension::BUFFER: return "BUFFER";
        case ResourceDimension::TEXTURE1D: return "TEXTURE1D";
        case ResourceDimension::TEXTURE2D: return "TEXTURE2D";
        case ResourceDimension::TEXTURE3D: return "TEXTURE3D";
    }
    return "";
}
inline const char* getName(const SampleDesc& /*v*/) noexcept { return "SampleDesc"; }
inline const char* getName(NodeType e) noexcept {
    switch (e) {
        case NodeType::INTERNAL: return "INTERNAL";
        case NodeType::LEAF: return "LEAF";
    }
    return "";
}

} // namespace render

} // namespace cc

// clang-format on
