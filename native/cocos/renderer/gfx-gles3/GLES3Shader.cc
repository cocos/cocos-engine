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

bool GLES3Shader::Initialize(const GFXShaderInfo &info)
{
    name_ = info.name;
    stages_ = info.stages;
    blocks_ = info.blocks;
    samplers_ = info.samplers;

    gpu_shader_ = CC_NEW(GLES3GPUShader);
    gpu_shader_->name = name_;
    gpu_shader_->blocks = blocks_;
    gpu_shader_->samplers = samplers_;
    for (const auto& stage : stages_)
    {
        GLES3GPUShaderStage gpuShaderStage = { stage.type, stage.source, stage.macros, 0};
        gpu_shader_->gpu_stages.emplace_back(std::move(gpuShaderStage));
    }

    GLES3CmdFuncCreateShader((GLES3Device*)device_, gpu_shader_);

    return true;
}

void GLES3Shader::Destroy() {
  if (gpu_shader_) {
    GLES3CmdFuncDestroyShader((GLES3Device*)device_, gpu_shader_);
    CC_DELETE(gpu_shader_);
    gpu_shader_ = nullptr;
  }
}

NS_CC_END
