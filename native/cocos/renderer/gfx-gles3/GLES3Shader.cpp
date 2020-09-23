#include "GLES3Std.h"
#include "GLES3Shader.h"
#include "GLES3Commands.h"

namespace cc {
namespace gfx {

GLES3Shader::GLES3Shader(Device *device)
: Shader(device) {
}

GLES3Shader::~GLES3Shader() {
}

bool GLES3Shader::initialize(const ShaderInfo &info) {
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
        GLES3GPUShaderStage gpuShaderStage = {stage.stage, stage.source};
        _gpuShader->gpuStages.emplace_back(std::move(gpuShaderStage));
    }

    GLES3CmdFuncCreateShader((GLES3Device *)_device, _gpuShader);

    return true;
}

void GLES3Shader::destroy() {
    if (_gpuShader) {
        GLES3CmdFuncDestroyShader((GLES3Device *)_device, _gpuShader);
        CC_DELETE(_gpuShader);
        _gpuShader = nullptr;
    }
}

} // namespace gfx
} // namespace cc
