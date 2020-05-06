#include "VKStd.h"
#include "VKBindingLayout.h"
#include "VKCommands.h"
#include "VKBuffer.h"
#include "VKTextureView.h"
#include "VKSampler.h"

NS_CC_BEGIN

CCVKBindingLayout::CCVKBindingLayout(GFXDevice* device)
    : GFXBindingLayout(device)
{
}

CCVKBindingLayout::~CCVKBindingLayout()
{
}

bool CCVKBindingLayout::initialize(const GFXBindingLayoutInfo &info)
{
    if (info.bindings.size())
    {
        _bindingUnits.resize(info.bindings.size());
        for (size_t i = 0; i < _bindingUnits.size(); ++i)
        {
            GFXBindingUnit& bindingUnit = _bindingUnits[i];
            const GFXBinding& binding = info.bindings[i];
            bindingUnit.binding = binding.binding;
            bindingUnit.type = binding.type;
            bindingUnit.name = binding.name;
        }
    }

    _gpuBindingLayout = CC_NEW(CCVKGPUBindingLayout);
    _gpuBindingLayout->gpuBindings.resize(_bindingUnits.size());
    for (size_t i = 0; i < _gpuBindingLayout->gpuBindings.size(); ++i)
    {
        CCVKGPUBinding& gpuBinding = _gpuBindingLayout->gpuBindings[i];
        const GFXBindingUnit& bindingUnit = _bindingUnits[i];
        gpuBinding.binding = bindingUnit.binding;
        gpuBinding.type = bindingUnit.type;
        gpuBinding.name = bindingUnit.name;
    }

    CCVKCmdFuncCreateBindingLayout((CCVKDevice*)_device, _gpuBindingLayout);

    _status = GFXStatus::SUCCESS;

    return true;
}

void CCVKBindingLayout::destroy()
{
    if (_gpuBindingLayout)
    {
        CCVKCmdFuncDestroyBindingLayout((CCVKDevice*)_device, _gpuBindingLayout);
        CC_DELETE(_gpuBindingLayout);
        _gpuBindingLayout = nullptr;
    }

    _status = GFXStatus::UNREADY;
}

void CCVKBindingLayout::update()
{
    if (_isDirty && _gpuBindingLayout)
    {
        for (size_t i = 0; i < _bindingUnits.size(); ++i)
        {
            GFXBindingUnit& bindingUnit = _bindingUnits[i];
            switch (bindingUnit.type)
            {
            case GFXBindingType::UNIFORM_BUFFER:
            {
                if (bindingUnit.buffer)
                {
                    _gpuBindingLayout->gpuBindings[i].gpuBuffer = ((CCVKBuffer*)bindingUnit.buffer)->gpuBuffer();
                }
                break;
            }
            case GFXBindingType::SAMPLER:
            {
                if (bindingUnit.texView)
                {
                    _gpuBindingLayout->gpuBindings[i].gpuTexView = ((CCVKTextureView*)bindingUnit.texView)->gpuTexView();
                }
                if (bindingUnit.sampler)
                {
                    _gpuBindingLayout->gpuBindings[i].gpuSampler = ((CCVKSampler*)bindingUnit.sampler)->gpuSampler();
                }
                break;
            }
            default:;
            }
        }
        _isDirty = false;
    }
}

NS_CC_END
