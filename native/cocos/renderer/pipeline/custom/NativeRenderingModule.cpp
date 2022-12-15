#include "NativePipelineTypes.h"

namespace cc {

namespace render {

uint32_t NativeRenderingModule::getPassID(const ccstd::string &name) const {
    std::ignore = name;
    return LayoutGraphData::null_vertex();
}

uint32_t NativeRenderingModule::getPhaseID(uint32_t passID, const ccstd::string &name) const {
    std::ignore = passID;
    std::ignore = name;
    return LayoutGraphData::null_vertex();
}

} // namespace render

} // namespace cc
