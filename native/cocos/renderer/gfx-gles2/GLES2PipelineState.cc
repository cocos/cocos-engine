#include "GLES2Std.h"
#include "GLES2PipelineState.h"
#include "GLES2Commands.h"
#include "GLES2Shader.h"
#include "GLES2RenderPass.h"
#include "GLES2PipelineLayout.h"

NS_CC_BEGIN

const GLenum GLES2Primitives []  = {
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

GLES2PipelineState::GLES2PipelineState(GFXDevice* device)
    : GFXPipelineState(device),
      gpu_pso_(nullptr) {
}

GLES2PipelineState::~GLES2PipelineState() {
}

bool GLES2PipelineState::Initialize(const GFXPipelineStateInfo &info) {
  
  primitive_ = info.primitive;
  shader_ = info.shader;
  is_ = info.is;
  rs_ = info.rs;
  dss_ = info.dss;
  bs_ = info.bs;
  dynamic_states_ = info.dynamic_states;
  layout_ = info.layout;
  render_pass_ = info.render_pass;
  
  gpu_pso_ = CC_NEW(GLES2GPUPipelineState);
  gpu_pso_->gl_primitive = GLES2Primitives[(int)primitive_];
  gpu_pso_->gpu_shader = ((GLES2Shader*)shader_)->gpu_shader();
  gpu_pso_->rs = rs_;
  gpu_pso_->dss = dss_;
  gpu_pso_->bs = bs_;
  gpu_pso_->dynamic_states = dynamic_states_;
  gpu_pso_->gpu_layout = ((GLES2PipelineLayout*)layout_)->gpu_pipeline_layout();
  gpu_pso_->gpu_render_pass = ((GLES2RenderPass*)render_pass_)->gpu_render_pass();
  
  return true;
}

void GLES2PipelineState::Destroy() {
  if (gpu_pso_) {
    CC_DELETE(gpu_pso_);
    gpu_pso_ = nullptr;
  }
}

NS_CC_END
