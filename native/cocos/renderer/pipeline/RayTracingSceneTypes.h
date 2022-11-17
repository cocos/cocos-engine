#pragma once

#include "renderer/gfx-base/GFXAccelerationStructure.h"
#include "base/Ptr.h"
#include "base/std/container/unordered_set.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "RayTracingSceneTypes.h"
namespace cc {

namespace scene {
class RenderScene;
class Model;
} // namespace scene
namespace pipeline {
struct RayTracingMeshDescriptor final {
    IntrusivePtr<gfx::Buffer> vertexBuffer;
    IntrusivePtr<gfx::Buffer> indexBuffer;
    uint32_t vertexCount;
    uint32_t indexCount;
    gfx::Format vertexFormat;
};

struct RayTracingGeometryShadingDescriptor final {
    std::optional<RayTracingMeshDescriptor> meshDescriptor;
    uint32_t materialID;
};

struct RayTracingInstanceDescriptor final {
    uint32_t instanceCustomIdx;
    uint32_t mask;
    gfx::GeometryInstanceFlags flags;
    Mat4& transform;
    ccstd::vector<RayTracingGeometryShadingDescriptor> shadingGeometries;
    ccstd::string uuid;
    bool changed;
};

struct RayTracingSceneDescriptor final {
    ccstd::vector<RayTracingInstanceDescriptor> instances;
};

using AccelerationStructurePtr = IntrusivePtr<gfx::AccelerationStructure>;

class BlasCache final {
public:
    std::optional<AccelerationStructurePtr> contain(const AccelerationStructurePtr& as) const {
        return {};
    }

    std::optional<AccelerationStructurePtr> contain(const gfx::AccelerationStructureInfo& info) const {
        return {};
    }

    void add(const AccelerationStructurePtr& as) {
    }
};

class RayTracingInstanceCache final {
public:
    std::optional<RayTracingInstanceDescriptor> contain(const ccstd::string& uuid) noexcept {
        return {};
    }

    void add(const RayTracingInstanceDescriptor& instance) {
    }
};

struct subMeshGeomDescriptor {
    uint64_t indexAddress{0};
    uint64_t vertexAddress{0};

    bool operator==(const subMeshGeomDescriptor& other) const {
        return indexAddress == other.indexAddress && vertexAddress == other.vertexAddress;
    }
};

struct meshShadingInstanceDescriptor {
    // The first submesh geometry position of the Mesh
    uint16_t subMeshGeometryOffset{0};
    // The first submesh material position of the Mesh
    uint16_t subMeshMaterialOffset{0};
    uint16_t subMeshCount{0};
    uint16_t padding{0};

    bool operator==(const meshShadingInstanceDescriptor& other) const {
        return subMeshCount == other.subMeshCount &&
               subMeshGeometryOffset == other.subMeshGeometryOffset &&
               subMeshMaterialOffset == other.subMeshMaterialOffset;
    }
};

using shaderRecord = std::pair<subMeshGeomDescriptor, uint32_t>;

class ShaderRecordCache final {
    std::optional<uint32_t> contain(const shaderRecord& as) const {
        return {};
    }

    uint32_t add(const shaderRecord& as) {
        return 0;
    }
};

struct RayTracingSceneAddInstanceEvent {
    RayTracingInstanceDescriptor instDescriptor;
};

struct RayTracingSceneRemoveInstanceEvent {
    uint32_t instIdx;
};

struct RayTracingSceneMoveInstanceEvent {
    Mat4& transform;
    uint32_t instIdx;
};

using RayTracingUpdateEvent = std::variant<RayTracingSceneAddInstanceEvent, RayTracingSceneRemoveInstanceEvent, RayTracingSceneMoveInstanceEvent>;

struct RayTracingSceneUpdateInfo {
    ccstd::vector<RayTracingUpdateEvent> events;
};

 /*
            Definition:
                G = {g1, g2, ...} as all geometries of the model
                M = {m1, m2, ...} as all materials of the model
                T as the transform of the model
                I = {G,M,T} as a unique instance in the scene

            For I1 = {G1,M1,T1} and I2 = {G2,M2,T2}
                iff G1 = G2, then BLAS could be shared.
                iff G1 = G2 and M1 = M2, then meshShadingInstanceDescriptor could be shared.
        */
struct RayQueryBindingTable {
    // instanceDecs.geometryOffset + geometryIndex
    ccstd::vector<subMeshGeomDescriptor> _geomDesc;
    ccstd::vector<uint64_t> _materialDesc;
    // instanceCustomIndex
    ccstd::vector<meshShadingInstanceDescriptor> _shadingInstanceDescriptors;

    IntrusivePtr<gfx::Buffer> _geomDescGPUBuffer;
    IntrusivePtr<gfx::Buffer> _materialDescGPUBuffer;
    IntrusivePtr<gfx::Buffer> _instanceDescGPUBuffer;
};
/*
 * first: subMesh Geometry info descriptor
 * second: material identifier
 */
using shaderRecord = std::pair<subMeshGeomDescriptor, uint32_t>;

struct RayTracingSceneAccelerationStructureManager {
    
};

} // namespace pipeline
} // namespace cc
