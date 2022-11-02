#pragma once

#include "renderer/gfx-base/GFXAccelerationStructure.h"
#include "base/Ptr.h"
#include "base/std/container/unordered_set.h"

namespace cc
{

namespace scene{
class RenderScene;
class Model;
}
namespace pipeline
{
    class GlobalDSManager;
    class SceneAccelerationStructure final
    {
    public:
        SceneAccelerationStructure();
        void update(const scene::RenderScene* scene);
        void destroy();
    protected:
        IntrusivePtr<gfx::AccelerationStructure> _topLevelAccelerationStructure;
        ccstd::vector<IntrusivePtr<gfx::AccelerationStructure>> _bottomLevelAccelerationStructures;
        ccstd::unordered_map<uint64_t,std::pair<IntrusivePtr<gfx::AccelerationStructure>,uint64_t>> _blasMap;
        ccstd::unordered_map<ccstd::string,std::pair<bool,gfx::ASInstance>> _modelMap;
         
        pipeline::GlobalDSManager* _globalDSManager{nullptr};
    private:
        
        struct subMeshGeomDescriptor{
            uint64_t indexAddress{0};
            uint64_t vertexAddress{0};
        };

        struct meshShadingInstanceDescriptor{
            // The first submesh geometry position of the Mesh
            uint subMeshGeometryOffset{0};
            // The first submesh material position of the Mesh
            uint subMeshMaterialOffset{0};
            uint subMeshCount{0};
        };

        //instanceDecs.geometryOffset + geometryIndex
        ccstd::vector<subMeshGeomDescriptor> geomDesc;
        ccstd::vector<uint64_t> materialDesc;
        //instanceCustomIndex
        ccstd::vector<meshShadingInstanceDescriptor> instanceDesc;

        IntrusivePtr<gfx::Buffer> geomDescGPUBuffer;
        IntrusivePtr<gfx::Buffer> materialDescGPUBuffer;
        IntrusivePtr<gfx::Buffer> instanceDescGPUBuffer;
    };
} // namespace pipeline
} // namespace cc
