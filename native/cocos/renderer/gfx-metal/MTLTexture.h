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
#pragma once

#import <Metal/MTLTexture.h>

namespace cc {
namespace gfx {

class CCMTLTexture final : public Texture {
public:
    explicit CCMTLTexture(Device *device);
    ~CCMTLTexture() override = default;
    CCMTLTexture(const CCMTLTexture &) = delete;
    CCMTLTexture(CCMTLTexture &&) = delete;
    CCMTLTexture &operator=(const CCMTLTexture &) = delete;
    CCMTLTexture &operator=(CCMTLTexture &&) = delete;

    bool initialize(const TextureInfo &info) override;
    bool initialize(const TextureViewInfo &info) override;
    void destroy() override;
    void resize(uint width, uint height) override;

    CC_INLINE id<MTLTexture> getMTLTexture() const { return _mtlTexture; }
    CC_INLINE Format getConvertedFormat() const { return _convertedFormat; }
    CC_INLINE bool isArray() const { return _isArray; }
    CC_INLINE bool isPVRTC() const { return _isPVRTC; }

private:
    bool createMTLTexture();

private:
    id<MTLTexture> _mtlTexture = nil;
    Format _convertedFormat = Format::UNKNOWN;
    bool _isArray = false;
    bool _isPVRTC = false;
};

} // namespace gfx
} // namespace cc
