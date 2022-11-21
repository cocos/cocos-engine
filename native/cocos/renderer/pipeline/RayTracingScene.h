#pragma once

#include "renderer/gfx-base/GFXAccelerationStructure.h"
#include "base/Ptr.h"
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

        
        void fillBlasInfo2(gfx::AccelerationStructureInfo& blasInfo, const RayTracingInstanceDescriptor& instance) {
            if (instance.shadingGeometries[0].meshDescriptor) {
                //triangle mesh
                for (const auto& shadingGeom : instance.shadingGeometries) {
                    gfx::ASTriangleMesh blasGeomMesh{};
                    fillblasGeomTriangleMesh(blasGeomMesh, shadingGeom.meshDescriptor.value());
                    blasInfo.triangleMeshes.push_back(blasGeomMesh);
                }
            } else {
                //aabb
                gfx::ASAABB blasGeomAABB{};
                blasGeomAABB.flag = gfx::ASGeometryFlagBit::GEOMETRY_OPAQUE;
                blasGeomAABB.minX = blasGeomAABB.minY = blasGeomAABB.minZ = -0.5;
                blasGeomAABB.maxX = blasGeomAABB.maxY = blasGeomAABB.maxZ = 0.5;
                blasInfo.aabbs.push_back(blasGeomAABB);
            }

            blasInfo.buildFlag = gfx::ASBuildFlagBits::ALLOW_COMPACTION | gfx::ASBuildFlagBits::PREFER_FAST_TRACE;
        }

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
         * second: blas ref
         */
        ccstd::unordered_map<uint64_t,AccelerationStructurePtr> _geomBlasCache;
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
        RayQueryBindingTable rtBinding;

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

        gfx::ASInstance handleInstance(const RayTracingInstanceDescriptor& instance) {
            gfx::ASInstance asInstanceInfo{};
            asInstanceInfo.mask = 0xFF;
            asInstanceInfo.flags = gfx::GeometryInstanceFlagBits::TRIANGLE_FACING_CULL_DISABLE;
            asInstanceInfo.transform = instance.transform;
            gfx::AccelerationStructureInfo blasInfo{};
            fillBlasInfo2(blasInfo, instance);
            auto result = existBlas(blasInfo);
            if (result) {
                asInstanceInfo.accelerationStructureRef = result.value();
            } else {
                // New BLAS should be create and build.
                asInstanceInfo.accelerationStructureRef = createBlas(blasInfo);
            }

            asInstanceInfo.instanceCustomIdx = rqBinding.registry(instance.shadingGeometries);
            asInstanceInfo.shaderBindingTableRecordOffset = rtBinding.registry(instance.shadingGeometries);

            return asInstanceInfo;
        }
    };
} // namespace pipeline
} // namespace cc
