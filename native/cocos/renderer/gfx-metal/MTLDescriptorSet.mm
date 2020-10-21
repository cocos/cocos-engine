#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLDescriptorSet.h"
#include "MTLDescriptorSetLayout.h"
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

    const auto gpuDescriptorSetLayout = static_cast<CCMTLDescriptorSetLayout *>(_layout)->gpuDescriptorSetLayout();
    const auto descriptorCount = gpuDescriptorSetLayout->descriptorCount;
    const auto bindingCount = gpuDescriptorSetLayout->bindings.size();

    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    _gpuDescriptorSet = CC_NEW(CCMTLGPUDescriptorSet);
    _gpuDescriptorSet->descriptorIndices = &gpuDescriptorSetLayout->descriptorIndices;
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (auto i = 0, k = 0; i < bindingCount; i++) {
        const auto &binding = gpuDescriptorSetLayout->bindings[i];
        for (auto j = 0; j < binding.count; j++, k++) {
            _gpuDescriptorSet->gpuDescriptors[k].type = binding.descriptorType;
        }
    }

    return true;
}
void CCMTLDescriptorSet::destroy() {
    _layout = nullptr;
    CC_SAFE_DELETE(_gpuDescriptorSet);
}

void CCMTLDescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        const auto &descriptors = _gpuDescriptorSet->gpuDescriptors;
        for (size_t i = 0; i < descriptors.size(); i++) {
            if (static_cast<uint>(descriptors[i].type) & DESCRIPTOR_BUFFER_TYPE) {
                if (_buffers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].buffer = static_cast<CCMTLBuffer *>(_buffers[i]);
                }
            } else if (static_cast<uint>(descriptors[i].type) & DESCRIPTOR_SAMPLER_TYPE) {
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
