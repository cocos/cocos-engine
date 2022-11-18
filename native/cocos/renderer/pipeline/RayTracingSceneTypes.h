#pragma once

#include "renderer/gfx-base/GFXAccelerationStructure.h"
#include "base/Ptr.h"
#include "gfx-base/GFXBuffer.h"
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

struct SubMeshGeomDescriptor final {
    uint64_t indexAddress{0};
    uint64_t vertexAddress{0};

    bool operator==(const SubMeshGeomDescriptor& other) const noexcept{
        return indexAddress == other.indexAddress && vertexAddress == other.vertexAddress;
    }
};

using MeshGeometriesDescriptor = ccstd::vector<SubMeshGeomDescriptor>;

using MeshMaterialsDescriptor = ccstd::vector<uint32_t>;

struct MeshShadingDescriptor {
    // The first submesh geometry position of the Mesh
    uint16_t subMeshGeometryOffset{0};
    // The first submesh material position of the Mesh
    uint16_t subMeshMaterialOffset{0};
    uint16_t subMeshCount{0};
    uint16_t padding{0};

    bool operator==(const MeshShadingDescriptor& other) const noexcept{
        return subMeshCount == other.subMeshCount &&
               subMeshGeometryOffset == other.subMeshGeometryOffset &&
               subMeshMaterialOffset == other.subMeshMaterialOffset;
    }
};

 /*
    Definition:
        G = {g1, g2, ...} as all geometries of the model
        M = {m1, m2, ...} as all materials of the model
        T as the transform of the model
        I = {G,M,T} as a unique instance in the scene

    For I1 = {G1,M1,T1} and I2 = {G2,M2,T2}
        iff G1 = G2, then BLAS could be shared.
        iff G1 = G2 and M1 = M2, then MeshShadingDescriptor could be shared.
*/

struct RayQueryBindingTable {
    // instanceDecs.geometryOffset + geometryIndex
    /*
     * IA n ：index address of the nth geometry
     * VA n : vertex address of the nth geometry
     *
     * |---------0---------||----2----||---------3---------||--------------5--------------||--------------8--------------||---11----||--------12---------|  geom_offset
     * |----0----|----1----||----2----||----3----|----4----||----5----|----6----|----7----||----8----|----9----|---10----||---11----||---12----|---13----|
     * |IA 0|VA 0|IA 1|VA 1||IA 0|VA 0||IA 0|VA 0|IA 1|VA 1||IA 0|VA 0|IA 1|VA 1|IA 2|VA 2||IA 0|VA 0|IA 1|VA 1|IA 2|VA 2||IA 0|VA 0||IA 0|VA 0|IA 1|VA 1|
     * |-------------------||---------||-------------------||-----------------------------||-----------------------------||---------||-------------------|
     */

    ccstd::vector<SubMeshGeomDescriptor> _geomDesc;
    //ccstd::vector<MeshGeometriesDescriptor> _geomDesc2;

    /*
     * matID n : matID of the nth geometry
     *
     * |-------0-------||---2---||-------3-------||-----------5-----------||-----------8-----------||--11---||------12-------|  material_offset
     * |---0---|---1---||---2---||---3---|---4---||---5---|---6---|---7---||---8---|---9---|--10---||--11---||--12---|--13---|
     * |matID 0|matID 1||matID 0||matID 0|matID 1||matID 0|matID 1|matID 2||matID 0|matID 1|matID 2||matID 0||matID 0|matID 1|
     * |---------------||-------||---------------||-----------------------||-----------------------||-------||---------------|
      */

    ccstd::vector<uint64_t> _materialDesc;
    //ccstd::vector<MeshMaterialsDescriptor> _materialDesc2;

    /* |----------------------------------------------||----------------------------------------------||----------------------------------------------|
     * |-------------------descriptor 0---------------||-------------------descriptor 1---------------||-------------------descriptor 2---------------| instanceCustomIndex
     * |geom_offset|material_offset|geom_count|padding||geom_offset|material_offset|geom_count|padding||geom_offset|material_offset|geom_count|padding|
     * |----------------------------------------------||----------------------------------------------||----------------------------------------------|                                     
     */

    ccstd::vector<MeshShadingDescriptor> _shadingInstanceDescriptors;

   

    uint16_t registrySubmeshes(const ccstd::vector<SubMeshGeomDescriptor>& subMeshes) {
        const auto& g = std::search(_geomDesc.cbegin(), _geomDesc.cend(), subMeshes.cbegin(), subMeshes.cend());

        uint16_t offset{};

        if (g != _geomDesc.cend()) {
            offset = std::distance(_geomDesc.cbegin(), g);
        } else {
            offset = _geomDesc.size();
            _geomDesc.insert(_geomDesc.end(), subMeshes.cbegin(), subMeshes.cend());
        }

        return offset;
    }

    uint16_t registryMaterials(const ccstd::vector<uint64_t>& materials) {
        const auto& m = std::search(_materialDesc.cbegin(), _materialDesc.cend(), materials.cbegin(), materials.cend());

        uint16_t offset{};

        if (m != _materialDesc.cend()) {
            offset = static_cast<uint16_t>(std::distance(_materialDesc.cbegin(), m));
        } else {
            offset = _materialDesc.size();
            _materialDesc.insert(_materialDesc.begin(), materials.begin(), materials.end());
        }

        return offset;
    }

public:

