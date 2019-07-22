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
#include "base/CCGLUtils.h"

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

} // namespace {

RENDERER_BEGIN

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

    //REFINE:    this._device._stats.tex -= this.bytes;
}

bool Texture::init(DeviceGraphics* device)
{
    if (device == nullptr)
    {
        return false;
    }
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

RENDERER_END
