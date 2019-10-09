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

#include "VertexBuffer.h"
#include "DeviceGraphics.h"
#include "base/CCGLUtils.h"

RENDERER_BEGIN

VertexBuffer::VertexBuffer()
: _device(nullptr)
, _usage(Usage::STATIC)
, _numVertices(0)
, _bytes(0)
{

}

VertexBuffer::~VertexBuffer()
{
    destroy();
}

bool VertexBuffer::init(DeviceGraphics* device, VertexFormat* format, Usage usage, const void* data, size_t dataByteLength, uint32_t numVertices)
{
    _device = device;
    setFormat(format);
    _usage = usage;
    _numVertices = numVertices;

    // calculate bytes
    _bytes = _format->_bytes * numVertices;

    // update
    glGenBuffers(1, &_glID);
    update(0, data, dataByteLength);

    // stats
    //REFINE:    device._stats.ib += _bytes;

    return true;
}

void VertexBuffer::setFormat(VertexFormat* format)
{
    if (_format == format)
        return;
    
    CC_SAFE_RELEASE(_format);
    _format = format;
    CC_SAFE_RETAIN(_format);
    
}

void VertexBuffer::update(uint32_t offset, const void* data, size_t dataByteLength)
{
    if (_glID == 0)
    {
        RENDERER_LOGE("The buffer is destroyed");
        return;
    }

    if (data && dataByteLength + offset > _bytes) {
        RENDERER_LOGE("Failed to update vertex buffer data, bytes exceed.");
        return;
    }

    GLenum glUsage = (GLenum)_usage;
    ccBindBuffer(GL_ARRAY_BUFFER, _glID);
    if (!data)
    {
        glBufferData(GL_ARRAY_BUFFER, _bytes, nullptr, glUsage);
    }
    else
    {
        if (offset > 0)
        {
            glBufferSubData(GL_ARRAY_BUFFER, (GLintptr)offset, (GLsizeiptr)dataByteLength, (const GLvoid*)data);
        }
        else
        {
            glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)dataByteLength, data, glUsage);
        }
    }
    ccBindBuffer(GL_ARRAY_BUFFER, 0);
}

void VertexBuffer::destroy()
{
    if (_glID == 0)
        return;
    
    CC_SAFE_RELEASE_NULL(_format);
    
    ccDeleteBuffers(1, &_glID);
    //REFINE:    _device._stats.ib -= _bytes;
    
    _glID = 0;
}

#if GFX_DEBUG > 0
static void testVertexBuffer()
{
    VertexFormat vertexFmt({
        { ATTRIB_NAME_POSITION, AttribType::FLOAT32, 2 }
    });

    DeviceGraphics* device = nullptr;
    float vertex[] = {
        -1, 0, 0
        -1, 1, 1
    };
    VertexBuffer* buffer = new VertexBuffer();
    buffer->init(device, vertexFmt, Usage::STATIC, vertex, sizeof(vertex), 3);

    buffer->release();
}
#endif

RENDERER_END
