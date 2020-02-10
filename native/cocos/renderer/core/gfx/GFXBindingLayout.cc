#include "CoreStd.h"
#include "GFXBindingLayout.h"

NS_CC_BEGIN

GFXBindingLayout::GFXBindingLayout(GFXDevice* device)
    : _device(device) {
}

GFXBindingLayout::~GFXBindingLayout() {
}

void GFXBindingLayout::bindBuffer(uint binding, GFXBuffer* buffer) {
  for (size_t i = 0; i < _bindingUnits.size(); ++i) {
    GFXBindingUnit& binding_unit = _bindingUnits[i];
    if (binding_unit.binding == binding) {
      if (binding_unit.type == GFXBindingType::UNIFORM_BUFFER) {
        if (binding_unit.buffer != buffer) {
          binding_unit.buffer = buffer;
          _isDirty = true;
        }
      } else {
          CCASSERT(false, "Setting binding is not GFXBindingType.UNIFORM_BUFFER.");
      }
      return;
    }
  }
}

void GFXBindingLayout::bindTextureView(uint binding, GFXTextureView* tex_view) {
  for (size_t i = 0; i < _bindingUnits.size(); ++i) {
    GFXBindingUnit& binding_unit = _bindingUnits[i];
    if (binding_unit.binding == binding) {
      if (binding_unit.type == GFXBindingType::SAMPLER) {
        if (binding_unit.tex_view != tex_view) {
          binding_unit.tex_view = tex_view;
          _isDirty = true;
        }
      } else {
          CCASSERT(false, "Setting binding is not GFXBindingType.SAMPLER.");
      }
      return;
    }
  }
}

void GFXBindingLayout::bindSampler(uint binding, GFXSampler* sampler) {
  for (size_t i = 0; i < _bindingUnits.size(); ++i) {
    GFXBindingUnit& binding_unit = _bindingUnits[i];
    if (binding_unit.binding == binding) {
      if (binding_unit.type == GFXBindingType::SAMPLER) {
        if (binding_unit.sampler != sampler) {
          binding_unit.sampler = sampler;
          _isDirty = true;
        }
      } else {
          CCASSERT(false, "Setting binding is not GFXBindingType.SAMPLER.");
      }
      return;
    }
  }
}

NS_CC_END
