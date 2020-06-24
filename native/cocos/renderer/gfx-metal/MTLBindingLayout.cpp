#include "MTLStd.h"
#include "MTLBindingLayout.h"

namespace cc {
namespace gfx {

CCMTLBindingLayout::CCMTLBindingLayout(Device *device) : BindingLayout(device) {}
CCMTLBindingLayout::~CCMTLBindingLayout() { destroy(); }

bool CCMTLBindingLayout::initialize(const BindingLayoutInfo &info) {

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

    _status = Status::SUCCESS;
    return true;
}

void CCMTLBindingLayout::destroy() {
    _status = Status::UNREADY;
}

void CCMTLBindingLayout::update() {
}

} // namespace gfx
} // namespace cc
