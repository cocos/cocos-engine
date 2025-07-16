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

#include "GFXTexture.h"
#include "base/Ptr.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {
namespace gfx {

class CC_DLL Swapchain : public GFXObject {
public:
    Swapchain();
    ~Swapchain() override;

    void initialize(const SwapchainInfo &info);
    void destroy();

    /**
     * Resize the swapchain with the given metric.
     * Note that you should invoke this function iff when there is actual
     * size or orientation changes, with the up-to-date information about
     * the underlying surface.
     *
     * @param width The width of the surface in oriented screen space
     * @param height The height of the surface in oriented screen space
     * @param transform The orientation of the surface
     */
    void resize(uint32_t width, uint32_t height, SurfaceTransform transform);

    inline void destroySurface();
    inline void createSurface(void *windowHandle);

    inline uint32_t getWindowId() const { return _windowId; }
    inline void *getWindowHandle() const { return _windowHandle; }
    inline VsyncMode getVSyncMode() const { return _vsyncMode; }

    inline Texture *getColorTexture() const { return _colorTexture; }
    inline Texture *getDepthStencilTexture() const { return _depthStencilTexture; }

    inline SurfaceTransform getSurfaceTransform() const { return _transform; }
    inline uint32_t getWidth() const { return _colorTexture->getWidth(); }
    inline uint32_t getHeight() const { return _colorTexture->getHeight(); }
    inline uint32_t getGeneration() const { return _generation; }

protected:
    virtual void doInit(const SwapchainInfo &info) = 0;
    virtual void doDestroy() = 0;
    virtual void doResize(uint32_t width, uint32_t height, SurfaceTransform transform) = 0;
    virtual void doDestroySurface() = 0;
    virtual void doCreateSurface(void *windowHandle) = 0;

    static inline void initTexture(const SwapchainTextureInfo &info, Texture *texture);
    static inline void updateTextureInfo(const SwapchainTextureInfo &info, Texture *texture);

    uint32_t _windowId{0};
    void *_windowHandle{nullptr};
    VsyncMode _vsyncMode{VsyncMode::RELAXED};
    SurfaceTransform _transform{SurfaceTransform::IDENTITY};
    bool _preRotationEnabled{false};
    uint32_t _generation{0};

    IntrusivePtr<Texture> _colorTexture;
    IntrusivePtr<Texture> _depthStencilTexture;
};

///////////////////////////////////////////////////////////

void Swapchain::destroySurface() {
    doDestroySurface();
    _windowHandle = nullptr;
}

void Swapchain::createSurface(void *windowHandle) {
    _windowHandle = windowHandle;
    doCreateSurface(windowHandle);
}

void Swapchain::initTexture(const SwapchainTextureInfo &info, Texture *texture) {
    Texture::initialize(info, texture);
}

void Swapchain::updateTextureInfo(const SwapchainTextureInfo &info, Texture *texture) {
    Texture::updateTextureInfo(info, texture);
}

} // namespace gfx
} // namespace cc
