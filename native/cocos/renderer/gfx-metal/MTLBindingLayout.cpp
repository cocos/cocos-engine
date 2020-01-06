#include "MTLStd.h"
#include "MTLBindingLayout.h"

NS_CC_BEGIN

CCMTLBindingLayout::CCMTLBindingLayout(GFXDevice* device) : GFXBindingLayout(device) {}
CCMTLBindingLayout::~CCMTLBindingLayout() { Destroy(); }

bool CCMTLBindingLayout::Initialize(const GFXBindingLayoutInfo& info)
{
    if (info.bindings.size())
    {
        binding_units_.resize(info.bindings.size());
        for (size_t i = 0; i < binding_units_.size(); ++i)
        {
            GFXBindingUnit& binding_unit = binding_units_[i];
            const GFXBinding& binding = info.bindings[i];
            binding_unit.binding = binding.binding;
            binding_unit.type = binding.type;
            binding_unit.name = binding.name;
        }
    }
    
    return true;
}

void CCMTLBindingLayout::Destroy()
{
    
}

void CCMTLBindingLayout::Update()
{
    
}

NS_CC_END
