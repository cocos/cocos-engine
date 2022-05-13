/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "GLES3Sampler.h"
#include "../GLES3Commands.h"
#include "../GLES3Device.h"

namespace cc {
namespace gfx {

GLES3Sampler::GLES3Sampler(const SamplerInfo &info) : Sampler(info) {
    _typedID = generateObjectID<decltype(this)>();

    _gpuSampler = ccnew GLES3GPUSampler;
    _gpuSampler->minFilter = _info.minFilter;
    _gpuSampler->magFilter = _info.magFilter;
    _gpuSampler->mipFilter = _info.mipFilter;
    _gpuSampler->addressU = _info.addressU;
    _gpuSampler->addressV = _info.addressV;
    _gpuSampler->addressW = _info.addressW;

    // GL is not thread-safe, so any actual gl invocations need to be deferred to device thread
    cmdFuncGLES3PrepareSamplerInfo(GLES3Device::getInstance(), _gpuSampler);
}

GLES3Sampler::~GLES3Sampler() {
    CC_SAFE_DELETE(_gpuSampler);
}

} // namespace gfx
} // namespace cc
