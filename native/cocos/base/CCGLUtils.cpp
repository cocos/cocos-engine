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
#include <cfloat>
#include <cassert>
#include "platform/CCApplication.h"

NS_CC_BEGIN

// todo: use gl to get the supported number
#define MAX_ATTRIBUTE_UNIT  16

//FIXME: Consider to use variable to enable/disable cache state since using macro will not be able to close it if there're serious bugs.
// #undef CC_ENABLE_GL_STATE_CACHE
// #define CC_ENABLE_GL_STATE_CACHE 0

namespace
{
    GLint __currentVertexBuffer = -1;
    GLint __currentIndexBuffer = -1;
    GLint __currentVertexArray = -1;
    
    uint32_t __enabledVertexAttribArrayFlag = 0;
    VertexAttributePointerInfo __enabledVertexAttribArrayInfo[MAX_ATTRIBUTE_UNIT];
}

//FIXME: need to consider invoking this after restarting game.
void ccInvalidateStateCache()
{
    __currentVertexBuffer = -1;
    __currentIndexBuffer = -1;
    __currentVertexArray = -1;
    
    __enabledVertexAttribArrayFlag = 0;
    for (int i = 0; i < MAX_ATTRIBUTE_UNIT; ++i)
        __enabledVertexAttribArrayInfo[i] = VertexAttributePointerInfo();
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
#if CC_ENABLE_GL_STATE_CACHE
    for (GLsizei i = 0; i < n; ++i)
    {
        if (buffers[i] == __currentVertexBuffer)
            __currentVertexBuffer = -1;
        else if (buffers[i] == __currentIndexBuffer)
            __currentIndexBuffer = -1;
    }
    glDeleteBuffers(n, buffers);
#else
    glDeleteBuffers(n, buffers);
#endif
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
#if CC_ENABLE_GL_STATE_CACHE
    assert(index < MAX_ATTRIBUTE_UNIT);
    if (index >= MAX_ATTRIBUTE_UNIT)
        return;

    uint32_t flag = 1 << index;
    if (__enabledVertexAttribArrayFlag & flag)
        return;

    __enabledVertexAttribArrayFlag |= flag;
    glEnableVertexAttribArray(index);
#else
    glEnableVertexAttribArray(index);
#endif
}

void ccDisableVertexAttribArray(GLuint index)
{
#if CC_ENABLE_GL_STATE_CACHE
    if (index >= MAX_ATTRIBUTE_UNIT)
        return;
    uint32_t flag = 1 << index;
    if (__enabledVertexAttribArrayFlag & flag)
    {
        glDisableVertexAttribArray(index);
        __enabledVertexAttribArrayFlag &= ~(1 << index);
    }
#else
    glDisableVertexAttribArray(index);
#endif
}

void ccVertexAttribPointer(GLuint index, GLint size, GLenum type, GLboolean normalized, GLsizei stride, const GLvoid* pointer)
{
#if CC_ENABLE_GL_STATE_CACHE
    assert(index < MAX_ATTRIBUTE_UNIT);
    if (index >= MAX_ATTRIBUTE_UNIT)
        return;

    // The index is not enabled, return.
    if (! (__enabledVertexAttribArrayFlag & (1 << index)) )
        return;
#endif
    __enabledVertexAttribArrayInfo[index] = VertexAttributePointerInfo(__currentVertexBuffer, index, size, type, normalized, stride, pointer);

    // FIXME: should check all the values to determine if need to invoke glVertexAttribPointer or not?
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

NS_CC_END
