#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDeviceAgent.h"
#include "GFXDescriptorSetLayoutAgent.h"

namespace cc {
namespace gfx {

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

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        DescriptorSetLayoutInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

void DescriptorSetLayoutAgent::destroy() {
    if (_actor) {
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
            DescriptorSetLayoutDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

} // namespace gfx
} // namespace cc
