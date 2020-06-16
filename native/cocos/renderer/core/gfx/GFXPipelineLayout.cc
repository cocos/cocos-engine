#include "CoreStd.h"
#include "GFXPipelineLayout.h"

namespace cc {
namespace gfx {

GFXPipelineLayout::GFXPipelineLayout(GFXDevice *device)
: GFXObject(GFXObjectType::PIPELINE_LAYOUT), _device(device) {
}

GFXPipelineLayout::~GFXPipelineLayout() {
}

} // namespace gfx
} // namespace cc
