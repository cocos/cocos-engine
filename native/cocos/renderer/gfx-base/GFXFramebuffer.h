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

#include "GFXObject.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/RefVector.h"

namespace cc {
namespace gfx {

class CC_DLL Framebuffer : public GFXObject, public RefCounted {
public:
    Framebuffer();
    ~Framebuffer() override;

    static ccstd::hash_t computeHash(const FramebufferInfo &info);

    void initialize(const FramebufferInfo &info);
    void destroy();

    inline RenderPass *getRenderPass() const { return _renderPass; }
    inline const TextureList &getColorTextures() const { return _colorTextures; }
    inline Texture *getDepthStencilTexture() const { return _depthStencilTexture; }
    inline Texture *getDepthStencilResolveTexture() const { return _depthStencilResolveTexture; }

protected:
    virtual void doInit(const FramebufferInfo &info) = 0;
    virtual void doDestroy() = 0;

    // weak reference
    RenderPass *_renderPass{nullptr};
    // weak reference
    TextureList _colorTextures;
    // weak reference
    Texture *_depthStencilTexture{nullptr};
    Texture *_depthStencilResolveTexture{nullptr};
};

} // namespace gfx
} // namespace cc
