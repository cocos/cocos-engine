#include "GLES3Std.h"
#include "GLES3Shader.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3Shader::GLES3Shader(GFXDevice *device)
: GFXShader(device) {
}

GLES3Shader::~GLES3Shader() {
}

bool GLES3Shader::initialize(const GFXShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    _gpuShader = CC_NEW(GLES3GPUShader);
    _gpuShader->name = _name;
    _gpuShader->blocks = _blocks;
    _gpuShader->samplers = _samplers;
    for (const auto &stage : _stages) {
        GLES3GPUShaderStage gpuShaderStage = {stage.type, stage.source, stage.macros, 0};
        _gpuShader->gpuStages.emplace_back(std::move(gpuShaderStage));
    }

    GLES3CmdFuncCreateShader((GLES3Device *)_device, _gpuShader);

    _status = GFXStatus::SUCCESS;

    return true;
}

void GLES3Shader::destroy() {
    if (_gpuShader) {
        GLES3CmdFuncDestroyShader((GLES3Device *)_device, _gpuShader);
        CC_DELETE(_gpuShader);
        _gpuShader = nullptr;
    }

    _status = GFXStatus::UNREADY;
}

NS_CC_END
