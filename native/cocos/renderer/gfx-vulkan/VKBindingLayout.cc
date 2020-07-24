#include "VKStd.h"

#include "VKBindingLayout.h"
#include "VKBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "VKSampler.h"
#include "VKShader.h"
#include "VKTexture.h"

namespace cc {
namespace gfx {

CCVKBindingLayout::CCVKBindingLayout(Device *device)
: BindingLayout(device) {
}

CCVKBindingLayout::~CCVKBindingLayout() {
}

bool CCVKBindingLayout::initialize(const BindingLayoutInfo &info) {

    const CCVKGPUShader *gpuShader = ((CCVKShader *)info.shader)->gpuShader();
    const UniformBlockList &blocks = gpuShader->blocks;
    const UniformSamplerList &samplers = gpuShader->samplers;
    const uint bindingCount = blocks.size() + samplers.size();
    const uint descriptorCount = gpuShader->pipelineLayout->descriptorCounts[0];

    if (bindingCount) {
        _bindingUnits.resize(bindingCount);
        for (size_t i = 0u; i < blocks.size(); ++i) {
            const UniformBlock &binding = blocks[i];
            BindingUnit &bindingUnit = _bindingUnits[i];
            bindingUnit.shaderStages = binding.shaderStages;
            bindingUnit.type = BindingType::UNIFORM_BUFFER;
            bindingUnit.binding = binding.binding;
            bindingUnit.name = binding.name;
            bindingUnit.count = 1;
        }
        for (size_t i = 0u; i < samplers.size(); ++i) {
            const UniformSampler &binding = samplers[i];
            BindingUnit &bindingUnit = _bindingUnits[blocks.size() + i];
            bindingUnit.shaderStages = binding.shaderStages;
            bindingUnit.type = BindingType::SAMPLER;
            bindingUnit.binding = binding.binding;
            bindingUnit.name = binding.name;
            bindingUnit.count = binding.count;
        }
    }

    _gpuBindingLayout = CC_NEW(CCVKGPUBindingLayout);
    _gpuBindingLayout->gpuBindings.resize(1);
    _gpuBindingLayout->descriptorSets.resize(1);
    _gpuBindingLayout->gpuBindings[0].resize(bindingCount);
    _gpuBindingLayout->descriptorInfos.resize(descriptorCount);
    _gpuBindingLayout->descriptorIndices = &gpuShader->pipelineLayout->descriptorIndices;

    for (size_t i = blocks.size(); i < descriptorCount; ++i) {
        _gpuBindingLayout->descriptorInfos[i].image.imageLayout = VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL;
    }

    if (!((CCVKDevice *)_device)->gpuDevice()->useDescriptorUpdateTemplate) {
        vector<VkWriteDescriptorSet> &entries = _gpuBindingLayout->descriptorUpdateEntries;
        entries.resize(descriptorCount, {VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET});

        for (size_t i = 0u, j = 0u; i < bindingCount; i++) {
            BindingUnit &bindingUnit = _bindingUnits[i];
            // better not to assume that our descriptor layout will be contiguous
            for (size_t k = 0u; k < bindingUnit.count; k++, j++) {
                entries[j].dstBinding = bindingUnit.binding;
                entries[j].dstArrayElement = k;
                entries[j].descriptorCount = 1;
                entries[j].descriptorType = MapVkDescriptorType(bindingUnit.type);
                switch (entries[j].descriptorType) {
                    case VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER:
                    case VK_DESCRIPTOR_TYPE_STORAGE_BUFFER:
                    case VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER_DYNAMIC:
                    case VK_DESCRIPTOR_TYPE_STORAGE_BUFFER_DYNAMIC:
                        entries[j].pBufferInfo = &_gpuBindingLayout->descriptorInfos[j].buffer;
                        break;
                    case VK_DESCRIPTOR_TYPE_SAMPLER:
                    case VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER:
                    case VK_DESCRIPTOR_TYPE_SAMPLED_IMAGE:
                    case VK_DESCRIPTOR_TYPE_STORAGE_IMAGE:
                    case VK_DESCRIPTOR_TYPE_INPUT_ATTACHMENT:
                        entries[j].pImageInfo = &_gpuBindingLayout->descriptorInfos[j].image;
                        break;
                    case VK_DESCRIPTOR_TYPE_UNIFORM_TEXEL_BUFFER:
                    case VK_DESCRIPTOR_TYPE_STORAGE_TEXEL_BUFFER:
                        entries[j].pTexelBufferView = &_gpuBindingLayout->descriptorInfos[j].texelBufferView;
                        break;
                }
            }
        }
    }

    _status = Status::SUCCESS;

    return true;
}

void CCVKBindingLayout::destroy() {
    if (_gpuBindingLayout) {
        for (vector<CCVKGPUBinding> &bindings : _gpuBindingLayout->gpuBindings) {
            for (uint i = 0u; i < bindings.size(); i++) {
                CCVKGPUBinding &binding = bindings[i];
                const uint descriptorIndex = _gpuBindingLayout->descriptorIndices->at(0)[i];
                CCVKGPUDescriptorInfo &descriptorInfo = _gpuBindingLayout->descriptorInfos[descriptorIndex];
                CCVKGPUDescriptorHub *descriptorHub = ((CCVKDevice *)_device)->gpuDescriptorHub();
                if (binding.buffer) {
                    descriptorHub->disengage(binding.buffer, &descriptorInfo.buffer);
                }
                if (binding.texView) {
                    descriptorHub->disengage(binding.texView, &descriptorInfo.image);
                }
                if (binding.sampler) {
                    descriptorHub->disengage(binding.sampler, &descriptorInfo.image);
                }
            }
            bindings.clear();
        }
        _gpuBindingLayout->gpuBindings.clear();
        _gpuBindingLayout->descriptorInfos.clear();
        _gpuBindingLayout->descriptorSets.clear();
        _gpuBindingLayout->descriptorIndices = nullptr;
        CC_DELETE(_gpuBindingLayout);
        _gpuBindingLayout = nullptr;
    }

    _status = Status::UNREADY;
}

void CCVKBindingLayout::update() {
    if (_isDirty && _gpuBindingLayout) {
        CCVKGPUDescriptorHub *descriptorHub = ((CCVKDevice *)_device)->gpuDescriptorHub();
        for (size_t i = 0u; i < _bindingUnits.size(); ++i) {
            BindingUnit &bindingUnit = _bindingUnits[i];
            CCVKGPUBinding &binding = _gpuBindingLayout->gpuBindings[0][i];
            const uint descriptorIndex = _gpuBindingLayout->descriptorIndices->at(0)[i];
            CCVKGPUDescriptorInfo &descriptorInfo = _gpuBindingLayout->descriptorInfos[descriptorIndex];
            switch (bindingUnit.type) {
                case BindingType::UNIFORM_BUFFER: {
                    if (bindingUnit.buffer) {
                        CCVKGPUBuffer *buffer = ((CCVKBuffer *)bindingUnit.buffer)->gpuBuffer();
                        if (binding.buffer != buffer) {
                            if (binding.buffer) {
                                descriptorHub->disengage(binding.buffer, &descriptorInfo.buffer);
                            }
                            if (buffer) {
                                descriptorHub->connect(buffer, &descriptorInfo.buffer);
                                descriptorHub->update(buffer, &descriptorInfo.buffer);
                            }
                            binding.buffer = buffer;
                        }
                    }
                    break;
                }
                case BindingType::SAMPLER: {
                    // TODO: handle texture arrays(need public interface changes)
                    if (bindingUnit.texture) {
                        CCVKGPUTextureView *texView = ((CCVKTexture *)bindingUnit.texture)->gpuTextureView();
                        if (binding.texView != texView) {
                            if (binding.texView) {
                                descriptorHub->disengage(binding.texView, &descriptorInfo.image);
                            }
                            if (texView) {
                                descriptorHub->connect(texView, &descriptorInfo.image);
                                descriptorHub->update(texView, &descriptorInfo.image);
                            }
                            binding.texView = texView;
                        }
                    }
                    if (bindingUnit.sampler) {
                        CCVKGPUSampler *sampler = ((CCVKSampler *)bindingUnit.sampler)->gpuSampler();
                        if (binding.sampler != sampler) {
                            if (binding.sampler) {
                                descriptorHub->disengage(binding.sampler, &descriptorInfo.image);
                            }
                            if (sampler) {
                                descriptorHub->connect(sampler, &descriptorInfo.image);
                                descriptorHub->update(sampler, &descriptorInfo.image);
                            }
                            binding.sampler = sampler;
                        }
                    }
                    break;
                }
            }
        }

        _isDirty = false;
    }
}

} // namespace gfx
} // namespace cc
