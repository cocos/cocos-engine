#include "MTLStd.h"
#include "MTLPipelineLayout.h"

namespace cc {
namespace gfx {

CCMTLPipelineLayout::CCMTLPipelineLayout(Device *device) : PipelineLayout(device) {}
CCMTLPipelineLayout::~CCMTLPipelineLayout() { destroy(); }

bool CCMTLPipelineLayout::initialize(const PipelineLayoutInfo &info) {
    _layouts = info.layouts;
    _pushConstantsRanges = info.pushConstantsRanges;
    _status = Status::SUCCESS;

    return true;
}

void CCMTLPipelineLayout::destroy() {
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
