#include "CoreStd.h"
#include "GFXDescriptorSetProxy.h"
#include "GFXBufferProxy.h"
#include "GFXTextureProxy.h"

namespace cc {
namespace gfx {

bool DescriptorSetProxy::initialize(const DescriptorSetInfo &info) {
    _layout = info.layout;

    bool res = _remote->initialize(info);

    return res;
}

void DescriptorSetProxy::destroy() {
    _remote->destroy();
}

void DescriptorSetProxy::update() {
    _remote->update();
}

void DescriptorSetProxy::bindBuffer(uint binding, Buffer *buffer, uint index) {
    DescriptorSet::bindBuffer(binding, buffer, index);
    _remote->bindBuffer(binding, ((BufferProxy*)buffer)->GetRemote(), index);
}

void DescriptorSetProxy::bindTexture(uint binding, Texture *texture, uint index) {
    DescriptorSet::bindTexture(binding, texture, index);
    _remote->bindTexture(binding, ((TextureProxy*)texture)->GetRemote(), index);
}

void DescriptorSetProxy::bindSampler(uint binding, Sampler *sampler, uint index) {
    DescriptorSet::bindSampler(binding, sampler, index);
    _remote->bindSampler(binding, sampler, index);
}

} // namespace gfx
} // namespace cc
