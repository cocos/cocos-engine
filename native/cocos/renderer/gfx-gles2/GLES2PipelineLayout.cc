#include "GLES2Std.h"
#include "GLES2PipelineLayout.h"
#include "GLES2Commands.h"

namespace cc {
namespace gfx {

GLES2PipelineLayout::GLES2PipelineLayout(GFXDevice *device)
: GFXPipelineLayout(device) {
}

GLES2PipelineLayout::~GLES2PipelineLayout() {
}

bool GLES2PipelineLayout::initialize(const GFXPipelineLayoutInfo &info) {

    _layouts = info.layouts;
    _pushConstantsRanges = info.pushConstantsRanges;

    _gpuPipelineLayout = CC_NEW(GLES2GPUPipelineLayout);
    _status = GFXStatus::SUCCESS;
    return true;
}

void GLES2PipelineLayout::destroy() {
    if (_gpuPipelineLayout) {
        CC_DELETE(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }

    _status = GFXStatus::UNREADY;
}

} // namespace gfx
} // namespace cc
