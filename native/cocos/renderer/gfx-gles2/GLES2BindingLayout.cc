#include "GLES2Std.h"
#include "GLES2BindingLayout.h"
#include "GLES2Commands.h"
#include "GLES2Buffer.h"
#include "GLES2TextureView.h"
#include "GLES2Sampler.h"

CC_NAMESPACE_BEGIN

GLES2BindingLayout::GLES2BindingLayout(GFXDevice* device)
    : GFXBindingLayout(device),
      gpu_binding_layout_(nullptr) {
}

GLES2BindingLayout::~GLES2BindingLayout() {
}

bool GLES2BindingLayout::Initialize(const GFXBindingLayoutInfo &info) {
  
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
  
  gpu_binding_layout_ = CC_NEW(GLES2GPUBindingLayout);
  gpu_binding_layout_->gpu_bindings.resize(binding_units_.size());
  for (size_t i = 0; i < gpu_binding_layout_->gpu_bindings.size(); ++i) {
    GLES2GPUBinding& gpu_binding = gpu_binding_layout_->gpu_bindings[i];
    const GFXBindingUnit& binding_unit = binding_units_[i];
    gpu_binding.binding = binding_unit.binding;
    gpu_binding.type = binding_unit.type;
    gpu_binding.name = binding_unit.name;
  }
  
  return true;
}

void GLES2BindingLayout::Destroy() {
  if (gpu_binding_layout_) {
    CC_DELETE(gpu_binding_layout_);
    gpu_binding_layout_ = nullptr;
  }
}

void GLES2BindingLayout::Update() {
  if (is_dirty_ && gpu_binding_layout_) {
    for (size_t i = 0; i < binding_units_.size(); ++i) {
      GFXBindingUnit& binding_unit = binding_units_[i];
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
    is_dirty_ = false;
  }
}

CC_NAMESPACE_END
