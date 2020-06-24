#include "GLES3Std.h"
#include "GLES3PipelineLayout.h"
#include "GLES3Commands.h"

namespace cc {
namespace gfx {

GLES3PipelineLayout::GLES3PipelineLayout(Device *device)
: PipelineLayout(device) {
}

GLES3PipelineLayout::~GLES3PipelineLayout() {
}

bool GLES3PipelineLayout::initialize(const PipelineLayoutInfo &info) {

    _layouts = info.layouts;
    _pushConstantsRanges = info.pushConstantsRanges;

    _gpuPipelineLayout = CC_NEW(GLES3GPUPipelineLayout);
    _status = Status::SUCCESS;
    return true;
}

void GLES3PipelineLayout::destroy() {
    if (_gpuPipelineLayout) {
        CC_DELETE(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
