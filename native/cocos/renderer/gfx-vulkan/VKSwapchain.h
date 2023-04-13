/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include "gfx-base/GFXSwapchain.h"
#include "gfx-vulkan/VKGPUObjects.h"

namespace cc {
class IXRInterface;
namespace gfx {

class CCVKDevice;
class CCVKGPUDevice;

class CC_VULKAN_API CCVKSwapchain final : public Swapchain {
public:
    static constexpr bool ENABLE_PRE_ROTATION = true;

    CCVKSwapchain();
    ~CCVKSwapchain() override;

    inline CCVKGPUSwapchain *gpuSwapchain() { return _gpuSwapchain; }

    bool checkSwapchainStatus(uint32_t width = 0, uint32_t height = 0);

protected:
    void doInit(const SwapchainInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, SurfaceTransform transform) override;
    void doDestroySurface() override;
    void doCreateSurface(void *windowHandle) override;

    void createVkSurface();
    void destroySwapchain(CCVKGPUDevice *gpuDevice);

    IntrusivePtr<CCVKGPUSwapchain> _gpuSwapchain;
    IXRInterface *_xr = nullptr;
};

} // namespace gfx
} // namespace cc
