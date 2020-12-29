/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#include "GLES2Std.h"
#include "GLES2Shader.h"
#include "GLES2Commands.h"

namespace cc {
namespace gfx {

GLES2Shader::GLES2Shader(Device *device)
: Shader(device) {
}

GLES2Shader::~GLES2Shader() {
}

bool GLES2Shader::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    _gpuShader = CC_NEW(GLES2GPUShader);
    _gpuShader->name = _name;
    _gpuShader->blocks = _blocks;
    _gpuShader->samplers = _samplers;
    for (const auto &stage : _stages) {
        GLES2GPUShaderStage gpuShaderStage = {stage.stage, stage.source};
        _gpuShader->gpuStages.emplace_back(std::move(gpuShaderStage));
    }

    GLES2CmdFuncCreateShader((GLES2Device *)_device, _gpuShader);

    return true;
}

void GLES2Shader::destroy() {
    if (_gpuShader) {
        GLES2CmdFuncDestroyShader((GLES2Device *)_device, _gpuShader);
        CC_DELETE(_gpuShader);
        _gpuShader = nullptr;
    }
}

} // namespace gfx
} // namespace cc
