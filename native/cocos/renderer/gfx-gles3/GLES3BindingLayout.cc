#include "GLES3Std.h"
#include "GLES3BindingLayout.h"
#include "GLES3Commands.h"
#include "GLES3Buffer.h"
#include "GLES3TextureView.h"
#include "GLES3Sampler.h"

NS_CC_BEGIN

GLES3BindingLayout::GLES3BindingLayout(GFXDevice* device)
    : GFXBindingLayout(device),
      gpu_binding_layout_(nullptr) {
}

GLES3BindingLayout::~GLES3BindingLayout() {
}

bool GLES3BindingLayout::Initialize(const GFXBindingLayoutInfo &info) {
  
  if (info.bindings.size()) {
    binding_units_.resize(info.bindings.size());
    for (size_t i = 0; i < binding_units_.size(); ++i) {
      GFXBindingUnit& binding_unit = binding_units_[i];
      const GFXBinding& binding = info.bindings[i];
      binding_unit.binding = binding.binding;
      binding_unit.type = binding.type;
      binding_unit.name = binding.name;
    }
  }
  
  gpu_binding_layout_ = CC_NEW(GLES3GPUBindingLayout);
  gpu_binding_layout_->gpu_bindings.resize(binding_units_.size());
  for (size_t i = 0; i < gpu_binding_layout_->gpu_bindings.size(); ++i) {
    GLES3GPUBinding& gpu_binding = gpu_binding_layout_->gpu_bindings[i];
    const GFXBindingUnit& binding_unit = binding_units_[i];
    gpu_binding.binding = binding_unit.binding;
    gpu_binding.type = binding_unit.type;
    gpu_binding.name = binding_unit.name;
  }
  
  return true;
}

void GLES3BindingLayout::destroy() {
  if (gpu_binding_layout_) {
    CC_DELETE(gpu_binding_layout_);
    gpu_binding_layout_ = nullptr;
  }
}

void GLES3BindingLayout::Update() {
  if (is_dirty_ && gpu_binding_layout_) {
    for (size_t i = 0; i < binding_units_.size(); ++i) {
      GFXBindingUnit& binding_unit = binding_units_[i];
      switch (binding_unit.type) {
        case GFXBindingType::UNIFORM_BUFFER: {
          if (binding_unit.buffer) {
            gpu_binding_layout_->gpu_bindings[i].gpu_buffer = ((GLES3Buffer*)binding_unit.buffer)->gpu_buffer();
          }
          break;
        }
        case GFXBindingType::SAMPLER: {
          if (binding_unit.tex_view) {
            gpu_binding_layout_->gpu_bindings[i].gpu_tex_view = ((GLES3TextureView*)binding_unit.tex_view)->gpu_tex_view();
          }
          if (binding_unit.sampler) {
            gpu_binding_layout_->gpu_bindings[i].gpu_sampler = ((GLES3Sampler*)binding_unit.sampler)->gpu_sampler();
          }
          break;
        }
        default:;
      }
    }
    is_dirty_ = false;
  }
}

NS_CC_END
