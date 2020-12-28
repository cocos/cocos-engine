#include "CoreStd.h"

#include "threading/MessageQueue.h"
#include "GFXBufferAgent.h"
#include "GFXDescriptorSetAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXPipelineLayoutAgent.h"
#include "GFXSamplerAgent.h"
#include "GFXTextureAgent.h"

namespace cc {
namespace gfx {

bool DescriptorSetAgent::initialize(const DescriptorSetInfo &info) {
    _layout = info.layout->getSetLayouts()[info.setIndex];
    uint descriptorCount = _layout->getDescriptorCount();
    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    DescriptorSetInfo actorInfo;
    actorInfo.layout = ((PipelineLayoutAgent *)info.layout)->getActor();
    actorInfo.setIndex = info.setIndex;

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void DescriptorSetAgent::destroy() {
    // do remember to clear these or else it might not be properly updated when reused
    _buffers.clear();
    _textures.clear();
    _samplers.clear();

    if (_actor) {
        ENQUEUE_MESSAGE_1(
            ((DeviceAgent *)_device)->getMessageQueue(),
            DescriptorSetDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

void DescriptorSetAgent::update() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetUpdate,
        actor, getActor(),
        {
            actor->update();
        });
}

void DescriptorSetAgent::bindBuffer(uint binding, Buffer *buffer, uint index) {
    DescriptorSet::bindBuffer(binding, buffer, index);

    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetBindBuffer,
        actor, getActor(),
        binding, binding,
        buffer, ((BufferAgent *)buffer)->getActor(),
        index, index,
        {
            actor->bindBuffer(binding, buffer, index);
        });
}

void DescriptorSetAgent::bindTexture(uint binding, Texture *texture, uint index) {
    DescriptorSet::bindTexture(binding, texture, index);

    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetBindTexture,
        actor, getActor(),
        binding, binding,
        texture, ((TextureAgent *)texture)->getActor(),
        index, index,
        {
            actor->bindTexture(binding, texture, index);
        });
}

void DescriptorSetAgent::bindSampler(uint binding, Sampler *sampler, uint index) {
    DescriptorSet::bindSampler(binding, sampler, index);

    ENQUEUE_MESSAGE_4(
        ((DeviceAgent *)_device)->getMessageQueue(),
        DescriptorSetBindSampler,
        actor, getActor(),
        binding, binding,
        sampler, ((SamplerAgent *)sampler)->getActor(),
        index, index,
        {
            actor->bindSampler(binding, sampler, index);
        });
}

} // namespace gfx
} // namespace cc
