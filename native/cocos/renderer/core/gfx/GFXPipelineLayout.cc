#include "CoreStd.h"
#include "GFXPipelineLayout.h"

namespace cc {

GFXPipelineLayout::GFXPipelineLayout(GFXDevice *device)
: GFXObject(GFXObjectType::PIPELINE_LAYOUT), _device(device) {
}

GFXPipelineLayout::~GFXPipelineLayout() {
}

}
