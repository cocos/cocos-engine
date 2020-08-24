#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2Commands.h"
#include "GLES2DescriptorSet.h"
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

    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    const size_t descriptorCount = bindings.size();

    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    _gpuDescriptorSet = CC_NEW(GLES2GPUDescriptorSet);
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (size_t i = 0u; i < descriptorCount; i++) {
        _gpuDescriptorSet->gpuDescriptors[i].type = bindings[i].descriptorType;
    }

    _status = Status::SUCCESS;

    return true;
}

void GLES2DescriptorSet::destroy() {
    _layout = nullptr;

    if (_gpuDescriptorSet) {
        CC_DELETE(_gpuDescriptorSet);
        _gpuDescriptorSet = nullptr;
    }

    _status = Status::UNREADY;
}

void GLES2DescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        uint bindingCount = _gpuDescriptorSet->gpuDescriptors.size();

        for (size_t i = 0; i < bindingCount; i++) {
            GLES2GPUDescriptor &binding = _gpuDescriptorSet->gpuDescriptors[i];

            if ((uint)binding.type & DESCRIPTOR_BUFFER_TYPE) {
                GLES2Buffer *buffer = (GLES2Buffer *)_buffers[i];
                if (buffer) {
                    if (buffer->gpuBuffer()) {
                        binding.gpuBuffer = buffer->gpuBuffer();
                    } else if (buffer->gpuBufferView()) {
                        binding.gpuBufferView = buffer->gpuBufferView();
                    }
                }
            }
            else if ((uint)binding.type & DESCRIPTOR_SAMPLER_TYPE) {
                if (_textures[i]) {
                    binding.gpuTexture = ((GLES2Texture *)_textures[i])->gpuTexture();
                }
                if (_samplers[i]) {
                    binding.gpuSampler = ((GLES2Sampler *)_samplers[i])->gpuSampler();
                }
            }
        }
        _isDirty = false;
    }
}

} // namespace gfx
} // namespace cc
