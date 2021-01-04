#include "CoreStd.h"

#include "base/threading/MessageQueue.h"
#include "GFXDescriptorSetLayoutAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXPipelineLayoutAgent.h"

namespace cc {
namespace gfx {

PipelineLayoutAgent::~PipelineLayoutAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        PipelineLayoutDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool PipelineLayoutAgent::initialize(const PipelineLayoutInfo &info) {

    _setLayouts = info.setLayouts;

    PipelineLayoutInfo actorInfo;
    actorInfo.setLayouts.resize(info.setLayouts.size());
    for (uint i = 0u; i < info.setLayouts.size(); i++) {
        actorInfo.setLayouts[i] = ((DescriptorSetLayoutAgent *)info.setLayouts[i])->getActor();
    }

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        PipelineLayoutInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void PipelineLayoutAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        PipelineLayoutDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
