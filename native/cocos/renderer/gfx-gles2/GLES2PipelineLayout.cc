#include "GLES2Std.h"
#include "GLES2PipelineLayout.h"
#include "GLES2Commands.h"

CC_NAMESPACE_BEGIN

GLES2PipelineLayout::GLES2PipelineLayout(GFXDevice* device)
    : GFXPipelineLayout(device),
      gpu_pipeline_layout_(nullptr) {
}

GLES2PipelineLayout::~GLES2PipelineLayout() {
}

bool GLES2PipelineLayout::Initialize(const GFXPipelineLayoutInfo &info) {
  
  layouts_ = info.layouts;
  push_constant_ranges_ = info.push_constant_ranges;
  
  gpu_pipeline_layout_ = CC_NEW(GLES2GPUPipelineLayout);
  return true;
}

void GLES2PipelineLayout::Destroy() {
  if (gpu_pipeline_layout_) {
    CC_DELETE(gpu_pipeline_layout_);
    gpu_pipeline_layout_ = nullptr;
  }
}

CC_NAMESPACE_END
