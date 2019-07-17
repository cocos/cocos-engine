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

/**
 * @addtogroup gfx
 * @{
 */

/**
 * The base texture class
 */
class Texture : public RenderTarget
{
public:
    /**
     * @enum Filter
     * Texture filter modes
     */
    enum class Filter : int8_t
    {
        NONE = -1,
        NEAREST = 0,
        LINEAR = 1
    };

    /**
     * @enum Filter
     * Texture wrap modes
     */
    enum class WrapMode : uint16_t
    {
        REPEAT = GL_REPEAT,
        CLAMP = GL_CLAMP_TO_EDGE,
        MIRROR = GL_MIRRORED_REPEAT
    };

    /**
     * @enum Format
     * Texture formats
     */
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
    
    /**
     * @struct Image
     * Raw image data
     */
    struct Image
    {
        uint8_t* data = nullptr;
        size_t length = 0;
    };

    /**
     * @struct Options
     * Texture setting options including format, width, height, wrap mode, filter etc.
     */
    struct Options
    {
        /**
         * Image mipmaps
         */
        std::vector<Image> images;
        /**
         * The maximum anisotropy for the texture
         */
        int32_t anisotropy = 1;
        /**
         * The internal format specifying the color components in the texture
         */
        GLenum glInternalFormat = GL_RGBA;
        /**
         * The pixel format of the texel data
         */
        GLenum glFormat = GL_RGB;
        /**
         * The data type of the texel data
         */
        GLenum glType = GL_UNSIGNED_BYTE;
        /**
         * The width of the texture
         */
        uint16_t width = 4;
        /**
         * The height of the texture
         */
        uint16_t height = 4;
        uint8_t bpp = 0;
        
        /**
         * The wrapping function for texture coordinate s
         */
        WrapMode wrapS = WrapMode::CLAMP;
        /**
         * The wrapping function for texture coordinate t
         */
        WrapMode wrapT = WrapMode::CLAMP;
        /**
         * The texture minification filter
         */
        Filter minFilter = Filter::LINEAR;
        /**
         * The texture magnification filter
         */
        Filter magFilter = Filter::LINEAR;
        /**
         * The texture filter for mipmaps
         */
        Filter mipFilter = Filter::LINEAR;
        
        /**
         * Specifies whether the texture have mipmaps
         */
        bool hasMipmap = false;
        /**
         * Specifies whether the texture if flipped vertically
         */
        bool flipY = false;
        /**
         * Specifies whether the texture have alpha premultiplied
         */
        bool premultiplyAlpha = false;
        /**
         * Specifies whether the texture is compressed
         */
        bool compressed = false;
    };

    /**
     * @struct ImageOption
     * The informations of Image which indicates the mipmap level, width, height, filpY and premultiplyAlpha
     */
    struct ImageOption
    {
        Image image;
        int32_t level = 0;
        uint16_t width = 4;
        uint16_t height = 4;

        bool flipY = false;
        bool premultiplyAlpha = false;
    };

    /**
     * @struct SubImageOption
     * The informations of sub image which indicates the area to update, mipmap level, filpY and premultiplyAlpha
     */
    struct SubImageOption
    {
        SubImageOption(uint16_t x, uint16_t y, uint16_t width, uint16_t height, uint8_t level, bool flipY, bool premultiplyAlpha)
        : x(x)
        , y(y)
        , width(width)
        , height(height)
        , level(level)
        , flipY(flipY)
        , premultiplyAlpha(premultiplyAlpha)
        {}
        
        SubImageOption() {}

        uint32_t imageDataLength = 0;
        uint16_t x = 0;
        uint16_t y = 0;
        uint16_t width = 0;
        uint16_t height = 0;
        uint8_t* imageData = nullptr;
        uint8_t level = 0;
        bool flipY = false;
        bool premultiplyAlpha = false;
    };

    /**
     * Gets the target gl location
     */
    inline GLuint getTarget() const { return _target; }
    /**
     * Gets the width of texture
     */
    inline uint16_t getWidth() const { return _width; }
    /**
     * Gets the height of texture
     */
    inline uint16_t getHeight() const { return _height; }

protected:
    
    static GLenum glFilter(Filter filter, Filter mipFilter = Filter::NONE);
    
    static bool isPow2(int32_t v) {
        return !(v & (v - 1)) && (!!v);
    }

    Texture();
    virtual ~Texture();

    bool init(DeviceGraphics* device);

    DeviceGraphics* _device;
    GLint _anisotropy;
    GLuint _target;
    
    WrapMode _wrapS;
    WrapMode _wrapT;
    uint16_t _width;
    uint16_t _height;
    uint8_t _bpp = 0;

    Filter _minFilter;
    Filter _magFilter;
    Filter _mipFilter;
    GLenum _glInternalFormat;
    GLenum _glFormat;
    GLenum _glType;

    bool _hasMipmap;
    bool _compressed;
};

// end of gfx group
/// @}

RENDERER_END
