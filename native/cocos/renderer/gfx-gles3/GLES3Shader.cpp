/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "GLES3Std.h"

#include "GLES3Commands.h"
#include "GLES3Device.h"
#include "GLES3Shader.h"

namespace cc {
namespace gfx {

GLES3Shader::GLES3Shader() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3Shader::~GLES3Shader() {
    destroy();
}

void GLES3Shader::doInit(const ShaderInfo & /*info*/) {
    _gpuShader                  = CC_NEW(GLES3GPUShader);
    _gpuShader->name            = _name;
    _gpuShader->blocks          = _blocks;
    _gpuShader->buffers         = _buffers;
    _gpuShader->samplerTextures = _samplerTextures;
    _gpuShader->samplers        = _samplers;
    _gpuShader->textures        = _textures;
    _gpuShader->images          = _images;
    _gpuShader->subpassInputs   = _subpassInputs;
    for (const auto &stage : _stages) {
        GLES3GPUShaderStage gpuShaderStage = {stage.stage, stage.source};
        _gpuShader->gpuStages.emplace_back(std::move(gpuShaderStage));
    }

    cmdFuncGLES3CreateShader(GLES3Device::getInstance(), _gpuShader);
}

void GLES3Shader::doDestroy() {
    if (_gpuShader) {
        cmdFuncGLES3DestroyShader(GLES3Device::getInstance(), _gpuShader);
        CC_DELETE(_gpuShader);
        _gpuShader = nullptr;
    }
}

} // namespace gfx
} // namespace cc
