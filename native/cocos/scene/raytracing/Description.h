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
#include <cocos/scene/raytracing/Def.h>
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
    UNDEFINED,
    OPAQUE,
    MASK,
    BLEND,
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
    IntrusivePtr<SubModel> subModel;
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



enum class RayTracingPrimitiveType : uint32_t {
    PER_INSTANCE,
    PER_MESH_PRIMITIVE,
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
struct RayTracingInstance {
    RayTracingInstance() = default;
    RayTracingInstance(
        Index rayTracingPrimitiveID,
        RayTracingPrimitiveType type,
        Index instanceID) noexcept
    : rayTracingPrimitiveID(rayTracingPrimitiveID), mType(type), mInstanceID(instanceID) {}

    Index rayTracingPrimitiveID;
    RayTracingPrimitiveType mType = RayTracingPrimitiveType::PER_INSTANCE;
    Index mInstanceID;
};

struct GpuVirtualAddressAndStride {
    // NOLINTNEXTLINE(google-explicit-constructor)
    GpuVirtualAddressAndStride(
        uint64_t startAddress = 0,
        uint64_t strideInBytes = 0) noexcept
    : startAddress(startAddress), strideInBytes(strideInBytes) {}

    uint64_t startAddress = 0;
    uint64_t strideInBytes = 0;
};


struct RayTracingGeometryTrianglesDesc {
    uint64_t mTransform3x4 = 0;
    gfx::Format mIndexFormat = gfx::Format::R16UI;
    gfx::Format mVertexFormat = gfx::Format::UNKNOWN;
    uint32_t mIndexCount = 0;
    uint32_t mVertexCount = 0;
    uint64_t mIndexBuffer = 0;
    GpuVirtualAddressAndStride mVertexBuffer = 0;
};

enum class RayTracingGeometryFlags : uint32_t {
    NONE = 0,
    OPAQUE = 1 << 0,
    NO_DUPLICATE_ANYHIT_INVOCATION = 1 << 1,
};

struct RayTracingPrimitive {
    RayTracingPrimitive() = default;
    explicit RayTracingPrimitive(IntrusivePtr<gfx::Buffer> blasBuffer) noexcept
    : blasBuffer(std::move(blasBuffer)) {}
    RayTracingPrimitive(
        IntrusivePtr<gfx::Buffer> blasBuffer,
        IntrusivePtr<gfx::Buffer> meshBuffer) noexcept
    : blasBuffer(std::move(blasBuffer)), meshBuffer(std::move(meshBuffer)) {}

    IntrusivePtr<gfx::Buffer> blasBuffer;
    IntrusivePtr<gfx::Buffer> meshBuffer;
    RayTracingGeometryTrianglesDesc geometryDesc;
    RayTracingGeometryFlags flags = RayTracingGeometryFlags::NONE;
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
    ccstd::vector<Mat4> transforms;
    ccstd::vector<Mat4> transformPrev;
    ccstd::vector<uint32_t> opaqueOrMaskInstanceIDs;
    ccstd::vector<InstanceInfo> instances;
    ccstd::vector<RayTracingInstance> rayTracingInstances;
    ccstd::vector<RayTracingPrimitive> rayTracingPrimitives;
    IntrusivePtr<gfx::Buffer> instanceBuffer;
    IntrusivePtr<gfx::Buffer> transformBuffer;
    IntrusivePtr<gfx::Buffer> transformPrevBuffer;
    IntrusivePtr<gfx::Buffer> meshPrimitiveBuffer;
    IntrusivePtr<gfx::Buffer> materialBuffer;
    IntrusivePtr<gfx::Buffer> opaqueOrMaskInstanceIDsBuffer;
    // ccstd::vector<Image> images;
    ccstd::vector<Mesh> meshes;
    ccstd::vector<Entity> nodes;
    Scene scene;
    void clear();
};
} // namespace raytracing
} // namespace scene
} // namespace cc
