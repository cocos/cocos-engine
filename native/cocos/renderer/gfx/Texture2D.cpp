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

#include "Texture2D.h"
#include "DeviceGraphics.h"
#include "GFXUtils.h"

#include "base/CCGLUtils.h"

RENDERER_BEGIN

Texture2D::Texture2D()
{
//    RENDERER_LOGD("Construct Texture2D: %p", this);
}

Texture2D::~Texture2D()
{
//    RENDERER_LOGD("Destruct Texture2D: %p", this);
}

bool Texture2D::init(DeviceGraphics* device, Options& options)
{
    bool ok = Texture::init(device);
    if (ok)
    {
        _target = GL_TEXTURE_2D;
        GL_CHECK(glGenTextures(1, &_glID));

        if (options.images.empty())
            options.images.push_back(Image());

        update(options);
    }
    return ok;
}

void Texture2D::update(const Options& options)
{
    bool genMipmap = _hasMipmap;

    _width = options.width;
    _height = options.height;
    _anisotropy = options.anisotropy;
    _minFilter = options.minFilter;
    _magFilter = options.magFilter;
    _mipFilter = options.mipFilter;
    _wrapS = options.wrapS;
    _wrapT = options.wrapT;
    _glFormat = options.glFormat;
    _glInternalFormat = options.glInternalFormat;
    _glType = options.glType;
    _compressed = options.compressed;
    _bpp = options.bpp;

    // check if generate mipmap
    _hasMipmap = options.hasMipmap;
    genMipmap = options.hasMipmap;

    if (options.images.size() > 1)
    {
        genMipmap = false; //REFINE: is it true here?
        uint16_t maxLength = options.width > options.height ? options.width : options.height;
        if (maxLength >> (options.images.size() - 1) != 1)
            RENDERER_LOGE("texture-2d mipmap is invalid, should have a 1x1 mipmap.");
    }

    // NOTE: get pot after _width, _height has been assigned.
    bool pot = isPow2(_width) && isPow2(_height);
    if (!pot)
        genMipmap = false;

    GL_CHECK(glActiveTexture(GL_TEXTURE0));
    GL_CHECK(glBindTexture(GL_TEXTURE_2D, _glID));
    if (!options.images.empty())
        setMipmap(options.images, options.flipY, options.premultiplyAlpha);

    setTexInfo();

    if (genMipmap)
    {
        GL_CHECK(glHint(GL_GENERATE_MIPMAP_HINT, GL_NICEST));
        GL_CHECK(glGenerateMipmap(GL_TEXTURE_2D));
    }
    _device->restoreTexture(0);
}

void Texture2D::updateSubImage(const SubImageOption& option)
{
    GL_CHECK(glActiveTexture(GL_TEXTURE0));
    GL_CHECK(glBindTexture(GL_TEXTURE_2D, _glID));
    setSubImage(option);
    _device->restoreTexture(0);
}

void Texture2D::updateImage(const ImageOption& option)
{
    GL_CHECK(glActiveTexture(GL_TEXTURE0));
    GL_CHECK(glBindTexture(GL_TEXTURE_2D, _glID));
    setImage(option);
    _device->restoreTexture(0);
}

// Private methods:

void Texture2D::setSubImage(const SubImageOption& option)
{
    bool flipY = option.flipY;
    bool premultiplyAlpha = option.premultiplyAlpha;

    //Set the row align only when mipmapsNum == 1 and the data is uncompressed
    GLint aligment = 1;
    if (!_hasMipmap && !_compressed && _bpp > 0)
    {
        unsigned int bytesPerRow = option.width * _bpp / 8;

        if (bytesPerRow % 8 == 0)
            aligment = 8;
        else if (bytesPerRow % 4 == 0)
            aligment = 4;
        else if (bytesPerRow % 2 == 0)
            aligment = 2;
        else
            aligment = 1;
    }

    GL_CHECK(ccPixelStorei(GL_UNPACK_ALIGNMENT, aligment));

    GL_CHECK(ccPixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flipY));
    GL_CHECK(ccPixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha));
    
    ccFlipYOrPremultiptyAlphaIfNeeded(_glFormat, option.width, option.height, (uint32_t)option.imageDataLength, option.imageData);

    if (_compressed)
    {
        glCompressedTexSubImage2D(GL_TEXTURE_2D,
                                  option.level,
                                  option.x,
                                  option.y,
                                  option.width,
                                  option.height,
                                  _glFormat,
                                  option.imageDataLength,
                                  option.imageData);
    }
    else
    {
        GL_CHECK(glTexSubImage2D(GL_TEXTURE_2D,
                                 option.level,
                                 option.x,
                                 option.y,
                                 option.width,
                                 option.height,
                                 _glFormat,
                                 _glType, option.imageData));
    }
}

