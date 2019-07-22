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
: _vertexFmt(fmt)
, _batcher(batcher)
{
    _bytesPerVertex = _vertexFmt->getBytes();
    
    DeviceGraphics* device = _batcher->getFlow()->getDevice();
    _vb = VertexBuffer::create(device, _vertexFmt, Usage::DYNAMIC, nullptr, 0, 0);
    _vbArr.pushBack(_vb);
    
    _ib = IndexBuffer::create(device, IndexFormat::UINT16, Usage::STATIC, nullptr, 0, 0);
    _ib->retain();
    
    _vDataCount = MeshBuffer::INIT_VERTEX_COUNT * 4 * _bytesPerVertex / sizeof(float);
    _iDataCount = MeshBuffer::INIT_VERTEX_COUNT * 6;
    
    reallocVBuffer();
    reallocIBuffer();
}

MeshBuffer::~MeshBuffer()
{
    for (std::size_t i = 0, n = _vbArr.size(); i < n; i++)
    {
         _vbArr.at(i)->destroy();
    }
    _vbArr.clear();
    
    _ib->destroy();
    _ib->release();
    
    if (iData)
    {
        delete[] iData;
        iData = nullptr;
    }
    
    if (vData)
    {
        delete[] vData;
        vData = nullptr;
    }
}

void MeshBuffer::reallocVBuffer()
{
    auto oldVData = vData;
    vData = new float[_vDataCount];
    if (oldVData)
    {
        memcpy(vData, oldVData, sizeof(float) * _oldVDataCount);
        delete[] oldVData;
        oldVData = nullptr;
    }
    _vb->setBytes(_vDataCount * VDATA_BYTE);
}

void MeshBuffer::reallocIBuffer()
{
    auto oldIData = iData;
    iData = new uint16_t[_iDataCount];
    if (oldIData)
    {
        memcpy(iData, oldIData, sizeof(uint16_t) * _oldIDataCount);
        delete[] oldIData;
        oldIData = nullptr;
    }
    _ib->setBytes(_iDataCount * IDATA_BYTE);
}

const MeshBuffer::OffsetInfo& MeshBuffer::request(uint32_t vertexCount, uint32_t indexCount)
{
    if (_batcher->getCurrentBuffer() != this)
    {
        _batcher->flush();
        _batcher->setCurrentBuffer(this);
    }
    _offsetInfo.vByte = _byteOffset;
    _offsetInfo.index = _indexOffset;
    _offsetInfo.vertex = _vertexOffset;
    return requestStatic(vertexCount, indexCount);
}

const MeshBuffer::OffsetInfo& MeshBuffer::requestStatic(uint32_t vertexCount, uint32_t indexCount)
{
    uint32_t byteOffset = _byteOffset + vertexCount * _bytesPerVertex;
    if (MAX_VB_SIZE < byteOffset)
    {
        // Finish pre data.
        _batcher->flush();
        _vb->update(0, vData, _byteOffset);
        
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
        
        _offsetInfo.vByte = 0;
        _offsetInfo.vertex = 0;
        
        byteOffset = vertexCount * _bytesPerVertex;
    }
    
    uint32_t indexOffset = _indexOffset + indexCount;
    uint32_t vBytes = _vDataCount * VDATA_BYTE;
    
    if (byteOffset > vBytes)
    {
        _oldVDataCount = _vDataCount;
        
        while (vBytes < byteOffset)
        {
            _vDataCount *= 2;
            vBytes = _vDataCount * VDATA_BYTE;
        }
        
        reallocVBuffer();
    }
    
    if (indexOffset > _iDataCount)
    {
        _oldIDataCount = _iDataCount;
        
        while (_iDataCount < indexOffset)
        {
            _iDataCount *= 2;
        }
        
        reallocIBuffer();
    }
    
    _vertexOffset += vertexCount;
    _indexOffset += indexCount;
    _byteOffset = byteOffset;
    _dirty = true;
    return _offsetInfo;
}

void MeshBuffer::uploadData()
{
    _vb->update(0, vData, _byteOffset);
    _ib->update(0, iData, _indexOffset * IDATA_BYTE);
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

RENDERER_END
