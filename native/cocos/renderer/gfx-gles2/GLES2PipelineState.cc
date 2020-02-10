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

bool GLES2PipelineState::initialize(const GFXPipelineStateInfo &info) {
  
  _primitive = info.primitive;
  _shader = info.shader;
  _is = info.is;
  _rs = info.rs;
  _dss = info.dss;
  _bs = info.bs;
  _dynamicStates = info.dynamic_states;
  layout_ = info.layout;
  _renderPass = info.render_pass;
  
  gpu_pso_ = CC_NEW(GLES2GPUPipelineState);
  gpu_pso_->gl_primitive = GLES2Primitives[(int)_primitive];
  gpu_pso_->gpu_shader = ((GLES2Shader*)_shader)->gpu_shader();
  gpu_pso_->rs = _rs;
  gpu_pso_->dss = _dss;
  gpu_pso_->bs = _bs;
  gpu_pso_->dynamic_states = _dynamicStates;
  gpu_pso_->gpu_layout = ((GLES2PipelineLayout*)layout_)->gpu_pipeline_layout();
  gpu_pso_->gpu_render_pass = ((GLES2RenderPass*)_renderPass)->gpu_render_pass();
  
  return true;
}

void GLES2PipelineState::destroy() {
  if (gpu_pso_) {
    CC_DELETE(gpu_pso_);
    gpu_pso_ = nullptr;
  }
}

NS_CC_END
