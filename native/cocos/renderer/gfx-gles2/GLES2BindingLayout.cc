#include "GLES2Std.h"
#include "GLES2BindingLayout.h"
#include "GLES2Commands.h"
#include "GLES2Buffer.h"
#include "GLES2TextureView.h"
#include "GLES2Sampler.h"

NS_CC_BEGIN

GLES2BindingLayout::GLES2BindingLayout(GFXDevice* device)
    : GFXBindingLayout(device){
}

GLES2BindingLayout::~GLES2BindingLayout() {
}

bool GLES2BindingLayout::initialize(const GFXBindingLayoutInfo &info) {
  
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
  
  _gpuBindingLayout = CC_NEW(GLES2GPUBindingLayout);
  _gpuBindingLayout->gpuBindings.resize(_bindingUnits.size());
  for (size_t i = 0; i < _gpuBindingLayout->gpuBindings.size(); ++i) {
    GLES2GPUBinding& gpuBinding = _gpuBindingLayout->gpuBindings[i];
    const GFXBindingUnit& bindingUnit = _bindingUnits[i];
    gpuBinding.binding = bindingUnit.binding;
    gpuBinding.type = bindingUnit.type;
    gpuBinding.name = bindingUnit.name;
  }
    
    _status = GFXStatus::SUCCESS;
  
  return true;
}

void GLES2BindingLayout::destroy() {
  if (_gpuBindingLayout) {
    CC_DELETE(_gpuBindingLayout);
    _gpuBindingLayout = nullptr;
  }
    _status = GFXStatus::UNREADY;
}

void GLES2BindingLayout::update() {
  if (_isDirty && _gpuBindingLayout) {
    for (size_t i = 0; i < _bindingUnits.size(); ++i) {
      GFXBindingUnit& bindingUnit = _bindingUnits[i];
      switch (bindingUnit.type) {
        case GFXBindingType::UNIFORM_BUFFER: {
          if (bindingUnit.buffer) {
            _gpuBindingLayout->gpuBindings[i].gpuBuffer = ((GLES2Buffer*)bindingUnit.buffer)->gpuBuffer();
          }
          break;
        }
        case GFXBindingType::SAMPLER: {
          if (bindingUnit.texView) {
            _gpuBindingLayout->gpuBindings[i].gpuTexView = ((GLES2TextureView*)bindingUnit.texView)->gpuTexView();
          }
          if (bindingUnit.sampler) {
            _gpuBindingLayout->gpuBindings[i].gpuSampler = ((GLES2Sampler*)bindingUnit.sampler)->gpuSampler();
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
