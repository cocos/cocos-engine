#include "GLES3Std.h"
#include "GLES3PipelineLayout.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3PipelineLayout::GLES3PipelineLayout(GFXDevice* device)
    : GFXPipelineLayout(device),
      gpu_pipeline_layout_(nullptr) {
}

GLES3PipelineLayout::~GLES3PipelineLayout() {
}

bool GLES3PipelineLayout::initialize(const GFXPipelineLayoutInfo &info) {
  
  _layouts = info.layouts;
  _pushConstantsRanges = info.push_constant_ranges;
  
  gpu_pipeline_layout_ = CC_NEW(GLES3GPUPipelineLayout);
  return true;
}

void GLES3PipelineLayout::destroy() {
  if (gpu_pipeline_layout_) {
    CC_DELETE(gpu_pipeline_layout_);
    gpu_pipeline_layout_ = nullptr;
  }
}

NS_CC_END
