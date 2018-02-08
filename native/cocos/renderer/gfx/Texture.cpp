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

#include "Texture.h"
#include "platform/CCPlatformConfig.h"

namespace {

    struct GLFilter
    {
        GLuint min;
        GLuint mag;
        GLuint mip;
    };

    GLFilter _filterGL[] = {
        { GL_NEAREST, GL_NEAREST_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR },
        { GL_LINEAR, GL_LINEAR_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_LINEAR },
    };

#ifndef GL_COMPRESSED_RGB_ETC1_WEBGL
#define GL_COMPRESSED_RGB_ETC1_WEBGL 0x8D64
#endif

#ifndef GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG
#define GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG 0x8C00
#endif

#ifndef GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG
#define GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG 0x8C01
#endif

#ifndef GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
#define GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG 0x8C02
#endif

#ifndef GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
#define GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG 0x8C03
#endif

#ifndef GL_HALF_FLOAT_OES
#define GL_HALF_FLOAT_OES 0x8D61
#endif

#ifndef GL_COMPRESSED_RGB_S3TC_DXT1_EXT
#define GL_COMPRESSED_RGB_S3TC_DXT1_EXT 0x83F0   // ext.COMPRESSED_RGB_S3TC_DXT1_EXT
#endif

#ifndef GL_COMPRESSED_RGBA_S3TC_DXT1_EXT
#define GL_COMPRESSED_RGBA_S3TC_DXT1_EXT 0x83F1  // ext.COMPRESSED_RGBA_S3TC_DXT1_EXT
#endif

#ifndef GL_COMPRESSED_RGBA_S3TC_DXT3_EXT
#define GL_COMPRESSED_RGBA_S3TC_DXT3_EXT 0x83F2  // ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
#endif

#ifndef GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
#define GL_COMPRESSED_RGBA_S3TC_DXT5_EXT 0x83F3  // ext.COMPRESSED_RGBA_S3TC_DXT5_EXT
#endif

} // namespace {

RENDERER_BEGIN

Texture::GLTextureFmt Texture::_textureFmt[] = {
    // TEXTURE_FMT_RGB_DXT1: 0
    { GL_RGB, GL_COMPRESSED_RGB_S3TC_DXT1_EXT, 0, 3 },

    // TEXTURE_FMT_RGBA_DXT1: 1
    { GL_RGBA, GL_COMPRESSED_RGBA_S3TC_DXT1_EXT, 0, 4 },

    // TEXTURE_FMT_RGBA_DXT3: 2
    { GL_RGBA, GL_COMPRESSED_RGBA_S3TC_DXT3_EXT, 0, 8 },

    // TEXTURE_FMT_RGBA_DXT5: 3
    { GL_RGBA, GL_COMPRESSED_RGBA_S3TC_DXT5_EXT, 0, 8 },

    // TEXTURE_FMT_RGB_ETC1: 4
    { GL_RGB, GL_COMPRESSED_RGB_ETC1_WEBGL, 0, 0 },

    // TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5
    { GL_RGB, GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG, 0, 0 },

    // TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6
    { GL_RGBA, GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG, 0, 0 },

    // TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7
    { GL_RGB, GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG, 0, 0 },

    // TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8
    { GL_RGBA, GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG, 0, 0 },

    // TEXTURE_FMT_A8: 9
    { GL_ALPHA, GL_ALPHA, GL_UNSIGNED_BYTE, 8 },

    // TEXTURE_FMT_L8: 10
    { GL_LUMINANCE, GL_LUMINANCE, GL_UNSIGNED_BYTE, 8 },

    // TEXTURE_FMT_L8_A8: 11
    { GL_LUMINANCE_ALPHA, GL_LUMINANCE_ALPHA, GL_UNSIGNED_BYTE, 16 },

    // TEXTURE_FMT_R5_G6_B5: 12
    { GL_RGB, GL_RGB, GL_UNSIGNED_SHORT_5_6_5,  16 },

    // TEXTURE_FMT_R5_G5_B5_A1: 13
    { GL_RGBA, GL_RGBA, GL_UNSIGNED_SHORT_5_5_5_1, 16 },

    // TEXTURE_FMT_R4_G4_B4_A4: 14
    { GL_RGBA, GL_RGBA, GL_UNSIGNED_SHORT_4_4_4_4, 16 },

    // TEXTURE_FMT_RGB8: 15
    { GL_RGB, GL_RGB, GL_UNSIGNED_BYTE, 24 },

    // TEXTURE_FMT_RGBA8: 16
    { GL_RGBA, GL_RGBA, GL_UNSIGNED_BYTE, 32 },

    // TEXTURE_FMT_RGB16F: 17
    { GL_RGB, GL_RGB, GL_HALF_FLOAT_OES, 0 },

    // TEXTURE_FMT_RGBA16F: 18
    { GL_RGBA, GL_RGBA, GL_HALF_FLOAT_OES, 0 },

    // TEXTURE_FMT_RGB32F: 19
    { GL_RGB, GL_RGB, GL_FLOAT, 96},

    // TEXTURE_FMT_RGBA32F: 20
    { GL_RGBA, GL_RGBA, GL_FLOAT, 128 },

    // TEXTURE_FMT_R32F: 21
    { 0, 0, 0, 0 },

    // TEXTURE_FMT_111110F: 22
    { 0, 0, 0, 0 },

    // TEXTURE_FMT_SRGB: 23
    { 0, 0, 0, 0 },

    // TEXTURE_FMT_SRGBA: 24
    { 0, 0, 0, 0 },
    
    // TEXTURE_FMT_D16: 25
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    { GL_DEPTH_COMPONENT, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT, 32 },
#else
    { GL_DEPTH_COMPONENT, GL_DEPTH_COMPONENT16, GL_UNSIGNED_SHORT, 16 },
#endif

    // TEXTURE_FMT_D24S8: 25
    { 0, 0, 0, 0 },
};

