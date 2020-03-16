#include "GLES2Std.h"
#include "GLES2Shader.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2Shader::GLES2Shader(GFXDevice* device)
    : GFXShader(device) {
}

GLES2Shader::~GLES2Shader() {
}

bool GLES2Shader::initialize(const GFXShaderInfo &info) {
  _name = info.name;
  _stages = info.stages;
  _blocks = info.blocks;
  _samplers = info.samplers;
  
  _gpuShader = CC_NEW(GLES2GPUShader);
  _gpuShader->name = _name;
  _gpuShader->blocks = _blocks;
  _gpuShader->samplers = _samplers;
  for (const auto& stage : _stages)
  {
      GLES2GPUShaderStage gpuShaderStage = { stage.type, stage.source, stage.macros, 0};
      _gpuShader->gpuStages.emplace_back(std::move(gpuShaderStage));
  }

  GLES2CmdFuncCreateShader((GLES2Device*)_device, _gpuShader);
    
    _status = GFXStatus::SUCCESS;
  
  return true;
}

void GLES2Shader::destroy() {
  if (_gpuShader) {
    GLES2CmdFuncDestroyShader((GLES2Device*)_device, _gpuShader);
    CC_DELETE(_gpuShader);
    _gpuShader = nullptr;
  }
    _status = GFXStatus::UNREADY;
}

NS_CC_END
