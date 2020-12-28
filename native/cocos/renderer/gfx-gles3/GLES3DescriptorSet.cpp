#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3Commands.h"
#include "GLES3DescriptorSet.h"
#include "GLES3DescriptorSetLayout.h"
#include "GLES3Sampler.h"
#include "GLES3Texture.h"

namespace cc {
namespace gfx {

GLES3DescriptorSet::GLES3DescriptorSet(Device *device)
: DescriptorSet(device) {
}

GLES3DescriptorSet::~GLES3DescriptorSet() {
}

bool GLES3DescriptorSet::initialize(const DescriptorSetInfo &info) {

    _layout = info.layout;

    const GLES3GPUDescriptorSetLayout *gpuDescriptorSetLayout = ((GLES3DescriptorSetLayout *)_layout)->gpuDescriptorSetLayout();
    const size_t descriptorCount = gpuDescriptorSetLayout->descriptorCount;
    const size_t bindingCount = gpuDescriptorSetLayout->bindings.size();

    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    _gpuDescriptorSet = CC_NEW(GLES3GPUDescriptorSet);
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (size_t i = 0u, k = 0u; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = gpuDescriptorSetLayout->bindings[i];
        for (uint j = 0; j < binding.count; j++, k++) {
            _gpuDescriptorSet->gpuDescriptors[k].type = binding.descriptorType;
        }
    }

    _gpuDescriptorSet->descriptorIndices = &gpuDescriptorSetLayout->descriptorIndices;

    return true;
}

void GLES3DescriptorSet::destroy() {
    if (_gpuDescriptorSet) {
        CC_DELETE(_gpuDescriptorSet);
        _gpuDescriptorSet = nullptr;
    }
    // do remember to clear these or else it might not be properly updated when reused
    _buffers.clear();
    _textures.clear();
    _samplers.clear();
}

void GLES3DescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        const GLES3GPUDescriptorList &descriptors = _gpuDescriptorSet->gpuDescriptors;
        for (size_t i = 0; i < descriptors.size(); i++) {
            if ((uint)descriptors[i].type & DESCRIPTOR_BUFFER_TYPE) {
                if (_buffers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].gpuBuffer = ((GLES3Buffer *)_buffers[i])->gpuBuffer();
                }
            } else if ((uint)descriptors[i].type & DESCRIPTOR_SAMPLER_TYPE) {
                if (_textures[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].gpuTexture = ((GLES3Texture *)_textures[i])->gpuTexture();
                }
                if (_samplers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].gpuSampler = ((GLES3Sampler *)_samplers[i])->gpuSampler();
                }
            }
        }
        _isDirty = false;
    }
}

} // namespace gfx
} // namespace cc
