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
#include "CCGLUtils.h"
#include "platform/CCApplication.h"
#include <stdio.h>
#include <cfloat>
#include <cassert>
#include <array>

NS_CC_BEGIN

// todo: use gl to get the supported number
#define MAX_ATTRIBUTE_UNIT  16
#define MAX_TEXTURE_UNIT 32

//IDEA: Consider to use variable to enable/disable cache state since using macro will not be able to close it if there're serious bugs.
//#undef CC_ENABLE_GL_STATE_CACHE
//#define CC_ENABLE_GL_STATE_CACHE 0


namespace
{
    GLint __currentVertexBuffer = -1;
    GLint __currentIndexBuffer = -1;
    GLint __currentVertexArray = -1;
    
    uint32_t __enabledVertexAttribArrayFlag = 0;
    VertexAttributePointerInfo __enabledVertexAttribArrayInfo[MAX_ATTRIBUTE_UNIT];
    
    uint8_t __currentActiveTextureUnit = 0;
    std::array<BoundTextureInfo, MAX_TEXTURE_UNIT> __boundTextureInfos;

    GLint _currentUnpackAlignment = -1;

    bool __unpackFlipY = false;
    bool __premultiplyAlpha = false;

    GLuint __currentOffScreenFbo = 0;
}


//IDEA: need to consider invoking this after restarting game.
void ccInvalidateStateCache()
{
    __currentVertexBuffer = -1;
    __currentIndexBuffer = -1;
    __currentVertexArray = -1;
    
    __enabledVertexAttribArrayFlag = 0;
    for (int i = 0; i < MAX_ATTRIBUTE_UNIT; ++i)
        __enabledVertexAttribArrayInfo[i] = VertexAttributePointerInfo();

    _currentUnpackAlignment = -1;
    __unpackFlipY = false;
    __premultiplyAlpha = false;
}

/****************************************************************************************
 Texture related
 ***************************************************************************************/
void ccActiveTexture(GLenum texture)
{
#if CC_ENABLE_GL_STATE_CACHE
    auto activeTextureUnit = texture - GL_TEXTURE0;
    if(activeTextureUnit < MAX_TEXTURE_UNIT && activeTextureUnit >= 0)
    {
       __currentActiveTextureUnit = activeTextureUnit;
    }
#endif
    glActiveTexture(texture);
}

void ccBindTexture(GLenum target, GLuint texture)
{
#if CC_ENABLE_GL_STATE_CACHE
    auto& boundTextureInfo = __boundTextureInfos[__currentActiveTextureUnit];
    //todo: support cache
    if (boundTextureInfo.texture != texture || boundTextureInfo.target != target) {
        boundTextureInfo.texture = texture;
        boundTextureInfo.target = target;
    }
    glBindTexture(target, texture);
#else
    glBindTexture(target, texture);
#endif
}

BoundTextureInfo* getBoundTextureInfo(uint32_t textureUnit)
{
    return &__boundTextureInfos[textureUnit];
}

/****************************************************************************************
 FrameBuffer related
 ***************************************************************************************/

void ccBindFramebuffer(GLenum target,GLuint buffer)
{
    if(Application::getInstance()->isDownsampleEnabled())
    {
        if(target == GL_FRAMEBUFFER && buffer == Application::getInstance()->getMainFBO())
        {
            buffer = __currentOffScreenFbo;
        }
    }

    glBindFramebuffer(target , buffer);
}

void ccActiveOffScreenFramebuffer(GLuint offscreenFbo)
{
    __currentOffScreenFbo = offscreenFbo;
}

/****************************************************************************************
 Buffer related
 ***************************************************************************************/

void ccBindBuffer(GLenum target, GLuint buffer)
{
#if CC_ENABLE_GL_STATE_CACHE
    if (target == GL_ARRAY_BUFFER)
    {
        if (__currentVertexBuffer != buffer)
        {
            __currentVertexBuffer = buffer;
            glBindBuffer(target, buffer);
        }
    }
    else if (target == GL_ELEMENT_ARRAY_BUFFER)
    {
        if (__currentIndexBuffer != buffer)
        {
            __currentIndexBuffer = buffer;
            glBindBuffer(target, buffer);
        }
    }
    else
    {
        glBindBuffer(target, buffer);
    }
#else
    // Should cache it, ccVertexAttribPointer depends on it.
    __currentVertexBuffer = buffer;
    
    glBindBuffer(target, buffer);
#endif
}

void ccDeleteBuffers(GLsizei n, const GLuint * buffers)
{
    for (GLsizei i = 0; i < n; ++i)
    {
        if (buffers[i] == __currentVertexBuffer)
            __currentVertexBuffer = -1;
        else if (buffers[i] == __currentIndexBuffer)
            __currentIndexBuffer = -1;
    }
    glDeleteBuffers(n, buffers);
}

GLint ccGetBoundVertexBuffer()
{
    return __currentVertexBuffer;
}

GLint ccGetBoundIndexBuffer()
{
    return __currentIndexBuffer;
}

