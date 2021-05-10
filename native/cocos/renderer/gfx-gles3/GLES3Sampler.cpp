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
#include "GLES3Sampler.h"

namespace cc {
namespace gfx {

GLES3Sampler::GLES3Sampler() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3Sampler::~GLES3Sampler() {
    destroy();
}

void GLES3Sampler::doInit(const SamplerInfo& /*info*/) {
    _gpuSampler            = CC_NEW(GLES3GPUSampler);
    _gpuSampler->minFilter = _minFilter;
    _gpuSampler->magFilter = _magFilter;
    _gpuSampler->mipFilter = _mipFilter;
    _gpuSampler->addressU  = _addressU;
    _gpuSampler->addressV  = _addressV;
    _gpuSampler->addressW  = _addressW;

    cmdFuncGLES3CreateSampler(GLES3Device::getInstance(), _gpuSampler);
}

void GLES3Sampler::doDestroy() {
    if (_gpuSampler) {
        cmdFuncGLES3DestroySampler(GLES3Device::getInstance(), _gpuSampler);
        CC_DELETE(_gpuSampler);
        _gpuSampler = nullptr;
    }
}

} // namespace gfx
} // namespace cc
