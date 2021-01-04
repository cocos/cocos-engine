#include "CoreStd.h"

#include "base/threading/MessageQueue.h"
#include "GFXDeviceAgent.h"
#include "GFXDescriptorSetLayoutAgent.h"

namespace cc {
namespace gfx {

DescriptorSetLayoutAgent::~DescriptorSetLayoutAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetLayoutDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool DescriptorSetLayoutAgent::initialize(const DescriptorSetLayoutInfo &info) {

    _bindings = info.bindings;
    uint bindingCount = _bindings.size();
    _descriptorCount = 0u;

    if (bindingCount) {
        uint maxBinding = 0u;
        vector<uint> flattenedIndices(bindingCount);
        for (uint i = 0u; i < bindingCount; i++) {
            const DescriptorSetLayoutBinding &binding = _bindings[i];
            flattenedIndices[i] = _descriptorCount;
            _descriptorCount += binding.count;
            if (binding.binding > maxBinding) maxBinding = binding.binding;
        }

        _bindingIndices.resize(maxBinding + 1, GFX_INVALID_BINDING);
        _descriptorIndices.resize(maxBinding + 1, GFX_INVALID_BINDING);
        for (uint i = 0u; i <  bindingCount; i++) {
            const DescriptorSetLayoutBinding &binding = _bindings[i];
            _bindingIndices[binding.binding] = i;
            _descriptorIndices[binding.binding] = flattenedIndices[i];
        }
    }

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetLayoutInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

void DescriptorSetLayoutAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetLayoutDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
