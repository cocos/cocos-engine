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
#include <stdio.h>

NS_CC_BEGIN

// #undef CC_ENABLE_GL_STATE_CACHE
// #define CC_ENABLE_GL_STATE_CACHE 0

#if CC_ENABLE_GL_STATE_CACHE

namespace {
    const int MAX_ACTIVE_TEXTURE = 16;
    GLuint __currentArrayBufferId = -1;
    GLuint __currentElementArrayBufferId = -1;
    GLuint __activeTextureUnit = 0;
    GLuint __currentBoundTexture[MAX_ACTIVE_TEXTURE] =  {
        (GLuint)-1,(GLuint)-1,(GLuint)-1,(GLuint)-1,
        (GLuint)-1,(GLuint)-1,(GLuint)-1,(GLuint)-1,
        (GLuint)-1,(GLuint)-1,(GLuint)-1,(GLuint)-1,
        (GLuint)-1,(GLuint)-1,(GLuint)-1,(GLuint)-1
    };
}

#endif // CC_ENABLE_GL_STATE_CACHE

//FIXME: need to consider invoking this after restarting game.
void ccInvalidateStateCache()
{
#if CC_ENABLE_GL_STATE_CACHE
    __currentArrayBufferId = -1;
    __currentElementArrayBufferId = -1;
    __activeTextureUnit = 0;
    for (int i = 0; i < MAX_ACTIVE_TEXTURE; ++i)
    {
        __currentBoundTexture[i] = -1;
    };
#endif
}

void ccBindBuffer(GLenum target, GLuint buffer)
{
#if CC_ENABLE_GL_STATE_CACHE
    if (target == GL_ARRAY_BUFFER)
    {
        if (buffer == 0)
            return;
        if (__currentArrayBufferId != buffer)
        {
            __currentArrayBufferId = buffer;
            glBindBuffer(target, buffer);
        }
//        else
//        {
//            printf("glBindBuffer(GL_ARRAY_BUFFER, %u) isn't needed!\n", buffer);
//        }
    }
    else if (target == GL_ELEMENT_ARRAY_BUFFER)
    {
        if (buffer == 0)
            return;
        if (__currentElementArrayBufferId != buffer)
        {
            __currentElementArrayBufferId = buffer;
            glBindBuffer(target, buffer);
        }
//        else
//        {
//            printf("glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, %u) isn't needed!\n", buffer);
//        }
    }
    else
    {
        glBindBuffer(target, buffer);
    }
#else
    glBindBuffer(target, buffer);
#endif
}

void ccDeleteBuffers(GLsizei n, const GLuint *buffers)
{
#if CC_ENABLE_GL_STATE_CACHE
    for (GLsizei i = 0; i < n; ++i)
    {
        if (buffers[i] == __currentArrayBufferId)
            __currentArrayBufferId = -1;
        else if (buffers[i] == __currentElementArrayBufferId)
            __currentElementArrayBufferId = -1;
    }
#endif
    glDeleteBuffers(n, buffers);
}

void ccActiveTexture(GLenum texture)
{
#if CC_ENABLE_GL_STATE_CACHE
    GLuint newTextureUnit = texture - GL_TEXTURE0;
    if (__activeTextureUnit != newTextureUnit)
    {
        __activeTextureUnit = newTextureUnit;
        glActiveTexture(texture);
    }
#else
    glActiveTexture(texture);
#endif
}

void ccBindTexture(GLenum target, GLuint texture)
{
#if CC_ENABLE_GL_STATE_CACHE
    if (target == GL_TEXTURE_2D)
    {
        CCASSERT(__activeTextureUnit < MAX_ACTIVE_TEXTURE, "textureUnit is too big");
        if (__currentBoundTexture[__activeTextureUnit] != texture)
        {
            __currentBoundTexture[__activeTextureUnit] = texture;
            glBindTexture(target, texture);
        }
//        else
//        {
//            printf("glBindTexture(GL_TEXTURE_2D, %u) isn't needed!\n", texture);
//        }
    }
    else
    {
        glBindTexture(target, texture);
    }
#else
    glBindTexture(target, texture);
#endif
}

void ccDeleteTextures(GLsizei n, const GLuint *textures)
{
#if CC_ENABLE_GL_STATE_CACHE
    for (size_t i = 0; i < MAX_ACTIVE_TEXTURE; ++i)
    {
        for (GLsizei j = 0; j < n; ++j)
        {
            if (__currentBoundTexture[i] == textures[j])
                __currentBoundTexture[i] = -1;
        }
    }
#endif // CC_ENABLE_GL_STATE_CACHE

    glDeleteTextures(n, textures);
}

NS_CC_END
