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

#include "AssemblerSprite.hpp"
#include "../RenderFlow.hpp"

RENDERER_BEGIN

AssemblerSprite::AssemblerSprite()
{
    
}

AssemblerSprite::~AssemblerSprite()
{
    if(_localObj != nullptr)
    {
        _localObj->unroot();
        _localObj->decRef();
        _localObj = nullptr;
        _localData = nullptr;
        _localLen = 0;
    }
}

void AssemblerSprite::setLocalData(se_object_ptr localData)
{
    if (!localData || localData == _localObj) return;
    if (_localObj)
    {
        _localObj->unroot();
        _localObj->decRef();
    }
    _localObj = localData;
    _localObj->root();
    _localObj->incRef();
    _localData = nullptr;
    _localLen = 0;
    _localObj->getTypedArrayData((uint8_t**)&_localData, (std::size_t*)&_localLen);
}

void AssemblerSprite::fillBuffers(NodeProxy* node, MeshBuffer* buffer, std::size_t index)
{
    if(!_datas || !_vfmt)
    {
        return;
    }
    
    if (index >= _iaDatas.size())
    {
        return;
    }
    
    const IARenderData& ia = _iaDatas[index];
    std::size_t meshIndex = ia.meshIndex >= 0 ? ia.meshIndex : index;
    
    RenderData* data = _datas->getRenderData(meshIndex);
    if (!data)
    {
        return;
    }
    
    CCASSERT(data->getVBytes() % _bytesPerVertex == 0, "AssemblerSprite::fillBuffers vertices data doesn't follow vertex format");
    uint32_t vertexCount = ia.verticesCount >= 0 ? (uint32_t)ia.verticesCount : (uint32_t)data->getVBytes() / _bytesPerVertex;
    uint32_t indexCount = ia.indicesCount >= 0 ? (uint32_t)ia.indicesCount : (uint32_t)data->getIBytes() / sizeof(unsigned short);
    uint32_t vertexStart = (uint32_t)ia.verticesStart;
    
    // must retrieve offset before request
    auto& bufferOffset = buffer->request(vertexCount, indexCount);
    uint32_t vBufferOffset = bufferOffset.vByte / sizeof(float);
    uint32_t indexId = bufferOffset.index;
    uint32_t vertexId = bufferOffset.vertex;
    uint32_t vertexOffset = vertexId - vertexStart;
    
    if (*_dirty & VERTICES_DIRTY || node->isDirty(RenderFlow::WORLD_TRANSFORM_CHANGED | RenderFlow::NODE_OPACITY_CHANGED))
    {
        generateWorldVertices();
        calculateWorldVertices(node->getWorldMatrix());
    }
    
    float* dstWorldVerts = buffer->vData + vBufferOffset;
    memcpy(dstWorldVerts, data->getVertices() + vertexStart * _bytesPerVertex, vertexCount * _bytesPerVertex);
    
    // Copy index buffer with vertex offset
    uint16_t* srcIndices = (uint16_t*)data->getIndices();
    uint16_t* dstIndices = buffer->iData;
    for (auto i = 0, j = ia.indicesStart; i < indexCount; ++i, ++j)
    {
        dstIndices[indexId++] = vertexOffset + srcIndices[j];
    }
}

void AssemblerSprite::calculateWorldVertices(const Mat4& worldMat)
{
    if(!_datas || !_vfmt)
    {
        return;
    }
    
    uint32_t num = _vfPos->num;
    size_t dataPerVertex = _bytesPerVertex / sizeof(float);
    
    for (std::size_t iaIdx = 0, iaCount = _iaDatas.size(); iaIdx < iaCount; iaIdx++)
    {
        const IARenderData& ia = _iaDatas[iaIdx];
        std::size_t meshIndex = ia.meshIndex >= 0 ? ia.meshIndex : iaIdx;
        RenderData* data = _datas->getRenderData(meshIndex);
        if (!data) continue;
        
        uint32_t vertexCount = ia.verticesCount >= 0 ? (uint32_t)ia.verticesCount : (uint32_t)data->getVBytes() / _bytesPerVertex;
        uint32_t vertexStart = (uint32_t)ia.verticesStart;
        float* srcWorldVerts = (float*)(data->getVertices() + vertexStart * _bytesPerVertex) + _posOffset;
        
        switch (num) {
            case 3:
                for (uint32_t i = 0; i < vertexCount; ++i)
                {
                    worldMat.transformPoint((cocos2d::Vec3*)srcWorldVerts);
                    srcWorldVerts += dataPerVertex;
                }
                break;
            case 2:
                for (uint32_t i = 0; i < vertexCount; ++i)
                {
                    float z = srcWorldVerts[2];
                    srcWorldVerts[2] = 0;
                    worldMat.transformPoint((cocos2d::Vec3*)srcWorldVerts);
                    srcWorldVerts[2] = z;
                    srcWorldVerts += dataPerVertex;
                }
                break;
        }
    }
    
    *_dirty &= ~VERTICES_DIRTY;
}
RENDERER_END
