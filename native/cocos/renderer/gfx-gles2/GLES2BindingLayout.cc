#include "GLES2Std.h"
#include "GLES2BindingLayout.h"
#include "GLES2Commands.h"
#include "GLES2Buffer.h"
#include "GLES2TextureView.h"
#include "GLES2Sampler.h"

NS_CC_BEGIN

GLES2BindingLayout::GLES2BindingLayout(GFXDevice* device)
    : GFXBindingLayout(device),
      gpu_binding_layout_(nullptr) {
}

GLES2BindingLayout::~GLES2BindingLayout() {
}

bool GLES2BindingLayout::initialize(const GFXBindingLayoutInfo &info) {
  
  if (info.bindings.size()) {
    _bindingUnits.resize(info.bindings.size());
    for (size_t i = 0; i < _bindingUnits.size(); ++i) {
      GFXBindingUnit& binding_unit = _bindingUnits[i];
      const GFXBinding& binding = info.bindings[i];
      binding_unit.binding = binding.binding;
      binding_unit.type = binding.type;
      binding_unit.name = binding.name;
    }
  }
  
  gpu_binding_layout_ = CC_NEW(GLES2GPUBindingLayout);
  gpu_binding_layout_->gpu_bindings.resize(_bindingUnits.size());
  for (size_t i = 0; i < gpu_binding_layout_->gpu_bindings.size(); ++i) {
    GLES2GPUBinding& gpu_binding = gpu_binding_layout_->gpu_bindings[i];
    const GFXBindingUnit& binding_unit = _bindingUnits[i];
    gpu_binding.binding = binding_unit.binding;
    gpu_binding.type = binding_unit.type;
    gpu_binding.name = binding_unit.name;
  }
  
  return true;
}

void GLES2BindingLayout::destroy() {
  if (gpu_binding_layout_) {
    CC_DELETE(gpu_binding_layout_);
    gpu_binding_layout_ = nullptr;
  }
}

void GLES2BindingLayout::update() {
  if (_isDirty && gpu_binding_layout_) {
    for (size_t i = 0; i < _bindingUnits.size(); ++i) {
      GFXBindingUnit& binding_unit = _bindingUnits[i];
      switch (binding_unit.type) {
        case GFXBindingType::UNIFORM_BUFFER: {
          if (binding_unit.buffer) {
            gpu_binding_layout_->gpu_bindings[i].gpu_buffer = ((GLES2Buffer*)binding_unit.buffer)->gpu_buffer();
          }
          break;
        }
        case GFXBindingType::SAMPLER: {
          if (binding_unit.tex_view) {
            gpu_binding_layout_->gpu_bindings[i].gpu_tex_view = ((GLES2TextureView*)binding_unit.tex_view)->gpu_tex_view();
          }
          if (binding_unit.sampler) {
            gpu_binding_layout_->gpu_bindings[i].gpu_sampler = ((GLES2Sampler*)binding_unit.sampler)->gpu_sampler();
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
