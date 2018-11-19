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

#include <stdint.h>
#include "base/ccMacros.h"
#include "platform/CCGL.h"

NS_CC_BEGIN

struct BoundTextureInfo
{
    GLenum target = GL_TEXTURE_2D;
    GLuint texture = 0;
};

void ccInvalidateStateCache();

void ccActiveTexture(GLenum texture);
void ccBindTexture(GLenum target, GLuint texture);
BoundTextureInfo* getBoundTextureInfo(uint32_t textureUnit);
void ccBindFramebuffer(GLenum target,GLuint buffer);
void ccActiveOffScreenFramebuffer(GLuint offscreenFbo);
void ccBindBuffer(GLenum target, GLuint buffer);
void ccDeleteBuffers(GLsizei, const GLuint * buffers);
GLint ccGetBoundVertexBuffer();
GLint ccGetBoundIndexBuffer();
void ccBindVertexArray(GLuint VAO);
GLint ccGetBoundVertexArray();

void ccViewport(GLint x, GLint y, GLsizei width, GLsizei height);
void ccScissor(GLint x, GLint y, GLsizei width, GLsizei height);

struct VertexAttributePointerInfo
{
    VertexAttributePointerInfo(GLuint VBO, GLuint index, GLint size, GLenum type, GLboolean normalized, GLsizei stride, const GLvoid* pointer)
    : VBO(VBO)
    , index(index)
    , size(size)
    , type(type)
    , normalized(normalized)
    , stride(stride)
    , pointer(pointer)
    {}
    
    VertexAttributePointerInfo() {}
    
    GLuint index = 0;
    // The VBO this attribute bind to.
    GLuint VBO = 0;
    GLint size = 0;
    GLenum type = GL_UNSIGNED_BYTE;
    GLboolean normalized = false;
    GLsizei stride = 0;
    const GLvoid* pointer = nullptr;
};
void ccEnableVertexAttribArray(GLuint index);
void ccDisableVertexAttribArray(GLuint index);
void ccVertexAttribPointer(GLuint, GLint, GLenum, GLboolean, GLsizei, const GLvoid*);
const VertexAttributePointerInfo* getVertexAttribPointerInfo(GLuint index);

//  Converts pixel if unpackFlipY or premultiplyAlpha is true.
void ccFlipYOrPremultiptyAlphaIfNeeded(GLenum format, GLsizei width, GLsizei height, uint32_t pixelBytes, GLvoid* pixels);

bool ccIsUnpackFlipY();
bool ccIsPremultiplyAlpha();
void ccPixelStorei(GLenum pname, GLint param);
GLint ccGetBufferDataSize();

NS_CC_END
