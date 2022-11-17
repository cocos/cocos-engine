#pragma once

#include "renderer/gfx-base/GFXAccelerationStructure.h"
#include "base/Ptr.h"
#include "base/std/container/unordered_set.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "RayTracingSceneTypes.h"

namespace cc
{

namespace scene{
class RenderScene;
class Model;
}
namespace pipeline
{
    class GlobalDSManager;

    namespace {
    template <class... Ts>
    struct Overloaded : Ts... {
        using Ts::operator()...;
    };
    template <class... Ts>
    Overloaded(Ts...) -> Overloaded<Ts...>;
    } // namespace

    class RayTracingScene final
    {
    public:
        RayTracingScene();
        void update(const scene::RenderScene* scene);
       
        void destroy();

        void build(const RayTracingSceneDescriptor& rtScene) {
            
            for (const auto& instance : rtScene.instances) {
                //handleInstance(instance);
            }
            gfx::AccelerationStructureInfo tlasInfo{};
            tlasInfo.buildFlag = gfx::ASBuildFlagBits::ALLOW_UPDATE | gfx::ASBuildFlagBits::PREFER_FAST_TRACE;
            //tlasInfo.instances = _instances; todo
            _topLevelAccelerationStructure = gfx::Device::getInstance()->createAccelerationStructure(tlasInfo);
            _topLevelAccelerationStructure->build();
        }

        void update(const RayTracingSceneDescriptor& rtScene) {

        }

        void update(const RayTracingSceneUpdateInfo& updateInfo);

        /*
        void fillBlasInfo(gfx::AccelerationStructureInfo& blasInfo, const RayTracingInstanceDescriptor& instance) {
            if (instance.shadingGeometries[0].meshDescriptor) {
                for (const auto& shadingGeom : instance.shadingGeometries) {
                    gfx::ASTriangleMesh blasGeomMesh{};
                    fillblasGeomTriangleMesh(blasGeomMesh, shadingGeom.meshDescriptor.value());
                    blasInfo.triangleMeshes.push_back(blasGeomMesh);
                }
            } else {
                gfx::ASAABB blasGeomAABB{};
                blasGeomAABB.flag = gfx::ASGeometryFlagBit::GEOMETRY_OPAQUE;
                blasGeomAABB.minX = blasGeomAABB.minY = blasGeomAABB.minZ = -0.5;
                blasGeomAABB.maxX = blasGeomAABB.maxY = blasGeomAABB.maxZ = 0.5;
                blasInfo.aabbs.push_back(blasGeomAABB);
            }

            blasInfo.buildFlag = gfx::ASBuildFlagBits::ALLOW_COMPACTION | gfx::ASBuildFlagBits::PREFER_FAST_TRACE;
        }*/

        void fillblasGeomTriangleMesh(gfx::ASTriangleMesh& blasGeomMesh, const RayTracingMeshDescriptor& mesh) {
            blasGeomMesh.flag = gfx::ASGeometryFlagBit::GEOMETRY_OPAQUE;
            blasGeomMesh.vertexCount = mesh.vertexCount;
            blasGeomMesh.indexCount = mesh.indexCount;
            blasGeomMesh.indexBuffer = mesh.indexBuffer;
            blasGeomMesh.vertexBuffer = mesh.vertexBuffer;
            blasGeomMesh.vertexStride = mesh.vertexBuffer->getStride();
            blasGeomMesh.vertexFormat = mesh.vertexFormat;
        }

    protected:
        AccelerationStructurePtr _topLevelAccelerationStructure;
        //ccstd::vector<AccelerationStructurePtr> _bottomLevelAccelerationStructures;
        /*
         * first: blas's uuid
         * second:
         *  first: blas ref
         *  second: subMeshGeometryOffset
         */
        ccstd::unordered_map<uint64_t,std::pair<AccelerationStructurePtr,uint64_t>> _geomBlasCache;
        BlasCache _blasCache;
        /*
         * first: model's uuid
         * second:
         *  first: is alive
         *  second: Acceleration Structure Instance obj
         */
        ccstd::unordered_map<ccstd::string,std::pair<bool,gfx::ASInstance>> _modelCache;
        RayTracingInstanceCache _instanceCache;

        //ccstd::unordered_map<std::pair<uint64_t,std::vector<uint64_t>>, std::pair<IntrusivePtr<gfx::AccelerationStructure>, uint64_t>> _shadingBlasMap;
         
        GlobalDSManager* _globalDSManager{nullptr};
    private:

        bool needRebuild = false;
        bool needUpdate = false;
        bool needRecreate = false;

        RayQueryBindingTable rqBinding;
        std::vector<shaderRecord> _hitGroupShaderRecordList;

        std::variant<RayQueryBindingTable, std::vector<shaderRecord>> shadingInfo;

        inline void handleNewModel(const IntrusivePtr<scene::Model>& model);
        inline void handleModel(const IntrusivePtr<scene::Model>& model);

        std::optional<AccelerationStructurePtr> existBlas(const gfx::AccelerationStructureInfo& info) {
            return _blasCache.contain(info);
        }

        auto createBlas(gfx::AccelerationStructureInfo &info) {
            auto blas = gfx::Device::getInstance()->createAccelerationStructure(info);
            blas->build();
            blas->compact();
            _blasCache.add(blas);
            return blas;
        }

