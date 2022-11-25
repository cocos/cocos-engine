#include "RayTracingScene.h"
#include "GlobalDescriptorSetManager.h"
#include "3d/assets/Mesh.h"
#include "gfx-base/GFXDevice.h"
#include "scene/Model.h"
#include "scene/RenderScene.h"
#include "core/Root.h"
#include "custom/RenderInterfaceTypes.h"

namespace cc
{
namespace pipeline
{

    namespace{

    void fillBlasGeomTriangleMesh(gfx::ASTriangleMesh& blasGeomMesh, const IntrusivePtr<scene::SubModel>& pSubModel) {
        blasGeomMesh.flag = gfx::ASGeometryFlagBit::GEOMETRY_OPAQUE;
        const auto* inputAssembler = pSubModel->getInputAssembler();
        blasGeomMesh.vertexCount = inputAssembler->getVertexCount();
        blasGeomMesh.indexCount = inputAssembler->getIndexCount();
        blasGeomMesh.indexBuffer = inputAssembler->getIndexBuffer();

        const auto& attributes = inputAssembler->getAttributes();

        const auto& posAttribute = std::find_if(attributes.cbegin(), attributes.cend(), [](const gfx::Attribute& attr) {
            return attr.name == gfx::ATTR_NAME_POSITION;
        });

        if (posAttribute != attributes.cend()) {
            const auto& vertexBufferList = inputAssembler->getVertexBuffers();
            auto* const posBuffer = vertexBufferList[posAttribute->stream];
            blasGeomMesh.vertexBuffer = posBuffer;
            blasGeomMesh.vertexStride = posBuffer->getStride();
            blasGeomMesh.vertexFormat = posAttribute->format;
        }
    }

    void fillBlasInfo(gfx::AccelerationStructureInfo& blasInfo, const IntrusivePtr<scene::Model>& pModel) {
        if (pModel->getNode()->getName() == "AABB") {
            gfx::ASAABB blasGeomAABB{};
            blasGeomAABB.flag = gfx::ASGeometryFlagBit::GEOMETRY_OPAQUE;
            blasGeomAABB.minX = blasGeomAABB.minY = blasGeomAABB.minZ = - 0.5;
            blasGeomAABB.maxX = blasGeomAABB.maxY = blasGeomAABB.maxZ = 0.5;
            blasInfo.aabbs.push_back(blasGeomAABB);
        } else {
            for (const auto& pSubModel : pModel->getSubModels()) {
                gfx::ASTriangleMesh blasGeomMesh{};
                fillBlasGeomTriangleMesh(blasGeomMesh, pSubModel);
                blasInfo.triangleMeshes.push_back(blasGeomMesh);
            }
        }
        blasInfo.buildFlag = gfx::ASBuildFlagBits::ALLOW_COMPACTION | gfx::ASBuildFlagBits::PREFER_FAST_TRACE;
    }

    auto similarTransform = [](const Mat4* mat1, const Mat4* mat2) -> bool {
        Vec3 vec1;
        Vec3 vec2;
        mat1->getScale(&vec1);
        mat2->getScale(&vec2);
        bool similarScale = (vec1 - vec2).lengthSquared() < 1;
        mat1->getTranslation(&vec1);
        mat2->getTranslation(&vec2);
        bool similarTranslate = (vec1 - vec2).lengthSquared() < 1;
        // Quaternion quat1;//Quaternion quat2;
        return similarScale && similarTranslate;
    };

    } // anonymous namespace

    RayTracingScene::RayTracingScene() {
        _globalDSManager = Root::getInstance()->getPipeline()->getGlobalDSManager(); 
    }