void ccBindVertexArray(GLuint VAO)
{
#if CC_ENABLE_GL_STATE_CACHE
    if (__currentVertexArray != VAO)
    {
        __currentVertexArray = VAO;
        glBindVertexArray(VAO);
    }
#else
    __currentVertexArray = VAO;
    glBindVertexArray(VAO);
#endif
}

GLint ccGetBoundVertexArray()
{
    return __currentVertexArray;
}

/****************************************************************************************
 Vertex attribute related
 ***************************************************************************************/

void ccEnableVertexAttribArray(GLuint index)
{
    assert(index < MAX_ATTRIBUTE_UNIT);
    if (index >= MAX_ATTRIBUTE_UNIT)
        return;

    uint32_t flag = 1 << index;
    if (__enabledVertexAttribArrayFlag & flag)
        return;

    __enabledVertexAttribArrayFlag |= flag;
    glEnableVertexAttribArray(index);
}

void ccDisableVertexAttribArray(GLuint index)
{
    if (index >= MAX_ATTRIBUTE_UNIT)
        return;
    uint32_t flag = 1 << index;
    if (__enabledVertexAttribArrayFlag & flag)
    {
        glDisableVertexAttribArray(index);
        __enabledVertexAttribArrayFlag &= ~(1 << index);
    }
}

void ccVertexAttribPointer(GLuint index, GLint size, GLenum type, GLboolean normalized, GLsizei stride, const GLvoid* pointer)
{
    assert(index < MAX_ATTRIBUTE_UNIT);
    if (index >= MAX_ATTRIBUTE_UNIT)
        return;

    __enabledVertexAttribArrayInfo[index] = VertexAttributePointerInfo(__currentVertexBuffer, index, size, type, normalized, stride, pointer);

    // IDEA: should check all the values to determine if need to invoke glVertexAttribPointer or not?
    // We don't know if it is a good idea to do it because it needs to compare so many parameters.
    glVertexAttribPointer(index, size, type, normalized, stride, pointer);
}

const VertexAttributePointerInfo* getVertexAttribPointerInfo(GLuint index)
{
    assert(index < MAX_ATTRIBUTE_UNIT);
    if (index >= MAX_ATTRIBUTE_UNIT)
        return nullptr;
    
    // The index is not enabled, return null.
    if (! (__enabledVertexAttribArrayFlag & (1 << index)) )
        return nullptr;
    
    return &__enabledVertexAttribArrayInfo[index];
}

/****************************************************************************************
 Other functions.
 ***************************************************************************************/

void ccViewport(GLint x, GLint y, GLsizei width, GLsizei height)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    GLint currentFBO;
    glGetIntegerv(GL_FRAMEBUFFER_BINDING, &currentFBO);
    if (currentFBO == Application::getInstance()->getMainFBO())
    {
        float scale = Application::getInstance()->getScreenScale();
        x *= scale;
        y *= scale;
        width *= scale;
        height *= scale;
    }
#endif
    glViewport(x, y, width, height);
}

void ccScissor(GLint x, GLint y, GLsizei width, GLsizei height)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    GLint currentFBO;
    glGetIntegerv(GL_FRAMEBUFFER_BINDING, &currentFBO);
    if (currentFBO == Application::getInstance()->getMainFBO())
    {
        float scale = Application::getInstance()->getScreenScale();
        x *= scale;
        y *= scale;
        width *= scale;
        height *= scale;
    }
#endif
    glScissor(x, y, width, height);
}

//IDEA:: ONLY SUPPORT RGBA format now.
static void flipPixelsY(GLubyte *pixels, int bytesPerRow, int rows)
{
    if( !pixels ) { return; }

    GLuint middle = rows/2;
    GLuint intsPerRow = bytesPerRow / sizeof(GLuint);
    GLuint remainingBytes = bytesPerRow - intsPerRow * sizeof(GLuint);

    for( GLuint rowTop = 0, rowBottom = rows-1; rowTop < middle; rowTop++, rowBottom-- ) {

        // Swap bytes in packs of sizeof(GLuint) bytes
        GLuint *iTop = (GLuint *)(pixels + rowTop * bytesPerRow);
        GLuint *iBottom = (GLuint *)(pixels + rowBottom * bytesPerRow);

        GLuint itmp;
        GLint n = intsPerRow;
        do {
            itmp = *iTop;
            *iTop++ = *iBottom;
            *iBottom++ = itmp;
        } while(--n > 0);

        // Swap the remaining bytes
        GLubyte *bTop = (GLubyte *)iTop;
        GLubyte *bBottom = (GLubyte *)iBottom;

        GLubyte btmp;
        switch( remainingBytes ) {
            case 3: btmp = *bTop; *bTop++ = *bBottom; *bBottom++ = btmp;
            case 2: btmp = *bTop; *bTop++ = *bBottom; *bBottom++ = btmp;
            case 1: btmp = *bTop; *bTop = *bBottom; *bBottom = btmp;
        }
    }
}

