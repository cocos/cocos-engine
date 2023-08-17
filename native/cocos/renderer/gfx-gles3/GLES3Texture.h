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
#include "gfx-base/GFXTexture.h"

namespace cc {
namespace gfx {

struct GLES3GPUTexture;
struct GLES3GPUTextureView;
class CC_GLES3_API GLES3Texture final : public Texture {
public:
    GLES3Texture();
    ~GLES3Texture() override;

    inline GLES3GPUTexture *gpuTexture() const { return _gpuTexture; }
    inline GLES3GPUTextureView *gpuTextureView() const { return _gpuTextureView; }

    uint32_t getGLTextureHandle() const noexcept override;

protected:
    void doInit(const TextureInfo &info) override;
    void doInit(const TextureViewInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, uint32_t size) override;
    void doInit(const SwapchainTextureInfo &info) override;

    void createTextureView();

    GLES3GPUTexture *_gpuTexture = nullptr;
    GLES3GPUTextureView *_gpuTextureView = nullptr;
};

} // namespace gfx
} // namespace cc
