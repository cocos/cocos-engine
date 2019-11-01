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

bool GLES3PipelineLayout::Initialize(const GFXPipelineLayoutInfo &info) {
  
  layouts_ = info.layouts;
  push_constant_ranges_ = info.push_constant_ranges;
  
  gpu_pipeline_layout_ = CC_NEW(GLES3GPUPipelineLayout);
  return true;
}

void GLES3PipelineLayout::Destroy() {
  if (gpu_pipeline_layout_) {
    CC_DELETE(gpu_pipeline_layout_);
    gpu_pipeline_layout_ = nullptr;
  }
}

NS_CC_END
