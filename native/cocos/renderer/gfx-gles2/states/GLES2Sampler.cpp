/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "GLES2Sampler.h"
#include "../GLES2Commands.h"
#include "../GLES2Device.h"

namespace cc {
namespace gfx {

GLES2Sampler::GLES2Sampler(const SamplerInfo &info) : Sampler(info) {
    _typedID = generateObjectID<decltype(this)>();

    _gpuSampler = ccnew GLES2GPUSampler;
    _gpuSampler->minFilter = _info.minFilter;
    _gpuSampler->magFilter = _info.magFilter;
    _gpuSampler->mipFilter = _info.mipFilter;
    _gpuSampler->addressU = _info.addressU;
    _gpuSampler->addressV = _info.addressV;
    _gpuSampler->addressW = _info.addressW;

    cmdFuncGLES2CreateSampler(GLES2Device::getInstance(), _gpuSampler);
}

GLES2Sampler::~GLES2Sampler() {
    if (_gpuSampler) {
        cmdFuncGLES2DestroySampler(GLES2Device::getInstance(), _gpuSampler);
        delete _gpuSampler;
        _gpuSampler = nullptr;
    }
}

} // namespace gfx
} // namespace cc
