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

#include "GLES3GeneralBarrier.h"
#include "../GLES3Commands.h"
#include "gfx-gles3/GLES3Device.h"

namespace cc {
namespace gfx {

GLES3GeneralBarrier::GLES3GeneralBarrier(const GeneralBarrierInfo &info) : GeneralBarrier(info) {
    _typedID = generateObjectID<decltype(this)>();

    _gpuBarrier = ccnew GLES3GPUGeneralBarrier;
    _gpuBarrier->prevAccesses = info.prevAccesses;
    _gpuBarrier->nextAccesses = info.nextAccesses;

    cmdFuncGLES3CreateGeneralBarrier(GLES3Device::getInstance(), _gpuBarrier);
}

GLES3GeneralBarrier::~GLES3GeneralBarrier() {
    CC_SAFE_DELETE(_gpuBarrier);
}

} // namespace gfx
} // namespace cc
