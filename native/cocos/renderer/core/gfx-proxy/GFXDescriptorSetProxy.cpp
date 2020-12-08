#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXBufferProxy.h"
#include "GFXDescriptorSetLayoutProxy.h"
#include "GFXDescriptorSetProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXSamplerProxy.h"
#include "GFXTextureProxy.h"

namespace cc {
namespace gfx {

bool DescriptorSetProxy::initialize(const DescriptorSetInfo &info) {
    _layout = info.layout;
    uint descriptorCount = _layout->getDescriptorCount();
    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    DescriptorSetInfo remoteInfo;
    remoteInfo.layout = ((DescriptorSetLayoutProxy *)info.layout)->getRemote();

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        DescriptorSetInit,
        remote, getRemote(),
        info, remoteInfo,
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

    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            DescriptorSetDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

void DescriptorSetProxy::update() {
    ENCODE_COMMAND_1(
        ((DeviceProxy *)_device)->getMainEncoder(),
        DescriptorSetUpdate,
        remote, getRemote(),
        {
            remote->update();
        });
}

void DescriptorSetProxy::bindBuffer(uint binding, Buffer *buffer, uint index) {
    DescriptorSet::bindBuffer(binding, buffer, index);

    ENCODE_COMMAND_4(
        ((DeviceProxy *)_device)->getMainEncoder(),
        DescriptorSetBindBuffer,
        remote, getRemote(),
        binding, binding,
        buffer, ((BufferProxy *)buffer)->getRemote(),
        index, index,
        {
            remote->bindBuffer(binding, buffer, index);
        });
}

void DescriptorSetProxy::bindTexture(uint binding, Texture *texture, uint index) {
    DescriptorSet::bindTexture(binding, texture, index);

    ENCODE_COMMAND_4(
        ((DeviceProxy *)_device)->getMainEncoder(),
        DescriptorSetBindTexture,
        remote, getRemote(),
        binding, binding,
        texture, ((TextureProxy *)texture)->getRemote(),
        index, index,
        {
            remote->bindTexture(binding, texture, index);
        });
}

void DescriptorSetProxy::bindSampler(uint binding, Sampler *sampler, uint index) {
    DescriptorSet::bindSampler(binding, sampler, index);

    ENCODE_COMMAND_4(
        ((DeviceProxy *)_device)->getMainEncoder(),
        DescriptorSetBindSampler,
        remote, getRemote(),
        binding, binding,
        sampler, ((SamplerProxy *)sampler)->getRemote(),
        index, index,
        {
            remote->bindSampler(binding, sampler, index);
        });
}

} // namespace gfx
} // namespace cc
