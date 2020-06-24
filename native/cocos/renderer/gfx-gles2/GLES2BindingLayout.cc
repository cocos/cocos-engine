#include "GLES2Std.h"
#include "GLES2BindingLayout.h"
#include "GLES2Commands.h"
#include "GLES2Buffer.h"
#include "GLES2Sampler.h"
#include "GLES2Texture.h"

namespace cc {
namespace gfx {

GLES2BindingLayout::GLES2BindingLayout(Device *device)
: BindingLayout(device) {
}

GLES2BindingLayout::~GLES2BindingLayout() {
}

bool GLES2BindingLayout::initialize(const BindingLayoutInfo &info) {

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

    _gpuBindingLayout = CC_NEW(GLES2GPUBindingLayout);
    _gpuBindingLayout->gpuBindings.resize(_bindingUnits.size());
    for (size_t i = 0; i < _gpuBindingLayout->gpuBindings.size(); ++i) {
        GLES2GPUBinding &gpuBinding = _gpuBindingLayout->gpuBindings[i];
        const BindingUnit &bindingUnit = _bindingUnits[i];
        gpuBinding.binding = bindingUnit.binding;
        gpuBinding.type = bindingUnit.type;
        gpuBinding.name = bindingUnit.name;
    }

    _status = Status::SUCCESS;

    return true;
}

void GLES2BindingLayout::destroy() {
    if (_gpuBindingLayout) {
        CC_DELETE(_gpuBindingLayout);
        _gpuBindingLayout = nullptr;
    }
    _status = Status::UNREADY;
}

void GLES2BindingLayout::update() {
    if (_isDirty && _gpuBindingLayout) {
        for (size_t i = 0; i < _bindingUnits.size(); ++i) {
            BindingUnit &bindingUnit = _bindingUnits[i];
            switch (bindingUnit.type) {
                case BindingType::UNIFORM_BUFFER: {
                    if (bindingUnit.buffer) {
                        _gpuBindingLayout->gpuBindings[i].gpuBuffer = ((GLES2Buffer *)bindingUnit.buffer)->gpuBuffer();
                    }
                    break;
                }
                case BindingType::SAMPLER: {
                    if (bindingUnit.texture) {
                        _gpuBindingLayout->gpuBindings[i].gpuTexture = ((GLES2Texture *)bindingUnit.texture)->gpuTexture();
                    }
                    if (bindingUnit.sampler) {
                        _gpuBindingLayout->gpuBindings[i].gpuSampler = ((GLES2Sampler *)bindingUnit.sampler)->gpuSampler();
                    }
                    break;
                }
                default:;
            }
        }
        _isDirty = false;
    }
}

} // namespace gfx
} // namespace cc
