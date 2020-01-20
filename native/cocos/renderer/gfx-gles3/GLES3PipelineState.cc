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

bool GLES3PipelineState::Initialize(const GFXPipelineStateInfo &info) {
  
  primitive_ = info.primitive;
  shader_ = info.shader;
  is_ = info.is;
  rs_ = info.rs;
  dss_ = info.dss;
  bs_ = info.bs;
  dynamic_states_ = info.dynamic_states;
  layout_ = info.layout;
  render_pass_ = info.render_pass;
  
  gpu_pso_ = CC_NEW(GLES3GPUPipelineState);
  gpu_pso_->gl_primitive = GLES3Primitives[(int)primitive_];
  gpu_pso_->gpu_shader = ((GLES3Shader*)shader_)->gpu_shader();
  gpu_pso_->rs = rs_;
  gpu_pso_->dss = dss_;
  gpu_pso_->bs = bs_;
  gpu_pso_->dynamic_states = dynamic_states_;
  gpu_pso_->gpu_layout = ((GLES3PipelineLayout*)layout_)->gpu_pipeline_layout();
  gpu_pso_->gpu_render_pass = ((GLES3RenderPass*)render_pass_)->gpu_render_pass();
  
  return true;
}

void GLES3PipelineState::destroy() {
  if (gpu_pso_) {
    CC_DELETE(gpu_pso_);
    gpu_pso_ = nullptr;
  }
}

NS_CC_END