    IntrusivePtr<gfx::Buffer> _geomDescGPUBuffer;
    IntrusivePtr<gfx::Buffer> _materialDescGPUBuffer;
    IntrusivePtr<gfx::Buffer> _instanceDescGPUBuffer;

    uint32_t registry(const ccstd::vector<RayTracingGeometryShadingDescriptor>& shadingGeometries) {

        MeshShadingDescriptor shadingDesciptor{};
        shadingDesciptor.subMeshCount = shadingGeometries.size();
        shadingDesciptor.padding = shadingGeometries[0].meshDescriptor.has_value() ? (shadingGeometries[0].meshDescriptor.value().indexBuffer->getStride() == 2 ? 0 : 1) : -1;

        ccstd::vector<SubMeshGeomDescriptor> meshes;
        meshes.reserve(shadingGeometries.size());
        std::transform(shadingGeometries.cbegin(), shadingGeometries.cend(), std::back_inserter(meshes), [&](const RayTracingGeometryShadingDescriptor& geom) {
            const auto& meshDescriptor = geom.meshDescriptor;
            if (meshDescriptor) {
                return SubMeshGeomDescriptor{meshDescriptor.value().vertexBuffer->getDeviceAddress(), meshDescriptor.value().indexBuffer->getDeviceAddress()};
            }else {
                return SubMeshGeomDescriptor{~0U, ~0U};
            }
        });
        
        ccstd::vector<uint64_t> materials;
        materials.reserve(shadingGeometries.size());
        std::transform(shadingGeometries.cbegin(), shadingGeometries.cend(), std::back_inserter(materials), [&](const RayTracingGeometryShadingDescriptor& geom) {
            return geom.materialID;
        });

        shadingDesciptor.subMeshGeometryOffset = registrySubmeshes(meshes);
        shadingDesciptor.subMeshMaterialOffset = registryMaterials(materials);

        // check for shadingDescriptor reuse
        auto it = _shadingInstanceDescriptors.cbegin();
        for (;it!=_shadingInstanceDescriptors.cend();++it) {
            if (*it == shadingDesciptor) {
                break;
            }
        }

        auto index = static_cast<uint32_t>(std::distance(_shadingInstanceDescriptors.cbegin(), it));

        if (it == _shadingInstanceDescriptors.cend()) {
            _shadingInstanceDescriptors.push_back(shadingDesciptor);
        }

        return index;
    }

    void recreate(){
        gfx::BufferInfo geomDescBufferInfo{};
        geomDescBufferInfo.size = static_cast<uint32_t>(_geomDesc.size()) * sizeof(SubMeshGeomDescriptor);
        geomDescBufferInfo.flags = gfx::BufferFlags::NONE;
        geomDescBufferInfo.usage = gfx::BufferUsage::STORAGE | gfx::BufferUsage::TRANSFER_DST;
        geomDescBufferInfo.memUsage = gfx::MemoryUsage::HOST;
        _geomDescGPUBuffer = gfx::Device::getInstance()->createBuffer(geomDescBufferInfo);

        gfx::BufferInfo instanceDescBufferInfo{};
        instanceDescBufferInfo.size = static_cast<uint32_t>(_shadingInstanceDescriptors.size()) * sizeof(MeshShadingDescriptor);
        instanceDescBufferInfo.flags = gfx::BufferFlags::NONE;
        instanceDescBufferInfo.usage = gfx::BufferUsage::STORAGE | gfx::BufferUsage::TRANSFER_DST;
        instanceDescBufferInfo.memUsage = gfx::MemoryUsage::HOST;
        _instanceDescGPUBuffer = gfx::Device::getInstance()->createBuffer(instanceDescBufferInfo);
    }

    void update() {
        _geomDescGPUBuffer->update(_geomDesc.data());
        _instanceDescGPUBuffer->update(_shadingInstanceDescriptors.data());
    }
};

/*
 * first: subMesh Geometry info descriptor
 * second: material identifier
 */

using ShaderRecord = std::pair<SubMeshGeomDescriptor, uint32_t>;

/*
 * IA n ：index address of the nth geometry
 * VA n : vertex address of the nth geometry
 * matID n : matID of the nth geometry
 *
 * |-----------------0-----------------||--------2--------||-----------------3-----------------||--------------------------5--------------------------|  SBTRecordOffset
 * |--------0--------|--------1--------||--------2--------||--------3--------|--------4--------||--------5--------|--------6--------|--------7--------| 
 * |IA 0|VA 0|matID 0|IA 1|VA 1|matID 1||IA 0|VA 0|matID 0||IA 0|VA 0|matID 0|IA 1|VA 1|matID 1||IA 0|VA 0|matID 0|IA 1|VA 1|matID 1|IA 2|VA 2|matID 2|
 * |-----------------------------------||-----------------||-----------------------------------||-----------------------------------------------------|
 */

using ShaderRecordList = ccstd::vector<ShaderRecord>;

struct RayTracingBindingTable {
    
};

struct RayTracingSceneAccelerationStructureManager {
    
};

} // namespace pipeline
} // namespace cc
