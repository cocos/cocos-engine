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
#include "GLES2Sampler.h"
#include "GLES2Commands.h"

namespace cc {
namespace gfx {

GLES2Sampler::GLES2Sampler(Device *device)
: Sampler(device) {
}

GLES2Sampler::~GLES2Sampler() {
}

bool GLES2Sampler::initialize(const SamplerInfo &info) {
    _minFilter = info.minFilter;
    _magFilter = info.magFilter;
    _mipFilter = info.mipFilter;
    _addressU = info.addressU;
    _addressV = info.addressV;
    _addressW = info.addressW;
    _maxAnisotropy = info.maxAnisotropy;
    _cmpFunc = info.cmpFunc;
    _borderColor = info.borderColor;
    _minLOD = info.minLOD;
    _maxLOD = info.maxLOD;
    _mipLODBias = info.mipLODBias;

    _gpuSampler = CC_NEW(GLES2GPUSampler);
    _gpuSampler->minFilter = _minFilter;
    _gpuSampler->magFilter = _magFilter;
    _gpuSampler->mipFilter = _mipFilter;
    _gpuSampler->addressU = _addressU;
    _gpuSampler->addressV = _addressV;
    _gpuSampler->addressW = _addressW;
    _gpuSampler->minLOD = _minLOD;
    _gpuSampler->maxLOD = _maxLOD;

    GLES2CmdFuncCreateSampler((GLES2Device *)_device, _gpuSampler);

    return true;
}

void GLES2Sampler::destroy() {
    if (_gpuSampler) {
        GLES2CmdFuncDestroySampler((GLES2Device *)_device, _gpuSampler);
        CC_DELETE(_gpuSampler);
        _gpuSampler = nullptr;
    }
}

} // namespace gfx
} // namespace cc
