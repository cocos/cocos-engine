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

bool GLES2Shader::initialize(const GFXShaderInfo &info) {
  _name = info.name;
  _stages = info.stages;
  _blocks = info.blocks;
  _samplers = info.samplers;
  
  gpu_shader_ = CC_NEW(GLES2GPUShader);
  gpu_shader_->name = _name;
  gpu_shader_->blocks = _blocks;
  gpu_shader_->samplers = _samplers;
  for (const auto& stage : _stages)
  {
      GLES2GPUShaderStage gpuShaderStage = { stage.type, stage.source, stage.macros, 0};
      gpu_shader_->gpu_stages.emplace_back(std::move(gpuShaderStage));
  }

  GLES2CmdFuncCreateShader((GLES2Device*)_device, gpu_shader_);
  
  return true;
}

void GLES2Shader::destroy() {
  if (gpu_shader_) {
    GLES2CmdFuncDestroyShader((GLES2Device*)_device, gpu_shader_);
    CC_DELETE(gpu_shader_);
    gpu_shader_ = nullptr;
  }
}

NS_CC_END
