#include "CoreStd.h"
#include "GFXDescriptorSetProxy.h"
#include "GFXBufferProxy.h"
#include "GFXTextureProxy.h"
#include "GFXDeviceProxy.h"

namespace cc {
namespace gfx {

bool DescriptorSetProxy::initialize(const DescriptorSetInfo &info) {
    _layout = info.layout;
    uint descriptorCount = _layout->getDescriptorCount();
    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        DescriptorSetInit,
        remote, GetRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

void DescriptorSetProxy::destroy() {
    // do remember to clear these or else it might not be properly updated when reused
    _buffers.clear();
    _textures.clear();
    _samplers.clear();

    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        DescriptorSetDestroy,
        remote, GetRemote(),
        {
            remote->destroy();
        });
}

void DescriptorSetProxy::update() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        DescriptorSetUpdate,
        remote, GetRemote(),
        {
            remote->update();
        });
}

void DescriptorSetProxy::bindBuffer(uint binding, Buffer *buffer, uint index) {
    DescriptorSet::bindBuffer(binding, buffer, index);

    ENCODE_COMMAND_4(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        DescriptorSetBindBuffer,
        remote, GetRemote(),
        binding, binding,
        buffer, ((BufferProxy*)buffer)->GetRemote(),
        index, index,
        {
            remote->bindBuffer(binding, buffer, index);
        });
}

void DescriptorSetProxy::bindTexture(uint binding, Texture *texture, uint index) {
    DescriptorSet::bindTexture(binding, texture, index);

    ENCODE_COMMAND_4(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        DescriptorSetBindTexture,
        remote, GetRemote(),
        binding, binding,
        texture, ((TextureProxy*)texture)->GetRemote(),
        index, index,
        {
            remote->bindTexture(binding, texture, index);
        });
}

void DescriptorSetProxy::bindSampler(uint binding, Sampler *sampler, uint index) {
    DescriptorSet::bindSampler(binding, sampler, index);

    ENCODE_COMMAND_4(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        DescriptorSetBindSampler,
        remote, GetRemote(),
        binding, binding,
        sampler, sampler,
        index, index,
        {
            remote->bindSampler(binding, sampler, index);
        });
}

} // namespace gfx
} // namespace cc
