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

#include "base/Agent.h"
#include "gfx-base/GFXTexture.h"

namespace cc {
namespace gfx {

class CC_DLL TextureValidator final : public Agent<Texture> {
public:
    explicit TextureValidator(Texture *actor);
    ~TextureValidator() override;

    void sanityCheck();

    inline void renounceOwnership() { _ownTheActor = false; }
    inline bool isInited() const { return _inited; }

    const Texture *getRaw() const override { return _actor->getRaw(); }

    uint32_t getGLTextureHandle() const noexcept override { return _actor->getGLTextureHandle(); }

protected:
    friend class SwapchainValidator;

    void doInit(const TextureInfo &info) override;
    void doInit(const TextureViewInfo &info) override;
    void doInit(const SwapchainTextureInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, uint32_t size) override;

    uint64_t _lastUpdateFrame{0U};
    bool _ownTheActor{true};
    bool _inited{false};
};

} // namespace gfx
} // namespace cc
