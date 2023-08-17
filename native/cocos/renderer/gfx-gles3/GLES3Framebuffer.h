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

#pragma once

#include "GLES3Std.h"
#include "gfx-base/GFXFramebuffer.h"

namespace cc {
namespace gfx {

class GLES3GPUFramebuffer;

class CC_GLES3_API GLES3Framebuffer final : public Framebuffer {
public:
    GLES3Framebuffer();
    ~GLES3Framebuffer() override;

    inline GLES3GPUFramebuffer *gpuFBO() const { return _gpuFBO; }

protected:
    void doInit(const FramebufferInfo &info) override;
    void doDestroy() override;
    void updateExtent();

    GLES3GPUFramebuffer *_gpuFBO = nullptr;
};

} // namespace gfx
} // namespace cc
