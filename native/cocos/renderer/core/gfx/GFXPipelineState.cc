#include "CoreStd.h"
#include "GFXPipelineState.h"

NS_CC_BEGIN

GFXPipelineState::GFXPipelineState(GFXDevice* device)
    : device_(device),
      shader_(nullptr),
      primitive_(GFXPrimitiveMode::TRIANGLE_LIST),
      layout_(nullptr),
      render_pass_(nullptr) {
}

GFXPipelineState::~GFXPipelineState() {
}

NS_CC_END
