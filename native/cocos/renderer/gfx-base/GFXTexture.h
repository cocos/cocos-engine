/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

    static uint computeHash(const TextureInfo &info);

    void initialize(const TextureInfo &info);
    void initialize(const TextureViewInfo &info);
    void destroy();
    void resize(uint width, uint height);

    inline TextureType  getType() const { return _type; }
    inline TextureUsage getUsage() const { return _usage; }
    inline Format       getFormat() const { return _format; }
    inline uint         getWidth() const { return _width; }
    inline uint         getHeight() const { return _height; }
    inline uint         getDepth() const { return _depth; }
    inline uint         getLayerCount() const { return _layerCount; }
    inline uint         getLevelCount() const { return _levelCount; }
    inline uint         getSize() const { return _size; }
    inline SampleCount  getSamples() const { return _samples; }
    inline TextureFlags getFlags() const { return _flags; }
    inline bool         isTextureView() const { return _isTextureView; }

protected:
    virtual void doInit(const TextureInfo &info)              = 0;
    virtual void doInit(const TextureViewInfo &info)          = 0;
    virtual void doDestroy()                                  = 0;
    virtual void doResize(uint width, uint height, uint size) = 0;

    TextureType  _type          = TextureType::TEX2D;
    TextureUsage _usage         = TextureUsageBit::NONE;
    Format       _format        = Format::UNKNOWN;
    uint         _width         = 0U;
    uint         _height        = 0U;
    uint         _depth         = 1U;
    uint         _baseLevel     = 0U;
    uint         _levelCount    = 1U;
    uint         _baseLayer     = 0U;
    uint         _layerCount    = 1U;
    uint         _size          = 0U;
    SampleCount  _samples       = SampleCount::X1;
    TextureFlags _flags         = TextureFlagBit::NONE;
    bool         _isTextureView = false;
};

} // namespace gfx
} // namespace cc
