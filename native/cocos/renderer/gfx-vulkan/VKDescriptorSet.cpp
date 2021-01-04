/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommands.h"
#include "VKDescriptorSet.h"
#include "VKDescriptorSetLayout.h"
#include "VKPipelineLayout.h"
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

    CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout = ((CCVKDescriptorSetLayout *)_layout)->gpuDescriptorSetLayout();
    const uint bindingCount = gpuDescriptorSetLayout->bindings.size();
    const uint descriptorCount = gpuDescriptorSetLayout->descriptorCount;

    _buffers.resize(descriptorCount);
    _textures.resize(descriptorCount);
    _samplers.resize(descriptorCount);

    _gpuDescriptorSet = CC_NEW(CCVKGPUDescriptorSet);
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount, {});

    for (size_t i = 0u, k = 0u; i < bindingCount; ++i) {
        const DescriptorSetLayoutBinding &binding = gpuDescriptorSetLayout->bindings[i];
        for (uint j = 0; j < binding.count; ++j, ++k) {
            _gpuDescriptorSet->gpuDescriptors[k].type = binding.descriptorType;
        }
    }

    CCVKGPUDevice *gpuDevice = ((CCVKDevice *)_device)->gpuDevice();
    if (gpuDevice->useDescriptorUpdateTemplate) {
        _gpuDescriptorSet->pUpdateTemplate = &gpuDescriptorSetLayout->vkDescriptorUpdateTemplate;
    }
    _gpuDescriptorSet->instances.resize(gpuDevice->backBufferCount);

    for (size_t t = 0u; t < gpuDevice->backBufferCount; ++t) {
        CCVKGPUDescriptorSet::DescriptorSetInstance &instance = _gpuDescriptorSet->instances[t];
        instance.vkDescriptorSet = gpuDescriptorSetLayout->pool.request();
        instance.descriptorInfos.resize(descriptorCount, {});

        for (size_t i = 0u, k = 0u; i < bindingCount; ++i) {
            const DescriptorSetLayoutBinding &binding = gpuDescriptorSetLayout->bindings[i];
            for (uint j = 0; j < binding.count; ++j, ++k) {
                if ((uint)binding.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
                    instance.descriptorInfos[k].buffer.buffer = gpuDevice->defaultBuffer.vkBuffer;
                    instance.descriptorInfos[k].buffer.offset = gpuDevice->defaultBuffer.startOffset;
                    instance.descriptorInfos[k].buffer.range = gpuDevice->defaultBuffer.size;
                } else if ((uint)binding.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
                    instance.descriptorInfos[k].image.sampler = gpuDevice->defaultSampler.vkSampler;
                    instance.descriptorInfos[k].image.imageView = gpuDevice->defaultTextureView.vkImageView;
                    instance.descriptorInfos[k].image.imageLayout = VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL;
                }
            }
        }

        if (!gpuDevice->useDescriptorUpdateTemplate) {
            vector<VkWriteDescriptorSet> &entries = instance.descriptorUpdateEntries;
            entries.resize(descriptorCount, {VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET});

            for (size_t i = 0u, j = 0u; i < descriptorCount; i++) {
                const VkDescriptorSetLayoutBinding &descriptor = gpuDescriptorSetLayout->vkBindings[i];
                for (size_t k = 0u; k < descriptor.descriptorCount; k++, j++) {
                    entries[j].dstSet = instance.vkDescriptorSet;
                    entries[j].dstBinding = descriptor.binding;
                    entries[j].dstArrayElement = k;
                    entries[j].descriptorCount = 1; // better not to assume that the descriptor infos would be contiguous
                    entries[j].descriptorType = descriptor.descriptorType;
                    switch (entries[j].descriptorType) {
                        case VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER:
                        case VK_DESCRIPTOR_TYPE_STORAGE_BUFFER:
                        case VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER_DYNAMIC:
                        case VK_DESCRIPTOR_TYPE_STORAGE_BUFFER_DYNAMIC:
                            entries[j].pBufferInfo = &instance.descriptorInfos[j].buffer;
                            break;
                        case VK_DESCRIPTOR_TYPE_SAMPLER:
                        case VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER:
                        case VK_DESCRIPTOR_TYPE_SAMPLED_IMAGE:
                        case VK_DESCRIPTOR_TYPE_STORAGE_IMAGE:
                        case VK_DESCRIPTOR_TYPE_INPUT_ATTACHMENT:
                            entries[j].pImageInfo = &instance.descriptorInfos[j].image;
                            break;
                        case VK_DESCRIPTOR_TYPE_UNIFORM_TEXEL_BUFFER:
                        case VK_DESCRIPTOR_TYPE_STORAGE_TEXEL_BUFFER:
                            entries[j].pTexelBufferView = &instance.descriptorInfos[j].texelBufferView;
                            break;
                        default: break;
                    }
                }
            }
        }
    }

    return true;
}

