#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2Commands.h"
#include "GLES2DescriptorSet.h"
#include "GLES2DescriptorSetLayout.h"
#include "GLES2Sampler.h"
#include "GLES2Texture.h"

namespace cc {
namespace gfx {

GLES2DescriptorSet::GLES2DescriptorSet(Device *device)
: DescriptorSet(device) {
}

GLES2DescriptorSet::~GLES2DescriptorSet() {
}

bool GLES2DescriptorSet::initialize(const DescriptorSetInfo &info) {

    _layout = info.layout;

    const GLES2GPUDescriptorSetLayout *gpuDescriptorSetLayout = ((GLES2DescriptorSetLayout *)_layout)->gpuDescriptorSetLayout();
    const size_t descriptorCount = gpuDescriptorSetLayout->descriptorCount;
    const size_t bindingCount = gpuDescriptorSetLayout->bindings.size();

    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    _gpuDescriptorSet = CC_NEW(GLES2GPUDescriptorSet);
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

void GLES2DescriptorSet::destroy() {
    if (_gpuDescriptorSet) {
        CC_DELETE(_gpuDescriptorSet);
        _gpuDescriptorSet = nullptr;
    }
    // do remember to clear these or else it might not be properly updated when reused
    _buffers.clear();
    _textures.clear();
    _samplers.clear();
}

void GLES2DescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        const GLES2GPUDescriptorList &descriptors = _gpuDescriptorSet->gpuDescriptors;
        for (size_t i = 0; i < descriptors.size(); i++) {
            if ((uint)descriptors[i].type & DESCRIPTOR_BUFFER_TYPE) {
                GLES2Buffer *buffer = (GLES2Buffer *)_buffers[i];
                if (buffer) {
                    if (buffer->gpuBuffer()) {
                        _gpuDescriptorSet->gpuDescriptors[i].gpuBuffer = buffer->gpuBuffer();
                    } else if (buffer->gpuBufferView()) {
                        _gpuDescriptorSet->gpuDescriptors[i].gpuBufferView = buffer->gpuBufferView();
                    }
                }
            } else if ((uint)descriptors[i].type & DESCRIPTOR_SAMPLER_TYPE) {
                if (_textures[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].gpuTexture = ((GLES2Texture *)_textures[i])->gpuTexture();
                }
                if (_samplers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].gpuSampler = ((GLES2Sampler *)_samplers[i])->gpuSampler();
                }
            }
        }
        _isDirty = false;
    }
}

} // namespace gfx
} // namespace cc
