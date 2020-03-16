#include "CoreStd.h"
#include "GFXPipelineLayout.h"

NS_CC_BEGIN

GFXPipelineLayout::GFXPipelineLayout(GFXDevice* device)
: GFXObject(GFXObjectType::PIPELINE_LAYOUT)
, _device(device) {
}

GFXPipelineLayout::~GFXPipelineLayout() {
}

NS_CC_END
