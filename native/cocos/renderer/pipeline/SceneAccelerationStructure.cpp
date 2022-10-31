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

        void fillblasGeomMesh(gfx::ASTriangleMesh& blasGeomMesh, const IntrusivePtr<scene::SubModel>& pSubModel) {
            blasGeomMesh.flag = gfx::ASGeometryFlagBit::GEOMETRY_OPAQUE;
            const auto* inputAssembler = pSubModel->getInputAssembler();
            blasGeomMesh.vertexCount = inputAssembler->getVertexCount();
            blasGeomMesh.indexCount = inputAssembler->getIndexCount();
            blasGeomMesh.indexBuffer = inputAssembler->getIndexBuffer();

            const auto& attributes = inputAssembler->getAttributes();

            auto posAttribute = std::find_if(attributes.cbegin(), attributes.cend(), [](const gfx::Attribute& attr) {
                return attr.name == gfx::ATTR_NAME_POSITION;
            });

            if (posAttribute != attributes.cend()) {
                const auto vertexBufferList = inputAssembler->getVertexBuffers();
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
                blasGeomAABB.minX = -5.0;
                blasGeomAABB.minY = -5.0;
                blasGeomAABB.minZ = -5.0;
                blasGeomAABB.maxX = 5.0;
                blasGeomAABB.maxY = 5.0;
                blasGeomAABB.maxZ = 5.0;
                blasInfo.aabbs.push_back(blasGeomAABB);
            } else {
                for (const auto& pSubModel : pModel->getSubModels()) {
                    gfx::ASTriangleMesh blasGeomMesh{};
                    fillblasGeomMesh(blasGeomMesh, pSubModel);
                    blasInfo.triangels.push_back(blasGeomMesh);
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

        }

        SceneAccelerationStructure::SceneAccelerationStructure() {
            auto* pipelineRuntime = Root::getInstance()->getPipeline();
            _globalDSManager = pipelineRuntime->getGlobalDSManager(); 
        }

        void SceneAccelerationStructure::update(const scene::RenderScene* scene) {

            bool needRebuild = false;
            bool needUpdate = false;
            bool needRecreate = false;

            auto* device = gfx::Device::getInstance();

            for (const auto& pModel : scene->getModels()) {
                const auto name = pModel->getNode()->getName();

                if (!pModel->getNode()->isValid() || !pModel->getNode()->isActive() || name == "Profiler_Root") {
                    continue;
                }

                const auto modelUuid = pModel->getNode()->getUuid();

                auto modelIt = _modelMap.find(modelUuid);
                if (modelIt != _modelMap.cend()) {
                    // set alive flag true
                    modelIt->second.first = true;

                    if (pModel->getTransform()->getChangedFlags()) {
                        // Instance transform changed, tlas should be updated.
                        auto lastUpdateTransfrom = &modelIt->second.second.transform;
                        const auto* currentTransfrom = &pModel->getTransform()->getWorldMatrix();
                        similarTransform(lastUpdateTransfrom, currentTransfrom) ? needUpdate = true : needRebuild = true;
                        modelIt->second.second.transform = *currentTransfrom;
                    }

                }else {
                    // New instance should be added to top-level acceleration structure.
                    // Tlas should be recreate and rebuild.
                    needRecreate = needRebuild = true;
                    gfx::ASInstance tlasGeom{};

                    tlasGeom.instanceCustomIdx = 0;
                    
                    if (name == "Cube-001") {
                        tlasGeom.instanceCustomIdx = 1;
                    } else if (name == "Cube-002") {
                        tlasGeom.instanceCustomIdx = 2;
                    } else if (name == "Cube-003") {
                        tlasGeom.instanceCustomIdx = 3;
                    } else if (name == "Cube-004"){
                        tlasGeom.instanceCustomIdx = 4;
                    } else if (name == "stenford_dragon_high") {
                        tlasGeom.instanceCustomIdx = 5;
                    } else if (name == "Cube") {
                        tlasGeom.instanceCustomIdx = 6;
                    } else if (name == "wall3") {
                        tlasGeom.instanceCustomIdx = 7;
                    }
                    
                    tlasGeom.shaderBindingTableRecordOffset = 0;
                    tlasGeom.mask = 0xFF;
                    tlasGeom.transform = pModel->getTransform()->getWorldMatrix();
                    tlasGeom.flags = gfx::GeometryInstanceFlagBits::TRIANGLE_FACING_CULL_DISABLE;

                    if (name == "AABB") {
                        tlasGeom.flags = gfx::GeometryInstanceFlagBits::FORCE_OPAQUE;
                    }       

                    const auto& subModels = pModel->getSubModels();
                    auto meshUuid = reinterpret_cast<uint64_t>(subModels[0]->getSubMesh());

                    if (name == "AABB") {
                        meshUuid += 1024;
                    }

                    auto blasIt = _blasMap.find(meshUuid);
                    if (blasIt != _blasMap.cend()) {
                        // Blas could be reused.
                        tlasGeom.accelerationStructureRef = blasIt->second;
                    } else {
                        // New Blas should be create and build.
                        gfx::AccelerationStructureInfo blasInfo{};
                        fillBlasInfo(blasInfo, pModel);
                        gfx::AccelerationStructure* blas = device->createAccelerationStructure(blasInfo);
                        blas->build();
                        blas->compact();
                        _blasMap.emplace(meshUuid, blas);

                        tlasGeom.accelerationStructureRef = blas;
                    }
                    _modelMap.emplace(modelUuid, std::pair{true, tlasGeom});
                }
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
            auto blasIt = _blasMap.begin();
            while (blasIt != _blasMap.end()) {
                if (blasIt->second->getRefCount()==0) {
                    blasIt = _blasMap.erase(blasIt);
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
                    _topLevelAccelerationStructure = device->createAccelerationStructure(tlasInfo);
                } else {
                    _topLevelAccelerationStructure->setInfo(tlasInfo);
                }
                if (needRebuild) {
                    _topLevelAccelerationStructure->build();
                } else if (needUpdate) {
                    _topLevelAccelerationStructure->update();
                }
            }

            if (needRecreate) {
                _globalDSManager->bindAccelerationStructure(pipeline::TOPLEVELAS::BINDING, _topLevelAccelerationStructure);
                _globalDSManager->update();
            }

            needRecreate = needRebuild = needUpdate = false;
		}

        void SceneAccelerationStructure::destroy() {
            _topLevelAccelerationStructure = nullptr;
            _bottomLevelAccelerationStructures.clear();
            _blasMap.clear();
            _modelMap.clear();
        }

	}  // namespace pipeline
} // namespace cc
