#include "CoreStd.h"
#include "GFXPipelineState.h"

NS_CC_BEGIN

GFXPipelineState::GFXPipelineState(GFXDevice* device)
: GFXObject(GFXObjectType::PIPELINE_STATE)
, _device(device)
{
}

GFXPipelineState::~GFXPipelineState() {
}

NS_CC_END
