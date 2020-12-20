#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDescriptorSetLayoutAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXPipelineLayoutAgent.h"

namespace cc {
namespace gfx {

bool PipelineLayoutAgent::initialize(const PipelineLayoutInfo &info) {

    _setLayouts = info.setLayouts;

    PipelineLayoutInfo actorInfo;
    actorInfo.setLayouts.resize(info.setLayouts.size());
    for (uint i = 0u; i < info.setLayouts.size(); i++) {
        actorInfo.setLayouts[i] = ((DescriptorSetLayoutAgent *)info.setLayouts[i])->getActor();
    }

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        PipelineLayoutInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void PipelineLayoutAgent::destroy() {
    if (_actor) {
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
            PipelineLayoutDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

} // namespace gfx
} // namespace cc
