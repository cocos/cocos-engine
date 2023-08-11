#include "GLESDescriptorSet.h"
#include "GLESDescriptorSetLayout.h"
#include "GLESBuffer.h"
#include "GLESTexture.h"
#include "GLESSampler.h"
#include "GLESDevice.h"

namespace cc::gfx {

GLESDescriptorSet::GLESDescriptorSet() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESDescriptorSet::~GLESDescriptorSet() {
    destroy();
}

void GLESDescriptorSet::update() {
    if (!_isDirty || !_gpuDescriptorSet) {
        return;
    }

    auto *device = Device::getInstance();
    auto &descriptors = _gpuDescriptorSet->gpuDescriptors;
    for (size_t i = 0; i < descriptors.size(); i++) {
        if (hasAnyFlags(descriptors[i].type, DESCRIPTOR_BUFFER_TYPE)) {
            if (_buffers[i].ptr) {
                descriptors[i].gpuBufferView = static_cast<GLESBuffer *>(_buffers[i].ptr)->gpuBufferView();
            }
        } else if (hasAnyFlags(descriptors[i].type, DESCRIPTOR_TEXTURE_TYPE)) {
            descriptors[i].gpuSampler = _samplers[i].ptr ? static_cast<GLESSampler *>(_samplers[i].ptr)->gpuSampler()
                                                         : static_cast<GLESSampler *>(device->getSampler({}))->gpuSampler();
            if (_textures[i].ptr) {
                _gpuDescriptorSet->gpuDescriptors[i].gpuTextureView = static_cast<GLESTexture *>(_textures[i].ptr)->gpuTextureView();

                // work around for sample depth stencil texture, delete when rdg support set sampler.
                const FormatInfo &info = GFX_FORMAT_INFOS[toNumber(
                    _textures[i].ptr->getFormat())];
                if (info.hasDepth || info.hasStencil) {
                    gfx::SamplerInfo samplerInfo = {};
                    samplerInfo.minFilter = gfx::Filter::POINT;
                    samplerInfo.magFilter = gfx::Filter::POINT;
                    descriptors[i].gpuSampler = static_cast<GLESSampler *>(device->getSampler(samplerInfo))->gpuSampler();
                }
            }
        }
    }
    _isDirty = false;
}

void GLESDescriptorSet::forceUpdate() {
    update();
}

void GLESDescriptorSet::doInit(const DescriptorSetInfo & /*info*/) {
    const GLESGPUDescriptorSetLayout *gpuDescriptorSetLayout = static_cast<const GLESDescriptorSetLayout *>(_layout)->gpuDescriptorSetLayout();
    const size_t descriptorCount = gpuDescriptorSetLayout->descriptorCount;
    const size_t bindingCount = gpuDescriptorSetLayout->bindings.size();

    _gpuDescriptorSet = ccnew GLESGPUDescriptorSet;
    _gpuDescriptorSet->layout = gpuDescriptorSetLayout;
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (size_t i = 0U, k = 0U; i < bindingCount; i++) {
        const auto &binding = gpuDescriptorSetLayout->bindings[i];
        for (uint32_t j = 0; j < binding.count; j++, k++) {
            _gpuDescriptorSet->gpuDescriptors[k].type = binding.type;
        }
    }
}

void GLESDescriptorSet::doDestroy() {
    _gpuDescriptorSet = nullptr;
}
} // namespace cc::gfx
