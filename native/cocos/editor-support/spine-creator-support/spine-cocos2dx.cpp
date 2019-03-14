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

#include "spine-creator-support/spine-cocos2dx.h"
#include "spine/extension.h"
#include "middleware-adapter.h"
#include "base/CCData.h"
#include "platform/CCFileUtils.h"

namespace spine {
    static CustomTextureLoader _customTextureLoader = nullptr;
    void spAtlasPage_setCustomTextureLoader (CustomTextureLoader texLoader)
    {
        _customTextureLoader = texLoader;
    }
}

USING_NS_CC;
USING_NS_MW;
using namespace spine;

GLuint wrap (spAtlasWrap wrap)
{
    return wrap == SP_ATLAS_CLAMPTOEDGE ? GL_CLAMP_TO_EDGE : GL_REPEAT;
}

GLuint filter (spAtlasFilter filter)
{
    switch (filter)
    {
    case SP_ATLAS_UNKNOWN_FILTER:
        break;
    case SP_ATLAS_NEAREST:
        return GL_NEAREST;
    case SP_ATLAS_LINEAR:
        return GL_LINEAR;
    case SP_ATLAS_MIPMAP:
        return GL_LINEAR_MIPMAP_LINEAR;
    case SP_ATLAS_MIPMAP_NEAREST_NEAREST:
        return GL_NEAREST_MIPMAP_NEAREST;
    case SP_ATLAS_MIPMAP_LINEAR_NEAREST:
        return GL_LINEAR_MIPMAP_NEAREST;
    case SP_ATLAS_MIPMAP_NEAREST_LINEAR:
        return GL_NEAREST_MIPMAP_LINEAR;
    case SP_ATLAS_MIPMAP_LINEAR_LINEAR:
        return GL_LINEAR_MIPMAP_LINEAR;
    }
    return GL_LINEAR;
}

void _spAtlasPage_createTexture (spAtlasPage* self, const char* path)
{
    Texture2D* texture = nullptr;
    if (spine::_customTextureLoader)
    {
        texture = spine::_customTextureLoader(path);
    }
    CCASSERT(texture != nullptr, "Invalid image");
    texture->retain();

    Texture2D::TexParams textureParams = {filter(self->minFilter), filter(self->magFilter), wrap(self->uWrap), wrap(self->vWrap)};
    texture->setTexParameters(textureParams);

    self->rendererObject = texture;
    self->width = texture->getPixelsWide();
    self->height = texture->getPixelsHigh();
}

void _spAtlasPage_disposeTexture (spAtlasPage* self)
{
    ((Texture2D*)self->rendererObject)->release();
}

char* _spUtil_readFile (const char* path, int* length)
{
    *length = 0;
    Data data = FileUtils::getInstance()->getDataFromFile(FileUtils::getInstance()->fullPathForFilename(path));
    if (data.isNull()) return 0;

    char *ret = (char*)malloc(sizeof(unsigned char) * data.getSize());
    memcpy(ret, (char*)data.getBytes(), data.getSize());
    *length = (int)data.getSize();
    return ret;
}
