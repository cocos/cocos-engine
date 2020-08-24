#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommands.h"
#include "VKDescriptorSet.h"
#include "VKDescriptorSetLayout.h"
#include "VKDevice.h"
#include "VKSampler.h"
#include "VKShader.h"
#include "VKTexture.h"

namespace cc {
namespace gfx {

CCVKDescriptorSet::CCVKDescriptorSet(Device *device)
: DescriptorSet(device) {
}

CCVKDescriptorSet::~CCVKDescriptorSet() {
}

bool CCVKDescriptorSet::initialize(const DescriptorSetInfo &info) {

    _layout = info.layout;

    const CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout = ((CCVKDescriptorSetLayout *)_layout)->gpuDescriptorSetLayout();
    const uint bindingCount = gpuDescriptorSetLayout->bindings.size();
    const uint descriptorCount = gpuDescriptorSetLayout->descriptorCount;

    _buffers.resize(bindingCount);
    _textures.resize(bindingCount);
    _samplers.resize(bindingCount);

    CCVKGPUDevice *gpuDevice = ((CCVKDevice *)_device)->gpuDevice();
    _gpuDescriptorSet = CC_NEW(CCVKGPUDescriptorSet);
    _gpuDescriptorSet->gpuDescriptors.resize(bindingCount);
    _gpuDescriptorSet->descriptorInfos.resize(bindingCount);
    for (size_t i = 0u; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = gpuDescriptorSetLayout->bindings[i];
        _gpuDescriptorSet->gpuDescriptors[i].type = binding.descriptorType;
        if ((uint)binding.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
            _gpuDescriptorSet->descriptorInfos[i].buffer.buffer = gpuDevice->defaultBuffer.vkBuffer;
            _gpuDescriptorSet->descriptorInfos[i].buffer.offset = gpuDevice->defaultBuffer.startOffset;
            _gpuDescriptorSet->descriptorInfos[i].buffer.range = gpuDevice->defaultBuffer.size;
        } else if ((uint)binding.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
            _gpuDescriptorSet->descriptorInfos[i].image.sampler = gpuDevice->defaultSampler.vkSampler;
            _gpuDescriptorSet->descriptorInfos[i].image.imageView = gpuDevice->defaultTextureView.vkImageView;
            _gpuDescriptorSet->descriptorInfos[i].image.imageLayout = VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL;
        }
    }

    if (!gpuDevice->useDescriptorUpdateTemplate) {
        vector<VkWriteDescriptorSet> &entries = _gpuDescriptorSet->descriptorUpdateEntries;
        entries.resize(descriptorCount, {VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET});

        for (size_t i = 0u, j = 0u; i < bindingCount; i++) {
            const VkDescriptorSetLayoutBinding &descriptor = gpuDescriptorSetLayout->vkBindings[i];
            for (size_t k = 0u; k < descriptor.descriptorCount; k++, j++) {
                entries[j].dstBinding = descriptor.binding;
                entries[j].dstArrayElement = k;
                entries[j].descriptorCount = 1;
                entries[j].descriptorType = descriptor.descriptorType;
                switch (entries[j].descriptorType) {
                    case VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER:
                    case VK_DESCRIPTOR_TYPE_STORAGE_BUFFER:
                    case VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER_DYNAMIC:
                    case VK_DESCRIPTOR_TYPE_STORAGE_BUFFER_DYNAMIC:
                        entries[j].pBufferInfo = &_gpuDescriptorSet->descriptorInfos[j].buffer;
                        break;
                    case VK_DESCRIPTOR_TYPE_SAMPLER:
                    case VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER:
                    case VK_DESCRIPTOR_TYPE_SAMPLED_IMAGE:
                    case VK_DESCRIPTOR_TYPE_STORAGE_IMAGE:
                    case VK_DESCRIPTOR_TYPE_INPUT_ATTACHMENT:
                        entries[j].pImageInfo = &_gpuDescriptorSet->descriptorInfos[j].image;
                        break;
                    case VK_DESCRIPTOR_TYPE_UNIFORM_TEXEL_BUFFER:
                    case VK_DESCRIPTOR_TYPE_STORAGE_TEXEL_BUFFER:
                        entries[j].pTexelBufferView = &_gpuDescriptorSet->descriptorInfos[j].texelBufferView;
                        break;
                    default: break;
                }
            }
        }
    }

    _status = Status::SUCCESS;

    return true;
}

void CCVKDescriptorSet::destroy() {
    if (_gpuDescriptorSet) {
        CCVKGPUDescriptorHub *descriptorHub = ((CCVKDevice *)_device)->gpuDescriptorHub();
        const vector<uint> &indicies = ((CCVKDescriptorSetLayout *)_layout)->gpuDescriptorSetLayout()->descriptorIndices;

        for (uint i = 0u; i < _gpuDescriptorSet->gpuDescriptors.size(); i++) {
            CCVKGPUDescriptor &binding = _gpuDescriptorSet->gpuDescriptors[i];
            const uint descriptorIndex = indicies[i];
            CCVKDescriptorInfo &descriptorInfo = _gpuDescriptorSet->descriptorInfos[descriptorIndex];
            if (binding.gpuBufferView) {
                descriptorHub->disengage(binding.gpuBufferView, &descriptorInfo.buffer);
            }
            if (binding.gpuTextureView) {
                descriptorHub->disengage(binding.gpuTextureView, &descriptorInfo.image);
            }
            if (binding.gpuSampler) {
                descriptorHub->disengage(binding.gpuSampler, &descriptorInfo.image);
            }
        }
        CC_DELETE(_gpuDescriptorSet);
        _gpuDescriptorSet = nullptr;
    }

    _status = Status::UNREADY;
}

void CCVKDescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        CCVKGPUDescriptorHub *descriptorHub = ((CCVKDevice *)_device)->gpuDescriptorHub();
        const vector<uint> &indicies = ((CCVKDescriptorSetLayout *)_layout)->gpuDescriptorSetLayout()->descriptorIndices;
        uint bindingCount = _gpuDescriptorSet->gpuDescriptors.size();

