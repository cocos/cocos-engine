#include "VKStd.h"

#include "VKBindingLayout.h"
#include "VKBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "VKSampler.h"
#include "VKTexture.h"

namespace cc {
namespace gfx {

CCVKBindingLayout::CCVKBindingLayout(Device *device)
: BindingLayout(device) {
}

CCVKBindingLayout::~CCVKBindingLayout() {
}

bool CCVKBindingLayout::initialize(const BindingLayoutInfo &info) {

    const UniformBlockList &blocks = info.shader->getBlocks();
    const UniformSamplerList &samplers = info.shader->getSamplers();
    const uint bindingCount = blocks.size() + samplers.size();

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
    _gpuBindingLayout->descriptorInfos.resize(1);
    _gpuBindingLayout->descriptorSets.resize(1);
    _gpuBindingLayout->gpuBindings[0].resize(bindingCount);
    _gpuBindingLayout->descriptorInfos[0].resize(bindingCount);

    for (size_t i = blocks.size(); i < bindingCount; ++i) {
        _gpuBindingLayout->descriptorInfos[0][i].image.imageLayout = VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL;
    }

    _status = Status::SUCCESS;

    return true;
}

void CCVKBindingLayout::destroy() {
    if (_gpuBindingLayout) {
        for (vector<CCVKGPUBinding> &bindings : _gpuBindingLayout->gpuBindings) {
            bindings.clear();
        }
        _gpuBindingLayout->gpuBindings.clear();

        for (vector<CCVKDescriptorInfo> &descriptors : _gpuBindingLayout->descriptorInfos) {
            descriptors.clear();
        }
        _gpuBindingLayout->descriptorInfos.clear();

        _gpuBindingLayout->descriptorSets.clear();
        CC_DELETE(_gpuBindingLayout);
        _gpuBindingLayout = nullptr;
    }

    _status = Status::UNREADY;
}

void CCVKBindingLayout::update() {
    if (_isDirty && _gpuBindingLayout) {
        for (size_t i = 0u; i < _bindingUnits.size(); ++i) {
            BindingUnit &bindingUnit = _bindingUnits[i];
            CCVKGPUBinding &binding = _gpuBindingLayout->gpuBindings[0][i];
            switch (bindingUnit.type) {
                case BindingType::UNIFORM_BUFFER: {
                    if (bindingUnit.buffer) {
                        binding.buffer = ((CCVKBuffer *)bindingUnit.buffer)->gpuBuffer();
                    }
                    break;
                }
                case BindingType::SAMPLER: {
                    if (bindingUnit.texture) {
                        binding.texView = ((CCVKTexture *)bindingUnit.texture)->gpuTextureView();
                    }
                    if (bindingUnit.sampler) {
                        binding.sampler = ((CCVKSampler *)bindingUnit.sampler)->gpuSampler();
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