Texture::Texture()
: _device(nullptr)
, _anisotropy(1)
, _target(0)
, _wrapS(WrapMode::REPEAT)
, _wrapT(WrapMode::REPEAT)
, _width(4)
, _height(4)
, _minFilter(Filter::LINEAR)
, _magFilter(Filter::LINEAR)
, _mipFilter(Filter::LINEAR)
, _format(Format::RGBA8)
, _hasMipmap(false)
, _compressed(false)
{

}

Texture::~Texture()
{
    if (_glID == 0)
    {
        RENDERER_LOGE("Invalid texture: %p", this);
        return;
    }

    glDeleteTextures(1, &_glID);

    //TODO:    this._device._stats.tex -= this.bytes;
}

bool Texture::init(DeviceGraphics* device)
{
    _device = device;
    _width = 4;
    _height = 4;
    _hasMipmap = false;
    _compressed = false;

    _anisotropy = 1;
    _minFilter = Filter::LINEAR;
    _magFilter = Filter::LINEAR;
    _mipFilter = Filter::LINEAR;
    _wrapS = WrapMode::REPEAT;
    _wrapT = WrapMode::REPEAT;
    // wrapR available in webgl2
    // _wrapR = WrapMode::REPEAT;
    _format = Format::RGBA8;

    _target = -1;
    return true;
}

GLenum Texture::glFilter(Filter filter, Filter mipFilter/* = TextureFilter::NONE*/)
{
    if (filter < Filter::NEAREST || filter > Filter::LINEAR)
    {
        RENDERER_LOGW("Unknown filter: %u", (uint32_t)filter);
        return mipFilter == Filter::NONE ? GL_LINEAR : GL_LINEAR_MIPMAP_LINEAR;
    }

    if (mipFilter < Filter::NONE || mipFilter > Filter::LINEAR)
    {
        RENDERER_LOGW("Unknown mipFilter: %u", (uint32_t)filter);
        return mipFilter == Filter::NONE ? GL_LINEAR : GL_LINEAR_MIPMAP_LINEAR;
    }

    const GLFilter& p = _filterGL[(uint8_t)filter];
    GLenum ret = p.min;
    if (mipFilter == Filter::NEAREST)
        ret = p.mag;
    else if (mipFilter == Filter::LINEAR)
        ret = p.mip;
    return ret;
}

const Texture::GLTextureFmt& Texture::glTextureFmt(Format fmt)
{
    if (fmt < Format::BEGIN || fmt > Format::END)
    {
        return _textureFmt[(uint8_t)Format::RGBA8];
    }

    return _textureFmt[(uint8_t)fmt];
}

RENDERER_END
