/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKShader.h"

namespace cc {
namespace gfx {

CCVKShader::CCVKShader() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKShader::~CCVKShader() {
    destroy();
}

namespace {

void initGpuShader(CCVKGPUShader *gpuShader) {
    cmdFuncCCVKCreateShader(CCVKDevice::getInstance(), gpuShader);

    // Clear shader source after they're uploaded to GPU
    for (auto &stage : gpuShader->gpuStages) {
        stage.source.clear();
        stage.source.shrink_to_fit();
    }

    gpuShader->initialized = true;
}

} // namespace

CCVKGPUShader *CCVKShader::gpuShader() const {
    if (!_gpuShader->initialized) {
        initGpuShader(_gpuShader);
    }
    return _gpuShader;
}

void CCVKShader::doInit(const ShaderInfo & /*info*/) {
    _gpuShader = ccnew CCVKGPUShader;
    _gpuShader->name = _name;
    _gpuShader->attributes = _attributes;
    for (ShaderStage &stage : _stages) {
        _gpuShader->gpuStages.emplace_back(CCVKGPUShaderStage{stage.stage, stage.source});
    }
    for (auto &stage : _stages) {
        stage.source.clear();
        stage.source.shrink_to_fit();
    }
}

void CCVKShader::doDestroy() {
    _gpuShader = nullptr;
}

void CCVKGPUShader::shutdown() {
    auto gpuDevice = CCVKDevice::getInstance()->gpuDevice();
    for (const CCVKGPUShaderStage &stage : gpuStages) {
        vkDestroyShaderModule(gpuDevice->vkDevice, stage.vkShader, nullptr);
    }
}

} // namespace gfx
} // namespace cc
