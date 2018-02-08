/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

#include "../Macro.h"
#include "../Types.h"

#include "GraphicsHandle.h"
#include "RenderTarget.h"
#include "base/CCData.h"

#include <vector>

RENDERER_BEGIN

class DeviceGraphics;

class Texture : public RenderTarget
{
public:
    // texture filter
    enum class Filter : int8_t
    {
        NONE = -1,
        NEAREST = 0,
        LINEAR = 1
    };

    // texture wrap mode
    enum class WrapMode : uint16_t
    {
        REPEAT = GL_REPEAT,
        CLAMP = GL_CLAMP_TO_EDGE,
        MIRROR = GL_MIRRORED_REPEAT
    };

    // texture format
    enum class Format : uint8_t
    {
        BEGIN = 0,
    // compress formats
        RGB_DXT1 = 0,
        RGBA_DXT1 = 1,
        RGBA_DXT3 = 2,
        RGBA_DXT5 = 3,
        RGB_ETC1 = 4,
        RGB_PVRTC_2BPPV1 = 5,
        RGBA_PVRTC_2BPPV1 = 6,
        RGB_PVRTC_4BPPV1 = 7,
        RGBA_PVRTC_4BPPV1 = 8,
    //
    // normal formats
        A8 = 9,
        L8 = 10,
        L8_A8 = 11,
        R5_G6_B5 = 12,
        R5_G5_B5_A1 = 13,
        R4_G4_B4_A4 = 14,
        RGB8 = 15,                      // each channel has 8 bits
        RGBA8 = 16,                     // each channel has 8 bits
        RGB16F = 17,                    // each channel has 16 bits
        RGBA16F = 18,                   // each channel has 16 bits
        RGB32F = 19,                    // each channel has 32 bits
        RGBA32F = 20,                   // each channel has 32 bits
        R32F = 21,
        _111110F = 22,
        SRGB = 23,
        SRGBA = 24,
    //
    // depth formats
        D16 = 25,
        END = 25
    //
    };

    struct Options
    {
        Options()
        : anisotropy(1)
        , width(4)
        , height(4)
        , wrapS(WrapMode::REPEAT)
        , wrapT(WrapMode::REPEAT)
        , minFilter(Filter::LINEAR)
        , magFilter(Filter::LINEAR)
        , mipFilter(Filter::LINEAR)
        , format(Format::RGBA8)
        , hasMipmap(false)
        , flipY(true) // TODO: Default flipY value should be false ? If it's true, it will waste some CPU resource for re-format data.
        , premultiplyAlpha(false)
        {}

        std::vector<cocos2d::Data> images;
        int32_t anisotropy;
        uint16_t width;
        uint16_t height;

        WrapMode wrapS;
        WrapMode wrapT;

        Filter minFilter;
        Filter magFilter;
        Filter mipFilter;
        Format format;
        bool hasMipmap;
        bool flipY;
        bool premultiplyAlpha;
    };

    struct ImageOption
    {
        ImageOption()
        : anisotropy(1)
        , level(0)
        , width(4)
        , height(4)
        , wrapS(WrapMode::REPEAT)
        , wrapT(WrapMode::REPEAT)
        , minFilter(Filter::LINEAR)
        , magFilter(Filter::LINEAR)
        , mipFilter(Filter::LINEAR)
        , format(Format::RGBA8)
        , hasMipmap(false)
        , flipY(true)
        , premultiplyAlpha(false)
        {}

        cocos2d::Data image;
        int32_t anisotropy;
        int32_t level;
        uint16_t width;
        uint16_t height;

        WrapMode wrapS;
        WrapMode wrapT;

        Filter minFilter;
        Filter magFilter;
        Filter mipFilter;
        Format format;
        bool hasMipmap;
        bool flipY;
        bool premultiplyAlpha;
    };

    struct SubImageOption
    {
        SubImageOption()
        : anisotropy(1)
        , level(0)
        , x(0)
        , y(0)
        , width(4)
        , height(4)
        , wrapS(WrapMode::REPEAT)
        , wrapT(WrapMode::REPEAT)
        , minFilter(Filter::LINEAR)
        , magFilter(Filter::LINEAR)
        , mipFilter(Filter::LINEAR)
        , format(Format::RGBA8)
        , hasMipmap(false)
        , flipY(true)
        , premultiplyAlpha(false)
        {}

        cocos2d::Data image;
        int32_t anisotropy;
        int32_t level;
        uint16_t x;
        uint16_t y;
        uint16_t width;
        uint16_t height;

        WrapMode wrapS;
        WrapMode wrapT;

        Filter minFilter;
        Filter magFilter;
        Filter mipFilter;
        Format format;
        bool hasMipmap;
        bool flipY;
        bool premultiplyAlpha;
    };

    inline GLuint getTarget() const { return _target; }
    inline uint16_t getWidth() const { return _width; }
    inline uint16_t getHeight() const { return _height; }

protected:
    struct GLTextureFmt
    {
        GLenum format;
        GLenum internalFormat;
        GLenum pixelType;
        uint8_t bpp;
    };
    
    static GLenum glFilter(Filter filter, Filter mipFilter = Filter::NONE);
    static const GLTextureFmt& glTextureFmt(Format fmt);
    
    static bool isPow2(int32_t v) {
        return !(v & (v - 1)) && (!!v);
    }

    Texture();
    virtual ~Texture();

    bool init(DeviceGraphics* device);
    
    static GLTextureFmt _textureFmt[];

    DeviceGraphics* _device;
    GLint _anisotropy;
    GLuint _target;
    
    WrapMode _wrapS;
    WrapMode _wrapT;
    uint16_t _width;
    uint16_t _height;

    Filter _minFilter;
    Filter _magFilter;
    Filter _mipFilter;
    Format _format;

    bool _hasMipmap;
    bool _compressed;
};

RENDERER_END
