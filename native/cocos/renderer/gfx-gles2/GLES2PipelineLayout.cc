#include "GLES2Std.h"
#include "GLES2PipelineLayout.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2PipelineLayout::GLES2PipelineLayout(GFXDevice* device)
    : GFXPipelineLayout(device),
      gpu_pipeline_layout_(nullptr) {
}

GLES2PipelineLayout::~GLES2PipelineLayout() {
}

bool GLES2PipelineLayout::initialize(const GFXPipelineLayoutInfo &info) {
  
  _layouts = info.layouts;
  _pushConstantsRanges = info.push_constant_ranges;
  
  gpu_pipeline_layout_ = CC_NEW(GLES2GPUPipelineLayout);
  return true;
}

void GLES2PipelineLayout::destroy() {
  if (gpu_pipeline_layout_) {
    CC_DELETE(gpu_pipeline_layout_);
    gpu_pipeline_layout_ = nullptr;
  }
}

NS_CC_END
