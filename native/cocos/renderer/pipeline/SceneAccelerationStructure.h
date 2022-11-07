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
         
        GlobalDSManager* _globalDSManager{nullptr};
    private:
        
        struct subMeshGeomDescriptor{
            uint64_t indexAddress{0};
            uint64_t vertexAddress{0};
        };

        struct meshShadingInstanceDescriptor{
            // The first submesh geometry position of the Mesh
            uint16_t subMeshGeometryOffset{0};
            // The first submesh material position of the Mesh
            uint16_t subMeshMaterialOffset{0};
            uint16_t subMeshCount{0};
            uint16_t padding{0};
        };

        //instanceDecs.geometryOffset + geometryIndex
        ccstd::vector<subMeshGeomDescriptor> _geomDesc;
        ccstd::vector<uint64_t> _materialDesc;
        //instanceCustomIndex
        ccstd::vector<meshShadingInstanceDescriptor> _instanceDesc;

        IntrusivePtr<gfx::Buffer> _geomDescGPUBuffer;
        IntrusivePtr<gfx::Buffer> _materialDescGPUBuffer;
        IntrusivePtr<gfx::Buffer> _instanceDescGPUBuffer;
    };
} // namespace pipeline
} // namespace cc
