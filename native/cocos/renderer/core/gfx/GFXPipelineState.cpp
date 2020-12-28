#include "CoreStd.h"

#include "GFXPipelineState.h"

namespace cc {
namespace gfx {

PipelineState::PipelineState(Device *device)
: GFXObject(ObjectType::PIPELINE_STATE), _device(device) {
}

PipelineState::~PipelineState() {
}

} // namespace gfx
} // namespace cc
