#pragma once

#include "renderer/gfx-base/GFXAccelerationStructure.h"
#include "base/Ptr.h"
#include "base/std/container/unordered_set.h"

namespace cc
{

namespace scene{
class RenderScene;
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
        IntrusivePtr<gfx::AccelerationStructure> topLevelAccelerationStructure;
        IntrusivePtr<gfx::Buffer> sceneDescBuffer;
        ccstd::vector<IntrusivePtr<gfx::AccelerationStructure>> bottomLevelAccelerationStructures;
        ccstd::unordered_map<uint64_t,IntrusivePtr<gfx::AccelerationStructure>> blasMap;
        ccstd::unordered_map<ccstd::string,std::pair<bool,gfx::ASInstance>> modelMap;
         
        pipeline::GlobalDSManager* _globalDSManager{nullptr};
    private:

    };
} // namespace pipeline
} // namespace cc
