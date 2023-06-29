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

#import "gfx-base/GFXTexture.h"

#import <Metal/MTLTexture.h>

namespace cc {
namespace gfx {

struct CCMTLGPUTextureObject;
class CCMTLSwapchain;

class CCMTLTexture final : public Texture {
public:
    explicit CCMTLTexture();
    ~CCMTLTexture();
    CCMTLTexture(const CCMTLTexture &) = delete;
    CCMTLTexture(CCMTLTexture &&) = delete;
    CCMTLTexture &operator=(const CCMTLTexture &) = delete;
    CCMTLTexture &operator=(CCMTLTexture &&) = delete;

    inline id<MTLTexture> getMTLTexture() const {
        return _isTextureView ? _mtlTextureView : _mtlTexture;
    }
    inline Format getConvertedFormat() const { return _convertedFormat; }
    inline bool isArray() const { return _isArray; }
    inline bool isPVRTC() const { return _isPVRTC; }

    //update drawable from swapchain.
    void update();

    const TextureInfo &textureInfo();
    CCMTLSwapchain *swapChain();

    static CCMTLTexture *getDefaultTexture();
    static void deleteDefaultTexture();

protected:
    void doInit(const TextureInfo &info) override;
    void doInit(const TextureViewInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, uint32_t size) override;
    void doInit(const SwapchainTextureInfo &info) override;

    bool createMTLTexture();

    Format _convertedFormat = Format::UNKNOWN;
    bool _isArray = false;
    bool _isPVRTC = false;

    bool _allocateMemory = true; // allocate device memory by metal driver.

    id<MTLTexture> _mtlTexture = nil;
    id<MTLTexture> _mtlTextureView = nil;
};

} // namespace gfx
} // namespace cc
