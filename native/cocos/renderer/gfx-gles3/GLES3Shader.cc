#include "GLES3Std.h"
#include "GLES3Shader.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3Shader::GLES3Shader(GFXDevice* device)
    : GFXShader(device),
      gpu_shader_(nullptr) {
}

GLES3Shader::~GLES3Shader() {
}

bool GLES3Shader::initialize(const GFXShaderInfo &info)
{
    _name = info.name;
    _stages = info.stages;
    _blocks = info.blocks;
    _samplers = info.samplers;

    gpu_shader_ = CC_NEW(GLES3GPUShader);
    gpu_shader_->name = _name;
    gpu_shader_->blocks = _blocks;
    gpu_shader_->samplers = _samplers;
    for (const auto& stage : _stages)
    {
        GLES3GPUShaderStage gpuShaderStage = { stage.type, stage.source, stage.macros, 0};
        gpu_shader_->gpu_stages.emplace_back(std::move(gpuShaderStage));
    }

    GLES3CmdFuncCreateShader((GLES3Device*)_device, gpu_shader_);

    return true;
}

void GLES3Shader::destroy() {
  if (gpu_shader_) {
    GLES3CmdFuncDestroyShader((GLES3Device*)_device, gpu_shader_);
    CC_DELETE(gpu_shader_);
    gpu_shader_ = nullptr;
  }
}

NS_CC_END
