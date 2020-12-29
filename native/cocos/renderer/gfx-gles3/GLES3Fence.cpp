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
#include "GLES3Std.h"
#include "GLES3Fence.h"
#include "GLES3Device.h"
#include "GLES3GPUObjects.h"

namespace cc {
namespace gfx {

GLES3Fence::GLES3Fence(Device *device)
: Fence(device) {
}

GLES3Fence::~GLES3Fence() {
}

bool GLES3Fence::initialize(const FenceInfo &info) {
    _gpuFence = CC_NEW(GLES3GPUFence);
    if (!_gpuFence) {
        CC_LOG_ERROR("GLES2Fence: CC_NEW GLES3GPUFence failed.");
        return false;
    }

    // TODO

    return true;
}

void GLES3Fence::destroy() {
    if (_gpuFence) {
        // TODO

        CC_DELETE(_gpuFence);
        _gpuFence = nullptr;
    }
}

void GLES3Fence::wait() {
    // TODO
}

void GLES3Fence::reset() {
    // TODO
}

} // namespace gfx
} // namespace cc