        for (size_t i = 0u; i < bindingCount; i++) {
            CCVKDescriptorInfo &descriptorInfo = _gpuDescriptorSet->descriptorInfos[indicies[i]];
            CCVKGPUDescriptor &binding = _gpuDescriptorSet->gpuDescriptors[i];

            if ((uint)binding.type & DESCRIPTOR_BUFFER_TYPE) {
                if (_buffers[i]) {
                    CCVKGPUBufferView *bufferView = ((CCVKBuffer *)_buffers[i])->gpuBufferView();
                    if (binding.gpuBufferView != bufferView) {
                        if (binding.gpuBufferView) {
                            descriptorHub->disengage(binding.gpuBufferView, &descriptorInfo.buffer);
                        }
                        if (bufferView) {
                            descriptorHub->connect(bufferView, &descriptorInfo.buffer);
                            descriptorHub->update(bufferView, &descriptorInfo.buffer);
                        }
                        binding.gpuBufferView = bufferView;
                    }
                }
            } else if ((uint)binding.type & DESCRIPTOR_SAMPLER_TYPE) {
                // TODO: handle texture arrays (need public interface changes)
                if (_textures[i]) {
                    CCVKGPUTextureView *textureView = ((CCVKTexture *)_textures[i])->gpuTextureView();
                    if (binding.gpuTextureView != textureView) {
                        if (binding.gpuTextureView) {
                            descriptorHub->disengage(binding.gpuTextureView, &descriptorInfo.image);
                        }
                        if (textureView) {
                            descriptorHub->connect(textureView, &descriptorInfo.image);
                            descriptorHub->update(textureView, &descriptorInfo.image);
                        }
                        binding.gpuTextureView = textureView;
                    }
                }
                if (_samplers[i]) {
                    CCVKGPUSampler *sampler = ((CCVKSampler *)_samplers[i])->gpuSampler();
                    if (binding.gpuSampler != sampler) {
                        if (binding.gpuSampler) {
                            descriptorHub->disengage(binding.gpuSampler, &descriptorInfo.image);
                        }
                        if (sampler) {
                            descriptorHub->connect(sampler, &descriptorInfo.image);
                            descriptorHub->update(sampler, &descriptorInfo.image);
                        }
                        binding.gpuSampler = sampler;
                    }
                }
            }
        }
        _isDirty = false;
    }
}

} // namespace gfx
} // namespace cc
