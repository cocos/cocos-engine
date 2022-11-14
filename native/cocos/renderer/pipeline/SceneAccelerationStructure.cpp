#include "SceneAccelerationStructure.h"
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

    void fillblasGeomTriangleMesh(gfx::ASTriangleMesh& blasGeomMesh, const IntrusivePtr<scene::SubModel>& pSubModel) {
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
                fillblasGeomTriangleMesh(blasGeomMesh, pSubModel);
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

    SceneAccelerationStructure::SceneAccelerationStructure() {
        const auto* pipelineRuntime = Root::getInstance()->getPipeline();
        _globalDSManager = pipelineRuntime->getGlobalDSManager(); 
    }

    void SceneAccelerationStructure::handleNewModel(const IntrusivePtr<scene::Model>& pModel) {

        gfx::ASInstance tlasGeom{};
        meshShadingInstanceDescriptor shadingInstanceDescriptor{};

        const auto& subModels = pModel->getSubModels();
        shadingInstanceDescriptor.subMeshCount = subModels.size();

        tlasGeom.instanceCustomIdx = ~0U;
        tlasGeom.shaderBindingTableRecordOffset = ~0U;
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

        auto blasIt = _geomBlasMap.find(meshUuid);
        if (blasIt != _geomBlasMap.cend()) {
            // BLAS could be reused.
            tlasGeom.accelerationStructureRef = blasIt->second.first;
            shadingInstanceDescriptor.subMeshGeometryOffset = blasIt->second.second;
        } else {
            // New BLAS should be create and build.
            gfx::AccelerationStructureInfo blasInfo{};
            fillBlasInfo(blasInfo, pModel);
            auto blas = gfx::Device::getInstance()->createAccelerationStructure(blasInfo);
            blas->build();
            blas->compact();

            // New subMesh geometry should be added
            if (!blasInfo.triangleMeshes.empty()) {
                shadingInstanceDescriptor.subMeshGeometryOffset = _geomDesc.size();
                for (const auto& info : blasInfo.triangleMeshes) {
                    subMeshGeomDescriptor descriptor;
                    descriptor.vertexAddress = info.vertexBuffer->getDeviceAddress();
                    descriptor.indexAddress = info.indexBuffer->getDeviceAddress();
                    _geomDesc.emplace_back(descriptor);
                }
            }

            _geomBlasMap.emplace(meshUuid, std::make_pair(blas, shadingInstanceDescriptor.subMeshGeometryOffset));

            tlasGeom.accelerationStructureRef = blas;
        }

        auto sameMatID = [](const IntrusivePtr<scene::SubModel>& sm1, const uint64_t ID) -> bool { return false; }; // todo

        // range search for submeshes material
        bool march_existing_mesh_materials = false;
        for (const auto& descriptor : _shadingInstanceDescriptors) {
            march_existing_mesh_materials = true;

            if (shadingInstanceDescriptor.subMeshCount != descriptor.subMeshCount) {
                march_existing_mesh_materials = false;
            } else {
                for (int i = 0; i < descriptor.subMeshCount; i++) {
                    if (!sameMatID(subModels[i], _materialDesc[descriptor.subMeshMaterialOffset + i])) {
                        march_existing_mesh_materials = false;
                        break;
                    }
                }
            }

            if (march_existing_mesh_materials) {
                shadingInstanceDescriptor.subMeshMaterialOffset = descriptor.subMeshMaterialOffset;
                break;
            }
        }

        if (!march_existing_mesh_materials) {
            shadingInstanceDescriptor.subMeshMaterialOffset = static_cast<uint16_t>(_materialDesc.size());
            for (const auto& sm : subModels) {
                static int matId = 0;
                const auto & passes = sm->getPasses();
                
                _materialDesc.emplace_back(matId++);
            }
        }

        // If G1 = G2 and M1 = M2, then
        // meshShadingInstanceDescriptor could be shared.
        // hit group shader binding record could be shared.

        //ray query BT
        for (uint32_t index = 0;index<_shadingInstanceDescriptors.size();++index) {
            if (shadingInstanceDescriptor == _shadingInstanceDescriptors[index]) {
                // Reuse instance with same blas and material
                tlasGeom.instanceCustomIdx = index;
                break;
            }
        }

        if (tlasGeom.instanceCustomIdx == ~0U) {
            //New meshShadingInstanceDescriptor should be added
            tlasGeom.instanceCustomIdx = _shadingInstanceDescriptors.size();
            _shadingInstanceDescriptors.emplace_back(shadingInstanceDescriptor);
        }

        //ray tracing SBT
        ccstd::vector<shaderRecord> instanceShaderRecords{};
        const auto & geometries = tlasGeom.accelerationStructureRef->getInfo().triangleMeshes;
        auto transformer = [&](const auto& geom,const auto& subModel) {
            return shaderRecord{subMeshGeomDescriptor{geom.vertexBuffer->getDeviceAddress(),geom.indexBuffer->getDeviceAddress()},
                1};//todo subModel materialID
        };

        std::transform(geometries.cbegin(), geometries.cend(), subModels.cbegin(),std::back_inserter(instanceShaderRecords),transformer);

        const auto & result = std::search(_hitGroupShaderBindingTable.cbegin(), _hitGroupShaderBindingTable.cend(), instanceShaderRecords.cbegin(), instanceShaderRecords.cend());
        if (result!=_hitGroupShaderBindingTable.cend()) {
            const auto offset = static_cast<uint32_t>(std::distance(_hitGroupShaderBindingTable.cbegin(), result));
            CC_ASSERT(offset < _hitGroupShaderBindingTable.size());
            tlasGeom.shaderBindingTableRecordOffset = offset;
        }
        
        if (tlasGeom.shaderBindingTableRecordOffset == ~0U) {
            tlasGeom.shaderBindingTableRecordOffset = static_cast<uint32_t>(_hitGroupShaderBindingTable.size());
            _hitGroupShaderBindingTable.insert(_hitGroupShaderBindingTable.end(), instanceShaderRecords.begin(), instanceShaderRecords.end());
        }

        _modelMap.emplace(pModel->getNode()->getUuid(), std::pair{true, tlasGeom});
    }

    void SceneAccelerationStructure::handleModel(const IntrusivePtr<scene::Model>& pModel) {
        
        if (!pModel->getNode()->isValid() || !pModel->getNode()->isActive() || pModel->getNode()->getName() == "Profiler_Root") {
            return;
        }

        auto modelIt = _modelMap.find(pModel->getNode()->getUuid());

        if (modelIt != _modelMap.cend()) {
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

    void SceneAccelerationStructure::update(const scene::RenderScene* scene) {
        needRebuild = needUpdate = needRecreate = false;

        for (const auto& pModel : scene->getModels()) {
            handleModel(pModel);
        }

        //sweep deactive model entries
        auto modelIt = _modelMap.begin();
        while (modelIt != _modelMap.end()) {
            if (modelIt->second.first) {
                modelIt->second.first = false;
                ++modelIt;
            } else {
                modelIt = _modelMap.erase(modelIt);
                needRebuild = true;
            }
        } 

        //sweep deactive blas
        auto blasIt = _geomBlasMap.begin();
        while (blasIt != _geomBlasMap.end()) {
            if (blasIt->second.first->getRefCount()==0) {
                blasIt = _geomBlasMap.erase(blasIt);
                //blasIt->second->destroy();
            }else {
                ++blasIt;
            }
        }

        if (needRebuild||needUpdate) {

            gfx::AccelerationStructureInfo tlasInfo{};
            tlasInfo.buildFlag = gfx::ASBuildFlagBits::ALLOW_UPDATE | gfx::ASBuildFlagBits::PREFER_FAST_TRACE;
            tlasInfo.instances.reserve(_modelMap.size());
            for (const auto& inst : _modelMap) {
                tlasInfo.instances.emplace_back(inst.second.second);
            }
            if (needRecreate) {
                _topLevelAccelerationStructure = gfx::Device::getInstance()->createAccelerationStructure(tlasInfo);
                gfx::BufferInfo geomDescBufferInfo{};
                geomDescBufferInfo.size = static_cast<uint32_t>(_geomDesc.size()) * sizeof(subMeshGeomDescriptor);
                geomDescBufferInfo.flags = gfx::BufferFlags::NONE;
                geomDescBufferInfo.usage = gfx::BufferUsage::STORAGE | gfx::BufferUsage::TRANSFER_DST;
                geomDescBufferInfo.memUsage = gfx::MemoryUsage::HOST;
                _geomDescGPUBuffer = gfx::Device::getInstance()->createBuffer(geomDescBufferInfo);

                gfx::BufferInfo instanceDescBufferInfo{};
                instanceDescBufferInfo.size = static_cast<uint32_t>(_shadingInstanceDescriptors.size()) * sizeof(meshShadingInstanceDescriptor);
                instanceDescBufferInfo.flags = gfx::BufferFlags::NONE;
                instanceDescBufferInfo.usage = gfx::BufferUsage::STORAGE | gfx::BufferUsage::TRANSFER_DST;
                instanceDescBufferInfo.memUsage = gfx::MemoryUsage::HOST;
                _instanceDescGPUBuffer = gfx::Device::getInstance()->createBuffer(instanceDescBufferInfo);
            } else {
                _topLevelAccelerationStructure->setInfo(tlasInfo);
            }
            if (needRebuild) {
                _topLevelAccelerationStructure->build();
                _geomDescGPUBuffer->update(_geomDesc.data());
                _instanceDescGPUBuffer->update(_shadingInstanceDescriptors.data());
            } else if (needUpdate) {
                _topLevelAccelerationStructure->update();
                _geomDescGPUBuffer->update(_geomDesc.data());
                _instanceDescGPUBuffer->update(_shadingInstanceDescriptors.data());
            }
        }

        if (needRecreate) {
            _globalDSManager->bindAccelerationStructure(TOPLEVELAS::BINDING, _topLevelAccelerationStructure);
            _globalDSManager->bindBuffer(SCENEGEOMETRYDESC::BINDING, _geomDescGPUBuffer);
            _globalDSManager->bindBuffer(SCENEINSTANCEDESC::BINDING, _instanceDescGPUBuffer);
            _globalDSManager->update();
        }

        needRecreate = needRebuild = needUpdate = false;
    }

    void SceneAccelerationStructure::destroy() {
        _topLevelAccelerationStructure = nullptr;
        _bottomLevelAccelerationStructures.clear();
        _geomBlasMap.clear();
        _modelMap.clear();
    }

}  // namespace pipeline
} // namespace cc
