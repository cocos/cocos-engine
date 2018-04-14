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

namespace {
    const int MAX_ACTIVE_TEXTURE = 16;
    GLuint __currentArrayBufferId = -1;
    GLuint __currentElementArrayBufferId = -1;
    GLenum __activeTexture = -1;
    GLuint __currentBoundTexture[MAX_ACTIVE_TEXTURE] =  {
        (GLuint)-1,(GLuint)-1,(GLuint)-1,(GLuint)-1,
        (GLuint)-1,(GLuint)-1,(GLuint)-1,(GLuint)-1,
        (GLuint)-1,(GLuint)-1,(GLuint)-1,(GLuint)-1,
        (GLuint)-1,(GLuint)-1,(GLuint)-1,(GLuint)-1
    };
}

void ccActiveTexture(GLenum texture)
{
    if (__activeTexture != texture)
    {
        __activeTexture = texture;
        glActiveTexture(__activeTexture);
    }
}

void ccBindBuffer(GLenum target, GLuint buffer)
{
    if (target == GL_ARRAY_BUFFER)
    {
        if (__currentArrayBufferId != buffer)
        {
            __currentArrayBufferId = buffer;
            glBindBuffer(target, buffer);
        }
        else
        {
            printf("glBindBuffer(GL_ARRAY_BUFFER, %u) isn't needed!\n", buffer);
        }
    }
    else if (target == GL_ELEMENT_ARRAY_BUFFER)
    {
        if (__currentElementArrayBufferId != buffer)
        {
            __currentElementArrayBufferId = buffer;
            glBindBuffer(target, buffer);
        }
        else
        {
            printf("glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, %u) isn't needed!\n", buffer);
        }
    }
    else
    {
        glBindBuffer(target, buffer);
    }
}

void ccBindTexture(GLenum target, GLuint texture)
{
    if (target == GL_TEXTURE_2D)
    {
        GLuint textureUnit = __activeTexture - GL_TEXTURE0;
        CCASSERT(textureUnit < MAX_ACTIVE_TEXTURE, "textureUnit is too big");
        if (__currentBoundTexture[textureUnit] != texture)
        {
            __currentBoundTexture[textureUnit] = texture;
            glBindTexture(target, texture);
        }
        else
        {
            printf("glBindTexture(GL_TEXTURE_2D, %u) isn't needed!\n", texture);
        }
    }
    else
    {
        glBindTexture(target, texture);
    }
}

NS_CC_END
