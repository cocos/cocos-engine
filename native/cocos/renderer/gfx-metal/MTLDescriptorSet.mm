#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLDescriptorSet.h"
#include "MTLGPUObjects.h"
#include "MTLSampler.h"
#include "MTLTexture.h"

namespace cc {
namespace gfx {
CCMTLDescriptorSet::CCMTLDescriptorSet(Device *device) : DescriptorSet(device) {
}
CCMTLDescriptorSet::~CCMTLDescriptorSet() {
    destroy();
}

bool CCMTLDescriptorSet::initialize(const DescriptorSetInfo &info) {
    _layout = info.layout;

    const auto &bindings = _layout->getBindings();
    const auto descriptorCount = bindings.size();

    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    _gpuDescriptorSet = CC_NEW(CCMTLGPUDescriptorSet);
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (size_t i = 0; i < descriptorCount; i++) {
        _gpuDescriptorSet->gpuDescriptors[i].type = bindings[i].descriptorType;
        _gpuDescriptorSet->gpuDescriptors[i].stages = bindings[i].stageFlags;
    }

    return true;
}
void CCMTLDescriptorSet::destroy() {
    _layout = nullptr;
    CC_SAFE_DELETE(_gpuDescriptorSet);
}

void CCMTLDescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        const auto &bindings = _layout->getBindings();
        for (size_t i = 0; i < bindings.size(); i++) {
            if (static_cast<uint>(bindings[i].descriptorType) & DESCRIPTOR_BUFFER_TYPE) {
                if (_buffers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].buffer = static_cast<CCMTLBuffer *>(_buffers[i]);
                }
            } else if (static_cast<uint>(bindings[i].descriptorType) & DESCRIPTOR_SAMPLER_TYPE) {
                if (_textures[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].texture = static_cast<CCMTLTexture *>(_textures[i]);
                }
                if (_samplers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].sampler = static_cast<CCMTLSampler *>(_samplers[i]);
                }
            }
        }
        _isDirty = false;
    }
}
}
}