void Texture2D::setImage(const ImageOption& option)
{
    const auto& img = option.image;

    bool flipY = option.flipY;
    bool premultiplyAlpha = option.premultiplyAlpha;

    //Set the row align only when mipmapsNum == 1 and the data is uncompressed
    GLint aligment = 1;
    unsigned int bytesPerRow = option.width * _bpp / 8;
    if (_hasMipmap && !_compressed && _bpp > 0)
    {
        if (bytesPerRow % 8 == 0)
            aligment = 8;
        else if (bytesPerRow % 4 == 0)
            aligment = 4;
        else if (bytesPerRow % 2 == 0)
            aligment = 2;
        else
            aligment = 1;
    }

    GL_CHECK(ccPixelStorei(GL_UNPACK_ALIGNMENT, aligment));
    GL_CHECK(ccPixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flipY));
    GL_CHECK(ccPixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha));
    
    uint32_t pixelBytes = (uint32_t)img.length;
    
    switch(_glType)
    {
        case GL_FLOAT:
        {
            pixelBytes /= sizeof(float);
            break;
        }
    }
    
    ccFlipYOrPremultiptyAlphaIfNeeded(_glFormat, option.width, option.height, pixelBytes, img.data);

    if (_compressed)
    {
        glCompressedTexImage2D(GL_TEXTURE_2D,
                               option.level,
                               _glInternalFormat,
                               option.width,
                               option.height,
                               0,
                               (GLsizei)img.length,
                               img.data);
    }
    else
    {
        GL_CHECK(glTexImage2D(GL_TEXTURE_2D,
                     option.level,
                     _glInternalFormat,
                     option.width,
                     option.height,
                     0,
                     _glFormat,
                     _glType,
                     img.data));
    }
}

void Texture2D::setMipmap(const std::vector<Image>& images, bool isFlipY, bool isPremultiplyAlpha)
{
    ImageOption options;
    options.width = _width;
    options.height = _height;
    options.flipY = isFlipY;
    options.premultiplyAlpha = isPremultiplyAlpha;
    options.level = 0;

    for (size_t i = 0, len = images.size(); i < len; ++i)
    {
        options.level = (GLint)i;
        options.width = _width >> i;
        options.height = _height >> i;
        options.image = images[i];
        setImage(options);
    }
}

void Texture2D::setTexInfo()
{
    bool pot = isPow2(_width) && isPow2(_height);

    // WebGL1 doesn't support all wrap modes with NPOT textures
    if (!pot && (_wrapS != WrapMode::CLAMP || _wrapT != WrapMode::CLAMP))
    {
        RENDERER_LOGW("WebGL1 doesn\'t support all wrap modes with NPOT textures");
        _wrapS = WrapMode::CLAMP;
        _wrapT = WrapMode::CLAMP;
    }

    Filter mipFilter = _hasMipmap ? _mipFilter : Filter::NONE;
    if (!pot && mipFilter != Filter::NONE)
    {
        RENDERER_LOGW("NPOT textures do not support mipmap filter");
        mipFilter = Filter::NONE;
    }

    GL_CHECK(glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, glFilter(_minFilter, mipFilter)));
    GL_CHECK(glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, glFilter(_magFilter, Filter::NONE)));
    GL_CHECK(glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, (GLint)_wrapS));
    GL_CHECK(glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, (GLint)_wrapT));

    //REFINE:    let ext = this._device.ext('EXT_texture_filter_anisotropic');
//    if (ext) {
//        GL_CHECK(glTexParameteri(GL_TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy));
//    }
}

RENDERER_END
