#include "MTLStd.h"
#include "MTLBindingLayout.h"

NS_CC_BEGIN

CCMTLBindingLayout::CCMTLBindingLayout(GFXDevice* device) : GFXBindingLayout(device) {}
CCMTLBindingLayout::~CCMTLBindingLayout() { destroy(); }

bool CCMTLBindingLayout::initialize(const GFXBindingLayoutInfo& info)
{
    if (info.bindings.size())
    {
        _bindingUnits.resize(info.bindings.size());
        for (size_t i = 0; i < _bindingUnits.size(); ++i)
        {
            GFXBindingUnit& binding_unit = _bindingUnits[i];
            const GFXBinding& binding = info.bindings[i];
            binding_unit.binding = binding.binding;
            binding_unit.type = binding.type;
            binding_unit.name = binding.name;
        }
    }
    
    return true;
}

void CCMTLBindingLayout::destroy()
{
    
}

void CCMTLBindingLayout::update()
{
    
}

NS_CC_END
