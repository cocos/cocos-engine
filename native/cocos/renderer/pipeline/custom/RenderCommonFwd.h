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
#include <boost/variant2/variant.hpp>

namespace cc {

namespace render {

enum class UpdateFrequency;

struct CBVTag;
struct UAVTag;
struct SRVTag;
struct SSVTag;
struct RTVTag;
struct DSVTag;
struct IBVTag;
struct VBVTag;
struct SOVTag;
struct ConstantsTag;
struct TableTag;

using ParameterType = boost::variant2::variant<ConstantsTag, CBVTag, UAVTag, SRVTag, TableTag, SSVTag>;

struct BoundedTag;
struct UnboundedTag;

using Boundedness = boost::variant2::variant<BoundedTag, UnboundedTag>;

struct CBufferTag;
struct BufferTag;
struct TextureTag;
struct RWBufferTag;
struct RWTextureTag;
struct SamplerTag;
struct Texture1DTag;
struct Texture1DArrayTag;
struct Texture2DTag;
struct Texture2DArrayTag;
struct Texture2DMSTag;
struct Texture2DMSArrayTag;
struct Texture3DTag;
struct TextureCubeTag;
struct TextureCubeArrayTag;
struct RaytracingAccelerationStructureTag;
struct SamplerStateTag;
struct SamplerComparisonStateTag;

using ResourceType = boost::variant2::variant<ConstantsTag, BufferTag, Texture1DTag, Texture1DArrayTag, Texture2DTag, Texture2DArrayTag, Texture2DMSTag, Texture2DMSArrayTag, Texture3DTag, TextureCubeTag, TextureCubeArrayTag, RaytracingAccelerationStructureTag, SamplerStateTag, SamplerComparisonStateTag>;

struct TypelessTag;
struct Float4Tag;
struct Float3Tag;
struct Float2Tag;
struct Float1Tag;
struct Half4Tag;
struct Half3Tag;
struct Half2Tag;
struct Half1Tag;
struct Fixed4Tag;
struct Fixed3Tag;
struct Fixed2Tag;
struct Fixed1Tag;
struct Uint4Tag;
struct Uint3Tag;
struct Uint2Tag;
struct Uint1Tag;
struct Int4Tag;
struct Int3Tag;
struct Int2Tag;
struct Int1Tag;
struct Bool4Tag;
struct Bool3Tag;
struct Bool2Tag;
struct Bool1Tag;

using ValueType = boost::variant2::variant<TypelessTag, Float4Tag, Float3Tag, Float2Tag, Float1Tag, Half4Tag, Half3Tag, Half2Tag, Half1Tag, Fixed4Tag, Fixed3Tag, Fixed2Tag, Fixed1Tag, Uint4Tag, Uint3Tag, Uint2Tag, Uint1Tag, Int4Tag, Int3Tag, Int2Tag, Int1Tag, Bool4Tag, Bool3Tag, Bool2Tag, Bool1Tag>;

struct RasterTag;
struct ComputeTag;
struct CopyTag;
struct MoveTag;
struct RaytraceTag;
struct ManagedTag;
struct PersistentTag;
struct BackbufferTag;
struct MemorylessTag;

using ResourceResidency = boost::variant2::variant<ManagedTag, PersistentTag, BackbufferTag, MemorylessTag>;

enum class QueueHint;
enum class ResourceDimension;

struct SampleDesc;

enum class NodeType;

} // namespace render

} // namespace cc

// clang-format on
