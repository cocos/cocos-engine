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

#include "MeshBuffer.hpp"
#include "../Types.h"
#include "ModelBatcher.hpp"
#include "RenderFlow.hpp"
#include "../gfx/DeviceGraphics.h"

#define MAX_VB_SIZE 1310700

RENDERER_BEGIN

MeshBuffer::MeshBuffer(ModelBatcher* batcher, VertexFormat* fmt)
: _byteStart(0)
, _byteOffset(0)
, _indexStart(0)
, _indexOffset(0)
, _vertexStart(0)
, _vertexOffset(0)
, _vDataCount(0)
, _iDataCount(0)
, _dirty(false)
, _vertexFmt(fmt)
, _batcher(batcher)
, _vbPos(0)
{
    _bytesPerVertex = _vertexFmt->getBytes();
    
    DeviceGraphics* device = _batcher->getFlow()->getDevice();
    _vb = VertexBuffer::create(device, _vertexFmt, Usage::DYNAMIC, nullptr, 0, 0);
    _vbArr.pushBack(_vb);
    
    _ib = IndexBuffer::create(device, IndexFormat::UINT16, Usage::STATIC, nullptr, 0, 0);
    _ib->retain();
    
    _vDataCount = MeshBuffer::INIT_VERTEX_COUNT * 4 * _bytesPerVertex / 4;
    _iDataCount = MeshBuffer::INIT_VERTEX_COUNT * 6;
    
    reallocBuffers();
}

MeshBuffer::~MeshBuffer()
{
    _ib->release();
}

void MeshBuffer::reallocBuffers()
{
    vData.resize(_vDataCount);
    _vb->setBytes(_vDataCount * VDATA_BYTE);
    iData.resize(_iDataCount);
    _ib->setBytes(_iDataCount * IDATA_BYTE);
}

bool MeshBuffer::request(uint32_t vertexCount, uint32_t indexCount, OffsetInfo* offset)
{
    if (_batcher->getCurrentBuffer() != this)
    {
        _batcher->flush();
        _batcher->setCurrentBuffer(this);
    }
    offset->vByte = _byteOffset;
    offset->index = _indexOffset;
    offset->vertex = _vertexOffset;
    return requestStatic(vertexCount, indexCount, offset);
}

bool MeshBuffer::requestStatic(uint32_t vertexCount, uint32_t indexCount, OffsetInfo* offset)
{
    uint32_t byteOffset = _byteOffset + vertexCount * _bytesPerVertex;
    if (MAX_VB_SIZE < byteOffset)
    {
        // Finish pre data.
        _batcher->flush();
        _vb->update(0, vData.data(), _byteOffset);
        
        // Prepare next data.
        _vbPos++;
        if (_vbPos >= _vbArr.size())
        {
            DeviceGraphics* device = _batcher->getFlow()->getDevice();
            _vb = VertexBuffer::create(device, _vertexFmt, Usage::DYNAMIC, nullptr, 0, 0);
            _vb->setBytes(_vDataCount * VDATA_BYTE);
            _vbArr.pushBack(_vb);
        }
        else
        {
            _vb = _vbArr.at(_vbPos);
        }
        
        _byteStart = 0;
        _byteOffset = 0;
        _vertexStart = 0;
        _vertexOffset = 0;
        
        offset->vByte = 0;
        offset->vertex = 0;
        
        byteOffset = vertexCount * _bytesPerVertex;
    }
    
    uint32_t indexOffset = _indexOffset + indexCount;
    uint32_t vBytes = _vDataCount * VDATA_BYTE;
    
    if (byteOffset > vBytes)
    {
        while (vBytes < byteOffset)
        {
            _vDataCount *= 2;
            vBytes = _vDataCount * VDATA_BYTE;
        }
        
        vData.resize(_vDataCount);
        _vb->setBytes(vBytes);
    }
    
    if (indexOffset > _iDataCount)
    {
        while (_iDataCount < indexOffset)
        {
            _iDataCount *= 2;
        }
        
        iData.resize(_iDataCount);
        _ib->setBytes(_iDataCount * IDATA_BYTE);
    }
    
    _vertexOffset += vertexCount;
    _indexOffset += indexCount;
    _byteOffset = byteOffset;
    _dirty = true;
    return true;
}

void MeshBuffer::uploadData()
{
    _vb->update(0, vData.data(), _byteOffset);
    _ib->update(0, iData.data(), _indexOffset * IDATA_BYTE);
    _dirty = false;
}

void MeshBuffer::reset()
{
    _vbPos = 0;
    _vb = _vbArr.at(0);
    _byteStart = 0;
    _byteOffset = 0;
    _vertexStart = 0;
    _vertexOffset = 0;
    _indexStart = 0;
    _indexOffset = 0;
    _dirty = false;
}

void MeshBuffer::destroy()
{
    _vb->destroy();
    _ib->destroy();
    iData.clear();
    vData.clear();
}

RENDERER_END
