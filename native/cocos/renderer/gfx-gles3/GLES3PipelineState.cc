#include "GLES3Std.h"
#include "GLES3PipelineState.h"
#include "GLES3Commands.h"
#include "GLES3Shader.h"
#include "GLES3RenderPass.h"
#include "GLES3PipelineLayout.h"

NS_CC_BEGIN

const GLenum GLES3Primitives []  = {
  GL_POINTS,
  GL_LINES,
  GL_LINE_STRIP,
  GL_LINE_LOOP,
  GL_NONE,
  GL_NONE,
  GL_NONE,
  GL_TRIANGLES,
  GL_TRIANGLE_STRIP,
  GL_TRIANGLE_FAN,
  GL_NONE,
  GL_NONE,
  GL_NONE,
  GL_NONE,
};

GLES3PipelineState::GLES3PipelineState(GFXDevice* device)
    : GFXPipelineState(device),
      gpu_pso_(nullptr) {
}

GLES3PipelineState::~GLES3PipelineState() {
}

bool GLES3PipelineState::initialize(const GFXPipelineStateInfo &info) {
  
  _primitive = info.primitive;
  _shader = info.shader;
  _is = info.is;
  _rs = info.rs;
  _dss = info.dss;
  _bs = info.bs;
  _dynamicStates = info.dynamic_states;
  layout_ = info.layout;
  _renderPass = info.render_pass;
  
  gpu_pso_ = CC_NEW(GLES3GPUPipelineState);
  gpu_pso_->gl_primitive = GLES3Primitives[(int)_primitive];
  gpu_pso_->gpu_shader = ((GLES3Shader*)_shader)->gpu_shader();
  gpu_pso_->rs = _rs;
  gpu_pso_->dss = _dss;
  gpu_pso_->bs = _bs;
  gpu_pso_->dynamic_states = _dynamicStates;
  gpu_pso_->gpu_layout = ((GLES3PipelineLayout*)layout_)->gpu_pipeline_layout();
  gpu_pso_->gpu_render_pass = ((GLES3RenderPass*)_renderPass)->gpu_render_pass();
  
  return true;
}

void GLES3PipelineState::destroy() {
  if (gpu_pso_) {
    CC_DELETE(gpu_pso_);
    gpu_pso_ = nullptr;
  }
}

NS_CC_END
