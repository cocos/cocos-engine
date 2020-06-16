#include "GLES3Std.h"
#include "GLES3PipelineLayout.h"
#include "GLES3Commands.h"

namespace cc {

GLES3PipelineLayout::GLES3PipelineLayout(GFXDevice *device)
: GFXPipelineLayout(device) {
}

GLES3PipelineLayout::~GLES3PipelineLayout() {
}

bool GLES3PipelineLayout::initialize(const GFXPipelineLayoutInfo &info) {

    _layouts = info.layouts;
    _pushConstantsRanges = info.pushConstantsRanges;

    _gpuPipelineLayout = CC_NEW(GLES3GPUPipelineLayout);
    _status = GFXStatus::SUCCESS;
    return true;
}

void GLES3PipelineLayout::destroy() {
    if (_gpuPipelineLayout) {
        CC_DELETE(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

}