    void RayTracingScene::handleNewModel(const IntrusivePtr<scene::Model>& pModel) {

        gfx::ASInstance tlasGeom;

        const auto& subModels = pModel->getSubModels();
        //todo temporal code
        tlasGeom.mask = 0xFF;
        tlasGeom.transform = pModel->getTransform()->getWorldMatrix();
        tlasGeom.flags = gfx::GeometryInstanceFlagBits::TRIANGLE_FACING_CULL_DISABLE;

        if (pModel->getNode()->getName() == "AABB") {
            tlasGeom.flags = gfx::GeometryInstanceFlagBits::FORCE_OPAQUE;
        }

        //search for blas geom
        auto meshUuid = reinterpret_cast<uint64_t>(subModels[0]->getSubMesh());

        if (pModel->getNode()->getName() == "AABB") {
            meshUuid += 1024;
        }

        auto blasIt = _geomBlasCache.find(meshUuid);
        if (blasIt != _geomBlasCache.cend()) {
            // BLAS could be reused.
            tlasGeom.accelerationStructureRef = blasIt->second;
            //shadingInstanceDescriptor.subMeshGeometryOffset = blasIt->second.second;
        } else {
            // New BLAS should be create and build.
            gfx::AccelerationStructureInfo blasInfo{};
            fillBlasInfo(blasInfo, pModel);
            auto blas = gfx::Device::getInstance()->createAccelerationStructure(blasInfo);
            blas->build();
            blas->compact();

            _geomBlasCache.emplace(meshUuid, blas);

            tlasGeom.accelerationStructureRef = blas;
        }

        ccstd::vector<RayTracingGeometryShadingDescriptor> shadingDescriptors{};

        for (const auto &mesh:tlasGeom.accelerationStructureRef->getInfo().triangleMeshes) {
            RayTracingGeometryShadingDescriptor descriptor;
            RayTracingMeshDescriptor m;
            m.indexBuffer = mesh.indexBuffer;
            m.vertexBuffer = mesh.vertexBuffer;
            descriptor.meshDescriptor = m;
            descriptor.materialID = 1;
            shadingDescriptors.push_back(descriptor);
        }
        
        tlasGeom.instanceCustomIdx = rqBinding.registry(shadingDescriptors);
        //tlasGeom.shaderBindingTableRecordOffset = rtBinding.registry(shadingDescriptors);

        _modelCache.emplace(pModel->getNode()->getUuid(), std::pair{true, tlasGeom});

    }

    void RayTracingScene::handleModel(const IntrusivePtr<scene::Model>& pModel) {
        
        if (!pModel->getNode()->isValid() || !pModel->getNode()->isActive() || pModel->getNode()->getName() == "Profiler_Root") {
            return;
        }

        auto modelIt = _modelCache.find(pModel->getNode()->getUuid());

        if (modelIt != _modelCache.cend()) {
            // Find existing Instance
            // set alive flag true
            modelIt->second.first = true;

            if (pModel->getTransform()->getChangedFlags()) {
                // Instance transform changed, tlas should be updated.
                auto lastUpdateTransfrom = &modelIt->second.second.transform;
                const auto* currentTransfrom = &pModel->getTransform()->getWorldMatrix();
                similarTransform(lastUpdateTransfrom, currentTransfrom) ? needUpdate = true : needRebuild = true;
                modelIt->second.second.transform = *currentTransfrom;
            }

        } else {
            // New instance should be added to top-level acceleration structure.
            // Tlas should be recreate and rebuild.
            needRecreate = needRebuild = true;
            handleNewModel(pModel);
        }
    }

    void RayTracingScene::update(const scene::RenderScene* scene) {
        needRebuild = needUpdate = needRecreate = false;

        for (const auto& pModel : scene->getModels()) {
            handleModel(pModel);
        }

        //sweep deactive model entries
        auto modelIt = _modelCache.begin();
        while (modelIt != _modelCache.end()) {
            if (modelIt->second.first) {
                modelIt->second.first = false;
                ++modelIt;
            } else {
                modelIt = _modelCache.erase(modelIt);
                needRebuild = true;
            }
        } 

        //sweep deactive blas
        auto blasIt = _geomBlasCache.begin();
        while (blasIt != _geomBlasCache.end()) {
            if (blasIt->second->getRefCount()==0) {
                blasIt = _geomBlasCache.erase(blasIt);
                //blasIt->second->destroy();
            }else {
                ++blasIt;
            }
        }

        if (needRebuild||needUpdate) {

            gfx::AccelerationStructureInfo tlasInfo{};
            tlasInfo.buildFlag = gfx::ASBuildFlagBits::ALLOW_UPDATE | gfx::ASBuildFlagBits::PREFER_FAST_TRACE;
            tlasInfo.instances.reserve(_modelCache.size());
            for (const auto& inst : _modelCache) {
                tlasInfo.instances.emplace_back(inst.second.second);
            }
            if (needRecreate) {
                _topLevelAccelerationStructure = gfx::Device::getInstance()->createAccelerationStructure(tlasInfo);
                rqBinding.recreate();
            } else {
                _topLevelAccelerationStructure->setInfo(tlasInfo);
            }
            if (needRebuild) {
                _topLevelAccelerationStructure->build();
                rqBinding.update();
            } else if (needUpdate) {
                _topLevelAccelerationStructure->update();
                rqBinding.update();
            }
        }

        if (needRecreate) {
            _globalDSManager->bindAccelerationStructure(TOPLEVELAS::BINDING, _topLevelAccelerationStructure);
            _globalDSManager->bindBuffer(SCENEGEOMETRYDESC::BINDING, rqBinding._geomDescGPUBuffer);
            _globalDSManager->bindBuffer(SCENEINSTANCEDESC::BINDING, rqBinding._instanceDescGPUBuffer);
            _globalDSManager->update();
        }

        needRecreate = needRebuild = needUpdate = false;
    }

