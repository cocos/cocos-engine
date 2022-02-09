/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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

namespace cc {
namespace gfx {

class CC_DLL Texture : public GFXObject {
public:
    Texture();
    ~Texture() override;

    static size_t computeHash(const TextureInfo &info);
    static size_t computeHash(const TextureViewInfo &info);

    void initialize(const TextureInfo &info);
    void initialize(const TextureViewInfo &info);
    void resize(uint32_t width, uint32_t height);
    void destroy();

    inline const TextureInfo &    getInfo() const { return _info; }
    inline const TextureViewInfo &getViewInfo() const { return _viewInfo; }

    inline bool     isTextureView() const { return _isTextureView; }
    inline uint32_t getSize() const { return _size; }
    inline size_t   getHash() const { return _hash; }

    // convenient getter for common usages
    inline Format   getFormat() const { return _info.format; }
    inline uint32_t getWidth() const { return _info.width; }
    inline uint32_t getHeight() const { return _info.height; }

protected:
    friend class Swapchain;

    virtual void doInit(const TextureInfo &info)                          = 0;
    virtual void doInit(const TextureViewInfo &info)                      = 0;
    virtual void doDestroy()                                              = 0;
    virtual void doResize(uint32_t width, uint32_t height, uint32_t size) = 0;

    static size_t computeHash(const Texture *texture);
    static void   initialize(const SwapchainTextureInfo &info, Texture *out);
    virtual void  doInit(const SwapchainTextureInfo &info) = 0;

    TextureInfo     _info;
    TextureViewInfo _viewInfo;

    Swapchain *_swapchain{nullptr};
    bool       _isTextureView{false};
    uint32_t   _size{0U};
    size_t     _hash{0U};
};

} // namespace gfx
} // namespace cc
