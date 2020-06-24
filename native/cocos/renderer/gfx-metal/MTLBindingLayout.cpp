#include "MTLStd.h"
#include "MTLBindingLayout.h"

namespace cc {
namespace gfx {

CCMTLBindingLayout::CCMTLBindingLayout(Device *device) : BindingLayout(device) {}
CCMTLBindingLayout::~CCMTLBindingLayout() { destroy(); }

bool CCMTLBindingLayout::initialize(const BindingLayoutInfo &info) {
    if (info.bindings.size()) {
        _bindingUnits.resize(info.bindings.size());
        for (size_t i = 0; i < _bindingUnits.size(); ++i) {
            BindingUnit &bindingUnit = _bindingUnits[i];
            const Binding &binding = info.bindings[i];
            bindingUnit.shaderStages = binding.shaderStages;
            bindingUnit.binding = binding.binding;
            bindingUnit.type = binding.type;
            bindingUnit.name = binding.name;
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
