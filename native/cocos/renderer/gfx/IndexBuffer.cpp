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

#include "IndexBuffer.h"
#include "DeviceGraphics.h"
#include "base/CCGLUtils.h"

RENDERER_BEGIN

IndexBuffer::IndexBuffer()
: _device(nullptr)
, _format(IndexFormat::UINT16)
, _usage(Usage::STATIC)
, _numIndices(0)
, _bytesPerIndex(0)
{
}

IndexBuffer::~IndexBuffer()
{
    destroy();
}

bool IndexBuffer::init(DeviceGraphics* device, IndexFormat format, Usage usage, const void* data, size_t dataByteLength, uint32_t numIndices)
{
    _device = device;
    _format = format;
    _usage = usage;
    _numIndices = numIndices;
    _bytesPerIndex = 0;

    // calculate bytes
    if (format == IndexFormat::UINT8)
    {
        _bytesPerIndex = 1;
    }
    else if (format == IndexFormat::UINT16)
    {
        _bytesPerIndex = 2;
    }
    else if (format == IndexFormat::UINT32)
    {
        _bytesPerIndex = 4;
    }

    _bytes = _bytesPerIndex * numIndices;

    // update
    glGenBuffers(1, &_glID);
    update(0, data, dataByteLength);

    // stats
    //REFINE:    device._stats.ib += _bytes;

    return true;
}

void IndexBuffer::update(uint32_t offset, const void* data, size_t dataByteLength)
{
    if (_glID == 0)
    {
        RENDERER_LOGE("The buffer is destroyed");
        return;
    }

    if (data && dataByteLength + offset > _bytes)
    {
        RENDERER_LOGE("Failed to update index buffer data, bytes exceed.");
        return;
    }

    GLenum glUsage = (GLenum)_usage;
    ccBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _glID);
    if (!data)
    {
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, _bytes, nullptr, glUsage);
    }
    else
    {
        if (offset > 0)
        {
            glBufferSubData(GL_ELEMENT_ARRAY_BUFFER, (GLintptr)offset, (GLsizeiptr)dataByteLength, (const GLvoid*)data);
        }
        else
        {
            glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizeiptr)dataByteLength, data, glUsage);
        }
    }
    _device->restoreIndexBuffer();
}

void IndexBuffer::destroy()
{
    if (_glID == 0)
        return;
    
    ccDeleteBuffers(1, &_glID);
    //REFINE:    _device._stats.ib -= _bytes;
    _glID = 0;
}

RENDERER_END
