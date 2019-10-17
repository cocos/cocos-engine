#include "CoreStd.h"
#include "GFXPipelineState.h"

CC_NAMESPACE_BEGIN

GFXPipelineState::GFXPipelineState(GFXDevice* device)
    : device_(device),
      shader_(nullptr),
      primitive_(GFXPrimitiveMode::TRIANGLE_LIST),
      layout_(nullptr),
      render_pass_(nullptr) {
}

GFXPipelineState::~GFXPipelineState() {
}

CC_NAMESPACE_END
