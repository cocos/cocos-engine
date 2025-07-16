/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "VKStd.h"
#include "gfx-base/GFXTexture.h"
#include "gfx-vulkan/VKGPUObjects.h"

namespace cc {
namespace gfx {

class CC_VULKAN_API CCVKTexture final : public Texture {
public:
    CCVKTexture();
    ~CCVKTexture() override;

    inline CCVKGPUTexture *gpuTexture() const { return _gpuTexture; }
    inline CCVKGPUTextureView *gpuTextureView() const { return _gpuTextureView; }

protected:
    friend class CCVKSwapchain;

    void doInit(const TextureInfo &info) override;
    void doInit(const TextureViewInfo &info) override;
    void doInit(const SwapchainTextureInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, uint32_t size) override;

    void createTexture(uint32_t width, uint32_t height, uint32_t size, bool initGPUTexture = true);
    void createTextureView(bool initGPUTextureView = true);

    IntrusivePtr<CCVKGPUTexture> _gpuTexture;
    IntrusivePtr<CCVKGPUTextureView> _gpuTextureView;
};

} // namespace gfx
} // namespace cc
