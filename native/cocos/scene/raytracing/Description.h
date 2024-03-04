/****************************************************************************
 Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.

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

#pragma once
#include <string>
#include <map>
#include <string>
#include <vector>
#include <cocos/math/Mat4.h>
#include <cocos/math/Vec3.h>
#include <cocos/math/Quaternion.h>
#include <cocos/scene/SubModel.h>
#include <cocos/core/scene-graph/Node.h>
#include <renderer/gfx-base/GFXBuffer.h>
#include <renderer/gfx-base/GFXTexture.h>
#include <renderer/gfx-base/states/GFXSampler.h>
#include <cocos/base/Ptr.h>
namespace cc {
namespace scene {
namespace raytracing {

enum class PrimitiveType {
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6,
};

enum class ComponentType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
};

enum class TargetType {
    ARRAY_BUFFER = 0x8892,
    ELEMENT_ARRAY_BUFFER = 0x8893,
};

struct AccessorSparseValues {
    int bufferView;
    int byteOffset;
};

struct AccessorSparseIndices {
    ComponentType componentType;
    int bufferView;
    int byteOffset;
};

struct AccessorSparse {
    int count;
    AccessorSparseValues values;
    AccessorSparseIndices indices;
};

struct Accessor {
    std::string type;
    ComponentType componentType;
    int count;
    bool normalized;
    int bufferView;
    int byteOffset;
    ccstd::vector<float> min;
    ccstd::vector<float> max;
    AccessorSparse sparse;
    std::string name;
};

struct BufferView {
    int byteLength;
    int buffer;
    TargetType target;
    int byteOffset;
    int byteStride;
    std::string name;
};

struct TextureInfo {
    int index;
};

struct MaterialNormalTextureInfo {
    int index;
    float scale;
};

struct MaterialOcclusionTextureInfo {
    int index;
    float strength;
};

struct MaterialPbrMetallicRoughness {
    float baseColorFactor;
    TextureInfo baseColorTexture;
    float metallicFactor;
    float roughnessFactor;
    TextureInfo metallicRoughnessTexture;
};

enum class AlphaMode {
    Undefined,
    Opaque,
    Mask,
    Blend,
};

struct Material {
    MaterialPbrMetallicRoughness pbrMetallicRoughness;
    MaterialNormalTextureInfo normalTexture;
    MaterialOcclusionTextureInfo occlusionTexture;
    TextureInfo emissiveTexture;
    Vec3 emissiveFactor;
    float alphaCutoff;
    AlphaMode alphaMode;
    bool doubleSided;
};

struct Texture {
    IntrusivePtr<gfx::Texture> source;
    gfx::Sampler* sampler;
    std::string name;
};

//struct Image {
//    std::string uri;
//    std::string mimeType;
//    int bufferView;
//    std::string name;
//};


struct Skin {
    ccstd::vector<int> joints;
    int skeleton;
    int inverseBindMatrices;
    std::string name;
};

struct AnimationChannelTarget {
    ccstd::string path;
    int node;
};

struct AnimationChannel {
    AnimationChannelTarget target;
    int sampler;
};

struct AnimationSampler {
    int input;
    int output;
    ccstd::string interpolation;
};

struct Animation {
    ccstd::vector<AnimationChannel> channels;
    ccstd::vector<AnimationSampler> samplers;
    ccstd::string name;
};

struct Mesh {
    int material{0};
    IntrusivePtr<SubModel> submodel;
};

struct Scene {
    ccstd::vector<int> nodes;
    ccstd::string name;
};

struct Entity {
    IntrusivePtr<Node> target;
    int mesh;
    Vec3 scale;
    Quaternion rotation;
    Vec3 translation;
    int skin;
    ccstd::vector<float> weights;
    ccstd::string name;
};

class Description : public RefCounted {
public:
    ccstd::vector<Skin> skins;
    ccstd::vector<Animation> animations;
    ccstd::vector<Accessor> accessors;
    ccstd::vector<BufferView> bufferViews;
    ccstd::vector<gfx::Buffer*> buffers;
    ccstd::vector<Material> materials;
    ccstd::vector<Texture> textures;
    // ccstd::vector<Image> images;
    ccstd::vector<Mesh> meshes;
    ccstd::vector<Entity> nodes;
    Scene scene;
    void Clear();
};

enum class RaytracingPrimitiveType : uint32_t {
    PerInstance,
    PerMeshPrimitive,
};
struct Index {
    constexpr Index() = default;
    constexpr explicit Index(uint32_t value) noexcept
    : mValue(value) {}
    constexpr operator uint32_t() const noexcept { // NOLINT(google-explicit-constructor)
        return mValue;
    }
    constexpr explicit operator bool() const noexcept {
        return mValue != 0xFFFFFFFF;
    }
    constexpr Index& operator++() noexcept {
        ++mValue;
        return *this;
    }
    constexpr Index operator++(int) noexcept {
        auto tmp = *this;
        ++mValue;
        return tmp;
    }
    constexpr Index& operator--() noexcept {
        --mValue;
        return *this;
    }
    constexpr Index operator--(int) noexcept {
        auto tmp = *this;
        --mValue;
        return tmp;
    }

    uint32_t mValue = 0xFFFFFFFF;
};
struct RaytracingInstance {
    RaytracingInstance() = default;
    RaytracingInstance(
        Index raytracingPrimitiveID,
        RaytracingPrimitiveType type,
        Index instanceID) noexcept
    : mRaytracingPrimitiveID(std::move(raytracingPrimitiveID)), mType(type), mInstanceID(std::move(instanceID)) {}

    Index mRaytracingPrimitiveID;
    RaytracingPrimitiveType mType = RaytracingPrimitiveType::PerInstance;
    Index mInstanceID;
};

struct GpuVirtualAddressAndStride {
    // NOLINTNEXTLINE(google-explicit-constructor)
    GpuVirtualAddressAndStride(
        uint64_t startAddress = 0,
        uint64_t strideInBytes = 0) noexcept
    : mStartAddress(startAddress), mStrideInBytes(strideInBytes) {}

    uint64_t mStartAddress = 0;
    uint64_t mStrideInBytes = 0;
};


struct RaytracingGeometryTrianglesDesc {
    uint64_t mTransform3x4 = 0;
    gfx::Format mIndexFormat = gfx::Format::R16UI;
    gfx::Format mVertexFormat = gfx::Format::UNKNOWN;
    uint32_t mIndexCount = 0;
    uint32_t mVertexCount = 0;
    uint64_t mIndexBuffer = 0;
    GpuVirtualAddressAndStride mVertexBuffer = 0;
};

enum class RaytracingGeometryFlags : uint32_t {
    None = 0,
    Opaque = 1 << 0,
    NoDuplicateAnyhitInvocation = 1 << 1,
};

struct RaytracingPrimitive {
    RaytracingPrimitive() = default;
    explicit RaytracingPrimitive(IntrusivePtr<gfx::Buffer> blasBuffer) noexcept
    : mBlasBuffer(std::move(blasBuffer)) {}
    RaytracingPrimitive(
        IntrusivePtr<gfx::Buffer> blasBuffer,
        IntrusivePtr<gfx::Buffer> meshBuffer) noexcept
    : mBlasBuffer(std::move(blasBuffer)), mMeshBuffer(std::move(meshBuffer)) {}

    IntrusivePtr<gfx::Buffer> mBlasBuffer;
    IntrusivePtr<gfx::Buffer> mMeshBuffer;
    RaytracingGeometryTrianglesDesc mGeometryDesc;
    RaytracingGeometryFlags mFlags = RaytracingGeometryFlags::None;
};
} // namespace raytracing
} // namespace scene
} // namespace cc
