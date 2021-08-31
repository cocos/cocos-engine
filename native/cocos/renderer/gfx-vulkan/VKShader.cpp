/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

void CCVKShader::doInit(const ShaderInfo & /*info*/) {
    _gpuShader             = CC_NEW(CCVKGPUShader);
    _gpuShader->name       = _name;
    _gpuShader->attributes = _attributes;
    _gpuShader->blocks     = _blocks;
    _gpuShader->samplers   = _samplers;
    for (ShaderStage &stage : _stages) {
        _gpuShader->gpuStages.push_back({stage.stage, stage.source});
    }

    cmdFuncCCVKCreateShader(CCVKDevice::getInstance(), _gpuShader);
}

void CCVKShader::doDestroy() {
    if (_gpuShader) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuShader);
        _gpuShader = nullptr;
    }
}

} // namespace gfx
} // namespace cc