static void flipPixelsYByFormat(GLubyte *pixels, GLenum format, uint32_t width, uint32_t height, uint32_t expectedTotalBytes)
{
    bool isSupportFlipY = true;
    GLsizei bytesPerRow = 0;
    switch (format) {
        case GL_RGBA:
            bytesPerRow = width * 4;
            break;
        case GL_RGB:
            bytesPerRow = width * 3;
            break;
        case GL_LUMINANCE_ALPHA:
            bytesPerRow = width * 2;
            break;
        case GL_LUMINANCE:
            bytesPerRow = width;
            break;
        default:
            isSupportFlipY = false;
            break;
    }

    if (isSupportFlipY)
    {
        assert(expectedTotalBytes == bytesPerRow * height);
        flipPixelsY((GLubyte*)pixels, bytesPerRow, height);
    }
    else
    {
        CCLOGERROR("flipPixelsYByFormat: format: 0x%X doesn't support upackFlipY!\n", format);
    }
}

// Lookup tables for fast [un]premultiplied alpha color values
// From https://bugzilla.mozilla.org/show_bug.cgi?id=662130
static GLubyte* __premultiplyTable = nullptr;

static const GLubyte* premultiplyTable()
{
    if( !__premultiplyTable ) {
        __premultiplyTable = (GLubyte*)malloc(256*256);

        unsigned char *data = __premultiplyTable;
        for( int a = 0; a <= 255; a++ ) {
            for( int c = 0; c <= 255; c++ ) {
                data[a*256+c] = (a * c + 254) / 255;
            }
        }
    }

    return __premultiplyTable;
}

void premultiplyPixels(const GLubyte *inPixels, GLubyte *outPixels, GLenum format, uint32_t width, uint32_t height, uint32_t expectedTotalBytes)
{
    const GLubyte *table = premultiplyTable();
    int byteLength = 0;
    if( format == GL_RGBA )
    {
        byteLength = width * height * 4;
        assert(byteLength == expectedTotalBytes);
        for( int i = 0; i < byteLength; i += 4 ) {
            unsigned short a = inPixels[i+3] * 256;
            outPixels[i+0] = table[ a + inPixels[i+0] ];
            outPixels[i+1] = table[ a + inPixels[i+1] ];
            outPixels[i+2] = table[ a + inPixels[i+2] ];
            outPixels[i+3] = inPixels[i+3];
        }
    }
    else if ( format == GL_LUMINANCE_ALPHA )
    {
        byteLength = width * height * 2;
        assert(byteLength == expectedTotalBytes);
        for( int i = 0; i < byteLength; i += 2 ) {
            unsigned short a = inPixels[i+1] * 256;
            outPixels[i+0] = table[ a + inPixels[i+0] ];
            outPixels[i+1] = inPixels[i+1];
        }
    }
    else
    {
        CCLOGERROR("premultiplyPixels: format: 0x%X doesn't support upackFlipY!\n", format);
    }
}

bool ccIsUnpackFlipY()
{
    return __unpackFlipY;
}

bool ccIsPremultiplyAlpha()
{
    return __premultiplyAlpha;
}

void ccPixelStorei(GLenum pname, GLint param)
{
    if (pname == GL_UNPACK_FLIP_Y_WEBGL)
    {
        __unpackFlipY = param == 0 ? false : true;
        return;
    }
    else if (pname == GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL)
    {
        __premultiplyAlpha = param == 0 ? false : true;
        return;
    }
    else if (pname == GL_UNPACK_COLORSPACE_CONVERSION_WEBGL)
    {
        CCLOGERROR("Warning: UNPACK_COLORSPACE_CONVERSION_WEBGL is unsupported\n");
        return;
    }
    else if (pname == GL_UNPACK_ALIGNMENT)
    {
#if CC_ENABLE_GL_STATE_CACHE
        if (_currentUnpackAlignment != param)
        {
            glPixelStorei(pname, param);
            _currentUnpackAlignment = param;
        }
#else
        glPixelStorei(pname, param);
#endif
    }
    else
    {
        glPixelStorei(pname, param);
    }
}

void ccFlipYOrPremultiptyAlphaIfNeeded(GLenum format, GLsizei width, GLsizei height, uint32_t pixelBytes, GLvoid* pixels)
{
    if (pixels != nullptr)
    {
        if (__unpackFlipY)
        {
            flipPixelsYByFormat((GLubyte*)pixels, format, width, height, pixelBytes);
        }

        if (__premultiplyAlpha)
        {
            premultiplyPixels((GLubyte*)pixels, (GLubyte*)pixels, format, width, height, pixelBytes);
        }
    }
}

GLint ccGetBufferDataSize()
{
    GLint result = 0, size = 0;
    for( int i = 0; i < MAX_ATTRIBUTE_UNIT; i++ ) {
        const VertexAttributePointerInfo *info = getVertexAttribPointerInfo(i);
        if (info != nullptr && info->VBO == __currentVertexBuffer) {
            switch (info->type)
            {
                case GL_BYTE:
                case GL_UNSIGNED_BYTE:
                    size = info->size * sizeof(GLbyte);
                    break;
                case GL_SHORT:
                case GL_UNSIGNED_SHORT:
                    size = info->size * sizeof(GLshort);
                    break;
                case GL_FLOAT:
                    size = info->size * sizeof(GLclampf);
                    break;
                default:
                    size = 0;
                    break;
            }

            result += size;
        }
    }

    return result;
}

NS_CC_END