void CCVKDescriptorSet::destroy() {
    if (_gpuDescriptorSet) {
        CCVKGPUDescriptorHub *descriptorHub = ((CCVKDevice *)_device)->gpuDescriptorHub();
        CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout = ((CCVKDescriptorSetLayout *)_layout)->gpuDescriptorSetLayout();

        for (size_t t = 0u; t < _gpuDescriptorSet->instances.size(); ++t) {
            CCVKGPUDescriptorSet::DescriptorSetInstance &instance = _gpuDescriptorSet->instances[t];

            for (uint i = 0u; i < _gpuDescriptorSet->gpuDescriptors.size(); i++) {
                CCVKGPUDescriptor &binding = _gpuDescriptorSet->gpuDescriptors[i];

                CCVKDescriptorInfo &descriptorInfo = instance.descriptorInfos[i];
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

            if (gpuDescriptorSetLayout && instance.vkDescriptorSet) {
                gpuDescriptorSetLayout->pool.yield(instance.vkDescriptorSet);
            }
        }

        ((CCVKDevice *)_device)->gpuDescriptorSetHub()->erase(_gpuDescriptorSet);

        CC_DELETE(_gpuDescriptorSet);
        _gpuDescriptorSet = nullptr;
    }

    // do remember to clear these or else it might not be properly updated when reused
    _buffers.clear();
    _textures.clear();
    _samplers.clear();
}

void CCVKDescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        CCVKGPUDescriptorHub *descriptorHub = ((CCVKDevice *)_device)->gpuDescriptorHub();
        uint descriptorCount = _gpuDescriptorSet->gpuDescriptors.size();

        for (size_t i = 0u; i < descriptorCount; i++) {
            CCVKGPUDescriptor &binding = _gpuDescriptorSet->gpuDescriptors[i];

            if ((uint)binding.type & DESCRIPTOR_BUFFER_TYPE) {
                if (_buffers[i]) {
                    CCVKGPUBufferView *bufferView = ((CCVKBuffer *)_buffers[i])->gpuBufferView();
                    if (binding.gpuBufferView != bufferView) {
                        for (size_t t = 0u; t < _gpuDescriptorSet->instances.size(); ++t) {
                            CCVKDescriptorInfo &descriptorInfo = _gpuDescriptorSet->instances[t].descriptorInfos[i];

                            if (binding.gpuBufferView) {
                                descriptorHub->disengage(binding.gpuBufferView, &descriptorInfo.buffer);
                            }
                            if (bufferView) {
                                descriptorHub->connect(bufferView, &descriptorInfo.buffer, t);
                                descriptorHub->update(bufferView, &descriptorInfo.buffer);
                            }
                        }
                        binding.gpuBufferView = bufferView;
                    }
                }
            } else if ((uint)binding.type & DESCRIPTOR_SAMPLER_TYPE) {
                if (_textures[i]) {
                    CCVKGPUTextureView *textureView = ((CCVKTexture *)_textures[i])->gpuTextureView();
                    if (binding.gpuTextureView != textureView) {
                        for (size_t t = 0u; t < _gpuDescriptorSet->instances.size(); ++t) {
                            CCVKDescriptorInfo &descriptorInfo = _gpuDescriptorSet->instances[t].descriptorInfos[i];
                            if (binding.gpuTextureView) {
                                descriptorHub->disengage(binding.gpuTextureView, &descriptorInfo.image);
                            }
                            if (textureView) {
                                descriptorHub->connect(textureView, &descriptorInfo.image);
                                descriptorHub->update(textureView, &descriptorInfo.image);
                            }
                        }
                        binding.gpuTextureView = textureView;
                    }
                }
                if (_samplers[i]) {
                    CCVKGPUSampler *sampler = ((CCVKSampler *)_samplers[i])->gpuSampler();
                    if (binding.gpuSampler != sampler) {
                        for (size_t t = 0u; t < _gpuDescriptorSet->instances.size(); ++t) {
                            CCVKDescriptorInfo &descriptorInfo = _gpuDescriptorSet->instances[t].descriptorInfos[i];
                            if (binding.gpuSampler) {
                                descriptorHub->disengage(binding.gpuSampler, &descriptorInfo.image);
                            }
                            if (sampler) {
                                descriptorHub->connect(sampler, &descriptorInfo.image);
                                descriptorHub->update(sampler, &descriptorInfo.image);
                            }
                        }
                        binding.gpuSampler = sampler;
                    }
                }
            }
        }
        ((CCVKDevice *)_device)->gpuDescriptorSetHub()->record(_gpuDescriptorSet);
        _isDirty = false;
    }
}

} // namespace gfx
} // namespace cc
