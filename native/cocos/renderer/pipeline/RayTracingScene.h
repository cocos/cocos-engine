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
        inline void handleNewModel(const IntrusivePtr<scene::Model>& model);
        inline void handleModel(const IntrusivePtr<scene::Model>& model);
        void destroy();

        void build(const RayTracingSceneDescriptor& rtScene) {
            
            for (const auto& instance : rtScene.instances) {
                handleInstance(instance);
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

        void handleInstance(const RayTracingInstanceDescriptor& instance) {
            gfx::ASInstance asInstanceInfo{};
            asInstanceInfo.transform = instance.transform;
            gfx::AccelerationStructureInfo blasInfo{};
            //fillBlasInfo(blasInfo, instance); todo
            auto result = _blasCache.contain(blasInfo);
            if (result) {
                asInstanceInfo.accelerationStructureRef = result.value();
            } else {
                auto blas = gfx::Device::getInstance()->createAccelerationStructure(blasInfo);
                blas->build();
                blas->compact();
                asInstanceInfo.accelerationStructureRef = blas;
                _blasCache.add(blas);
            }
            //_instances.push_back(asInstanceInfo);todo
        }

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
    };
} // namespace pipeline
} // namespace cc
