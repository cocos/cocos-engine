#include "GLES3Std.h"
#include "GLES3BindingLayout.h"
#include "GLES3Commands.h"
#include "GLES3Buffer.h"
#include "GLES3TextureView.h"
#include "GLES3Sampler.h"

NS_CC_BEGIN

GLES3BindingLayout::GLES3BindingLayout(GFXDevice* device)
    : GFXBindingLayout(device) {
}

GLES3BindingLayout::~GLES3BindingLayout() {
}

bool GLES3BindingLayout::initialize(const GFXBindingLayoutInfo &info) {
  
  if (info.bindings.size()) {
    _bindingUnits.resize(info.bindings.size());
    for (size_t i = 0; i < _bindingUnits.size(); ++i) {
      GFXBindingUnit& bindingUnit = _bindingUnits[i];
      const GFXBinding& binding = info.bindings[i];
      bindingUnit.shaderStages = binding.shaderStages;
      bindingUnit.binding = binding.binding;
      bindingUnit.type = binding.type;
      bindingUnit.name = binding.name;
    }
  }
  
  _gpuBindingLayout = CC_NEW(GLES3GPUBindingLayout);
  _gpuBindingLayout->gpuBindings.resize(_bindingUnits.size());
  for (size_t i = 0; i < _gpuBindingLayout->gpuBindings.size(); ++i) {
    GLES3GPUBinding& gpuBinding = _gpuBindingLayout->gpuBindings[i];
    const GFXBindingUnit& bindingUnit = _bindingUnits[i];
    gpuBinding.binding = bindingUnit.binding;
    gpuBinding.type = bindingUnit.type;
    gpuBinding.name = bindingUnit.name;
  }
    
    _status = GFXStatus::SUCCESS;
  
  return true;
}

void GLES3BindingLayout::destroy() {
  if (_gpuBindingLayout) {
    CC_DELETE(_gpuBindingLayout);
    _gpuBindingLayout = nullptr;
  }
    
    _status = GFXStatus::UNREADY;
}

void GLES3BindingLayout::update() {
  if (_isDirty && _gpuBindingLayout) {
    for (size_t i = 0; i < _bindingUnits.size(); ++i) {
      GFXBindingUnit& bindingUnit = _bindingUnits[i];
      switch (bindingUnit.type) {
        case GFXBindingType::UNIFORM_BUFFER: {
          if (bindingUnit.buffer) {
            _gpuBindingLayout->gpuBindings[i].gpuBuffer = ((GLES3Buffer*)bindingUnit.buffer)->gpuBuffer();
          }
          break;
        }
        case GFXBindingType::SAMPLER: {
          if (bindingUnit.texView) {
            _gpuBindingLayout->gpuBindings[i].gpuTexView = ((GLES3TextureView*)bindingUnit.texView)->gpuTexView();
          }
          if (bindingUnit.sampler) {
            _gpuBindingLayout->gpuBindings[i].gpuSampler = ((GLES3Sampler*)bindingUnit.sampler)->gpuSampler();
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
