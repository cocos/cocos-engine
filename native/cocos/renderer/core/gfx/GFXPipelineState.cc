#include "CoreStd.h"
#include "GFXPipelineState.h"

namespace cc {

GFXPipelineState::GFXPipelineState(GFXDevice *device)
: GFXObject(GFXObjectType::PIPELINE_STATE), _device(device) {
}

GFXPipelineState::~GFXPipelineState() {
}

}