        auto handleInstance(const RayTracingInstanceDescriptor& instance) {
            gfx::ASInstance asInstanceInfo{};
            asInstanceInfo.mask = 0xFF;
            asInstanceInfo.flags = gfx::GeometryInstanceFlagBits::TRIANGLE_FACING_CULL_DISABLE;

            meshShadingInstanceDescriptor shadingInstanceDescriptor{};
            
            handleInstanceGeometries(instance, asInstanceInfo,shadingInstanceDescriptor);
            handleInstanceMaterials(instance, asInstanceInfo,shadingInstanceDescriptor);

            return asInstanceInfo;
        }

        void handleInstanceGeometries(const RayTracingInstanceDescriptor& instance, gfx::ASInstance& info, meshShadingInstanceDescriptor& shadingInstanceDescriptor) {
           
            const auto& shadingGeometries = instance.shadingGeometries;
            shadingInstanceDescriptor.subMeshCount = shadingGeometries.size();
            // todo temporal code
            shadingInstanceDescriptor.padding = shadingGeometries[0].meshDescriptor.value().indexBuffer->getStride() == 2 ? 0 : 1;
            info.transform = instance.transform;
            gfx::AccelerationStructureInfo blasInfo{};
            // fillBlasInfo(blasInfo, instance); todo
            auto result = existBlas(blasInfo);
            if (result) {
                info.accelerationStructureRef = result.value();
            } else {
                // New BLAS should be create and build.
                info.accelerationStructureRef = createBlas(blasInfo);

                // New subMesh geometry should be added
                if (!blasInfo.triangleMeshes.empty()) {
                    shadingInstanceDescriptor.subMeshGeometryOffset = rqBinding._geomDesc.size();
                    for (const auto& info : blasInfo.triangleMeshes) {
                        subMeshGeomDescriptor descriptor;
                        descriptor.vertexAddress = info.vertexBuffer->getDeviceAddress();
                        descriptor.indexAddress = info.indexBuffer->getDeviceAddress();
                        rqBinding._geomDesc.emplace_back(descriptor);
                    }
                }
            }
        }

        void handleInstanceMaterials(const RayTracingInstanceDescriptor& instance, gfx::ASInstance& info, meshShadingInstanceDescriptor& shadingInstanceDescriptor) {
            info.instanceCustomIdx = ~0U;
            info.shaderBindingTableRecordOffset = ~0U;

            // range search for submeshes material
            bool march_existing_mesh_materials = false;
            for (const auto& descriptor : rqBinding._shadingInstanceDescriptors) {
                march_existing_mesh_materials = true;

                if (shadingInstanceDescriptor.subMeshCount != descriptor.subMeshCount) {
                    march_existing_mesh_materials = false;
                } else {
                    for (int i = 0; i < descriptor.subMeshCount; i++) {
                        if (instance.shadingGeometries[i].materialID!=rqBinding._materialDesc[descriptor.subMeshMaterialOffset + i]) {
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
                shadingInstanceDescriptor.subMeshMaterialOffset = static_cast<uint16_t>(rqBinding._materialDesc.size());
                for (const auto& sm : instance.shadingGeometries) {
                    static int matId = 0;
                    //const auto& passes = sm->getPasses();
                    rqBinding._materialDesc.emplace_back(matId++);
                }
            }

            // If G1 = G2 and M1 = M2, then
            // meshShadingInstanceDescriptor could be shared.
            // hit group shader binding record could be shared.

            // ray query BT
            for (uint32_t index = 0; index < rqBinding._shadingInstanceDescriptors.size(); ++index) {
                if (shadingInstanceDescriptor == rqBinding._shadingInstanceDescriptors[index]) {
                    // Reuse instance with same blas and material
                    info.instanceCustomIdx = index;
                    break;
                }
            }

            if (info.instanceCustomIdx == ~0U) {
                // New meshShadingInstanceDescriptor should be added
                info.instanceCustomIdx = rqBinding._shadingInstanceDescriptors.size();
                rqBinding._shadingInstanceDescriptors.emplace_back(shadingInstanceDescriptor);
            }

            // ray tracing SBT

            /*
            ccstd::vector<shaderRecord> instanceShaderRecords{};
            const auto& geometries = info.accelerationStructureRef->getInfo().triangleMeshes;
            
            auto transformer = [&](const auto& geom, const auto& shadingGeom) {
                return shaderRecord{subMeshGeomDescriptor{geom.vertexBuffer->getDeviceAddress(), geom.indexBuffer->getDeviceAddress()},
                                    1}; // todo subModel materialID
            };

            std::transform(geometries.cbegin(), geometries.cend(), instance.shadingGeometries, std::back_inserter(instanceShaderRecords), transformer);

            const auto& result = std::search(_hitGroupShaderRecordList.cbegin(), _hitGroupShaderRecordList.cend(), instanceShaderRecords.cbegin(), instanceShaderRecords.cend());
            if (result != _hitGroupShaderRecordList.cend()) {
                const auto offset = static_cast<uint32_t>(std::distance(_hitGroupShaderRecordList.cbegin(), result));
                CC_ASSERT(offset < _hitGroupShaderRecordList.size());
                info.shaderBindingTableRecordOffset = offset;
            }

            if (info.shaderBindingTableRecordOffset == ~0U) {
                info.shaderBindingTableRecordOffset = static_cast<uint32_t>(_hitGroupShaderRecordList.size());
                _hitGroupShaderRecordList.insert(_hitGroupShaderRecordList.end(), instanceShaderRecords.begin(), instanceShaderRecords.end());
            }*/
        }
    };
} // namespace pipeline
} // namespace cc
