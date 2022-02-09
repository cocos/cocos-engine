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

#include "VKSampler.h"
#include "../VKCommands.h"
#include "../VKDevice.h"

namespace cc {
namespace gfx {

CCVKSampler::CCVKSampler(const SamplerInfo &info) : Sampler(info) {
    _typedID = generateObjectID<decltype(this)>();

    _gpuSampler                = CC_NEW(CCVKGPUSampler);
    _gpuSampler->minFilter     = _info.minFilter;
    _gpuSampler->magFilter     = _info.magFilter;
    _gpuSampler->mipFilter     = _info.mipFilter;
    _gpuSampler->addressU      = _info.addressU;
    _gpuSampler->addressV      = _info.addressV;
    _gpuSampler->addressW      = _info.addressW;
    _gpuSampler->maxAnisotropy = _info.maxAnisotropy;
    _gpuSampler->cmpFunc       = _info.cmpFunc;

    cmdFuncCCVKCreateSampler(CCVKDevice::getInstance(), _gpuSampler);
}

CCVKSampler::~CCVKSampler() { // NOLINT(bugprone-exception-escape) garbage collect may throw
    if (_gpuSampler) {
        CCVKDevice::getInstance()->gpuDescriptorHub()->disengage(_gpuSampler);
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuSampler);
        _gpuSampler = nullptr;
    }
}

} // namespace gfx
} // namespace cc
