#include "GLES2Std.h"
#include "GLES2Shader.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2Shader::GLES2Shader(GFXDevice* device)
    : GFXShader(device),
      gpu_shader_(nullptr) {
}

GLES2Shader::~GLES2Shader() {
}

bool GLES2Shader::Initialize(const GFXShaderInfo &info) {
  name_ = info.name;
  stages_ = info.stages;
  blocks_ = info.blocks;
  samplers_ = info.samplers;
  
  gpu_shader_ = CC_NEW(GLES2GPUShader);
  gpu_shader_->name = name_;
  gpu_shader_->blocks = blocks_;
  gpu_shader_->samplers = samplers_;
  for (const auto& stage : stages_)
  {
      GLES2GPUShaderStage gpuShaderStage = { stage.type, stage.source, stage.macros, 0};
      gpu_shader_->gpu_stages.emplace_back(std::move(gpuShaderStage));
  }

  GLES2CmdFuncCreateShader((GLES2Device*)device_, gpu_shader_);
  
  return true;
}

void GLES2Shader::Destroy() {
  if (gpu_shader_) {
    GLES2CmdFuncDestroyShader((GLES2Device*)device_, gpu_shader_);
    CC_DELETE(gpu_shader_);
    gpu_shader_ = nullptr;
  }
}

NS_CC_END