    void RayTracingScene::update(const RayTracingSceneUpdateInfo& updateInfo) {

        auto tlasInfo = _topLevelAccelerationStructure->getInfo();

        for (const auto& event : updateInfo.events) {
            std::visit(Overloaded{
                           [](auto arg) {},
                           [&](const RayTracingSceneAddInstanceEvent& e) {
                               tlasInfo.instances.push_back(addInstance(e.instDescriptor));
                           },
                           [&](const RayTracingSceneRemoveInstanceEvent& e) {
                               rqBinding.unregistry(tlasInfo.instances[e.instIdx]);
                               rtBinding.unregistry(tlasInfo.instances[e.instIdx]);
                               tlasInfo.instances.erase(tlasInfo.instances.begin() + e.instIdx);
                           },
                           [&](const RayTracingSceneMoveInstanceEvent& e) {
                               tlasInfo.instances[e.instIdx].transform = e.transform;
                           }},event
            );
        }

        _topLevelAccelerationStructure->setInfo(tlasInfo);
        _topLevelAccelerationStructure->update();
    }

    void RayTracingScene::destroy() {
        _topLevelAccelerationStructure = nullptr;
        //_bottomLevelAccelerationStructures.clear();
        _geomBlasCache.clear();
        _modelCache.clear();
    }

    uint16_t RayQueryBindingTable::registrySubmeshes(const ccstd::vector<SubMeshGeomDescriptor>& subMeshes) {
        for (const auto & sm : _geomDescCache) {
            if (sm.first==subMeshes) {
                return sm.second;
            }
        }

        auto offset = static_cast<uint16_t>(_geomDesc.allocate(subMeshes));
        _geomDescCache.emplace_back(subMeshes, offset);
        return offset;
    }

    uint16_t RayQueryBindingTable::registryMaterials(const ccstd::vector<uint64_t>& materials) {
        for (const auto & m : _materialDescCache) {
            if (m.first == materials) {
                return m.second;
            }
        }

        auto offset = static_cast<uint16_t>(_materialDesc.allocate(materials));
        _materialDescCache.emplace_back(materials, offset);
        return offset;
    }

    uint32_t RayQueryBindingTable::registry(const ccstd::vector<RayTracingGeometryShadingDescriptor>& shadingGeometries) {
        MeshShadingDescriptor shadingDesciptor{};
        shadingDesciptor.subMeshCount = shadingGeometries.size();
        shadingDesciptor.padding = shadingGeometries[0].meshDescriptor.has_value() ? (shadingGeometries[0].meshDescriptor.value().indexBuffer->getStride() == 2 ? 0 : 1) : -1;

        ccstd::vector<SubMeshGeomDescriptor> meshes;
        meshes.reserve(shadingGeometries.size());
        std::transform(shadingGeometries.cbegin(), shadingGeometries.cend(), std::back_inserter(meshes), [&](const RayTracingGeometryShadingDescriptor& geom) {
            const auto& meshDescriptor = geom.meshDescriptor;
            if (meshDescriptor) {
                return SubMeshGeomDescriptor{meshDescriptor.value().indexBuffer->getDeviceAddress(), meshDescriptor.value().vertexBuffer->getDeviceAddress()};
            }
            return SubMeshGeomDescriptor{~0U, ~0U};
        });

        ccstd::vector<uint64_t> materials;
        materials.reserve(shadingGeometries.size());
        std::transform(shadingGeometries.cbegin(), shadingGeometries.cend(), std::back_inserter(materials), [&](const RayTracingGeometryShadingDescriptor& geom) {
            return geom.materialID;
        });

        shadingDesciptor.subMeshGeometryOffset = registrySubmeshes(meshes);
        shadingDesciptor.subMeshMaterialOffset = registryMaterials(materials);

        for (const auto & s : _shadingInstanceDescriptorsCache) {
            if (s.first == shadingDesciptor) {
                return s.second;
            }
        }

        auto offset = static_cast<uint32_t>(_shadingInstanceDescriptors.allocate({shadingDesciptor}));
        _shadingInstanceDescriptorsCache.emplace_back(shadingDesciptor, offset);
        return offset;
    }

    void RayQueryBindingTable::recreate() {
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

}  // namespace pipeline
} // namespace cc
