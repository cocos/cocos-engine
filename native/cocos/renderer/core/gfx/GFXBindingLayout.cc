#include "CoreStd.h"
#include "GFXBindingLayout.h"

CC_NAMESPACE_BEGIN

GFXBindingLayout::GFXBindingLayout(GFXDevice* device)
    : device_(device) {
}

GFXBindingLayout::~GFXBindingLayout() {
}

void GFXBindingLayout::BindBuffer(uint binding, GFXBuffer* buffer) {
  for (size_t i = 0; i < binding_units_.size(); ++i) {
    GFXBindingUnit& binding_unit = binding_units_[i];
    if (binding_unit.binding == binding) {
      if (binding_unit.type == GFXBindingType::UNIFORM_BUFFER) {
        if (binding_unit.buffer != buffer) {
          binding_unit.buffer = buffer;
          is_dirty_ = true;
        }
      } else {
        CC_ASSERTS(false, "Setting binding is not GFXBindingType.UNIFORM_BUFFER.")
      }
      return;
    }
  }
}

void GFXBindingLayout::BindTextureView(uint binding, GFXTextureView* tex_view) {
  for (size_t i = 0; i < binding_units_.size(); ++i) {
    GFXBindingUnit& binding_unit = binding_units_[i];
    if (binding_unit.binding == binding) {
      if (binding_unit.type == GFXBindingType::SAMPLER) {
        if (binding_unit.tex_view != tex_view) {
          binding_unit.tex_view = tex_view;
          is_dirty_ = true;
        }
      } else {
        CC_ASSERTS(false, "Setting binding is not GFXBindingType.SAMPLER.")
      }
      return;
    }
  }
}

void GFXBindingLayout::BindSampler(uint binding, GFXSampler* sampler) {
  for (size_t i = 0; i < binding_units_.size(); ++i) {
    GFXBindingUnit& binding_unit = binding_units_[i];
    if (binding_unit.binding == binding) {
      if (binding_unit.type == GFXBindingType::SAMPLER) {
        if (binding_unit.sampler != sampler) {
          binding_unit.sampler = sampler;
          is_dirty_ = true;
        }
      } else {
        CC_ASSERTS(false, "Setting binding is not GFXBindingType.SAMPLER.")
      }
      return;
    }
  }
}

CC_NAMESPACE_END
