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

#include "RenderHandle.hpp"

#include "NodeProxy.hpp"
#include "ModelBatcher.hpp"
#include "MeshBuffer.hpp"
#include "../renderer/Scene.h"
#include "math/CCMath.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_renderer_auto.hpp"

RENDERER_BEGIN

static MeshBuffer::OffsetInfo s_offsets;

RenderHandle::RenderData::~RenderData()
{
    if(jsVertices != nullptr)
    {
        jsVertices->unroot();
        jsVertices->decRef();
    }
    if(jsIndices != nullptr)
    {
        jsIndices->unroot();
        jsIndices->decRef();
    }
}

RenderHandle::RenderHandle()
: _enabled(false)
, _useModel(false)
, _vfmt(nullptr)
{
}

RenderHandle::~RenderHandle()
{
    disable();
}

void RenderHandle::enable()
{
    _enabled = true;
    _dirtyFlag |= OPACITY;
}

void RenderHandle::disable()
{
    _enabled = false;
}

void RenderHandle::updateNativeMesh(uint32_t index, se::Object* vertices, se::Object* indices)
{
    if (index >= _datas.size())
    {
        return;
    }
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;
    
    RenderData* data = &_datas[index];
    if (data->jsVertices != nullptr)
    {
        data->jsVertices->unroot();
        data->jsVertices->decRef();
    }
    if (data->jsIndices != nullptr)
    {
        data->jsIndices->unroot();
        data->jsIndices->decRef();
    }

    vertices->root();
    vertices->incRef();
    data->jsVertices = vertices;
    indices->root();
    indices->incRef();
    data->jsIndices = indices;
    data->vertices = nullptr;
    data->indices = nullptr;
    data->jsVertices->getTypedArrayData(&data->vertices, (std::size_t*)&data->vBytes);
    data->jsIndices->getTypedArrayData(&data->indices, (std::size_t*)&data->iBytes);
    
    _dirtyFlag |= OPACITY;
}

void RenderHandle::updateNativeEffect(uint32_t index, Effect* effect)
{
    if (index >= _datas.size())
    {
        return;
    }
    _datas[index].effect = effect;
}

void RenderHandle::setMeshCount(uint32_t count)
{
    _datas.resize(count);
}

Effect* RenderHandle::getEffect(uint32_t index)
{
    if (index < _datas.size())
    {
        return _datas[index].effect;
    }
    else
    {
        return nullptr;
    }
}

void RenderHandle::setVertexFormat(VertexFormat* vfmt)
{
    _vfmt = vfmt;
    if (_vfmt)
    {
        _bytesPerVertex = _vfmt->getBytes();
        _vfPos = _vfmt->getElement(ATTRIB_NAME_POSITION);
        _posOffset = _vfPos->offset / 4;
        _vfColor = _vfmt->getElement(ATTRIB_NAME_COLOR);
        _alphaOffset = _vfColor->offset + 3;
    }
}

void RenderHandle::handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene)
{
    batcher->commit(node, this);
}

void RenderHandle::postHandle(NodeProxy *node, ModelBatcher* batcher, Scene* scene)
{
}

void RenderHandle::fillBuffers(MeshBuffer* buffer, int index, const Mat4& worldMat)
{
    if (index >= _datas.size() || _vfmt == nullptr)
    {
        return;
    }
    RenderData& data = _datas[index];
    
    CCASSERT(data.vBytes % _bytesPerVertex == 0, "RenderHandle::fillBuffers vertices data doesn't follow vertex format");
    CCASSERT(data.iBytes % 2 == 0, "RenderHandle::fillBuffers indices data is not saved in 16bit");
    uint32_t vertexCount = (uint32_t)data.vBytes / _bytesPerVertex;
    uint32_t indexCount = (uint32_t)data.iBytes / 2;

    // must retrieve offset before request
    buffer->request(vertexCount, indexCount, &s_offsets);
    uint32_t vBufferOffset = s_offsets.vByte / sizeof(float);
    uint32_t indexId = s_offsets.index;
    uint32_t vertexId = s_offsets.vertex;
    uint32_t num = _vfPos->num;

    float* worldVerts = &buffer->vData[vBufferOffset];
    memcpy(worldVerts, (float*)data.vertices, data.vBytes);
    
    // Calculate vertices world positions
    if (!_useModel)
    {
        size_t dataPerVertex = _bytesPerVertex / sizeof(float);
        float* ptrPos = worldVerts + _posOffset;
        
        switch (num) {
           // Vertex is X Y Z Format
            case 3:
                for (uint32_t i = 0; i < vertexCount; ++i)
                {
                    worldMat.transformPoint((cocos2d::Vec3*)ptrPos);
                    ptrPos += dataPerVertex;
                }
                break;
            // Vertex is X Y Format
            case 2:
                for (uint32_t i = 0; i < vertexCount; ++i)
                {
                    float z = ptrPos[2];
                    ptrPos[2] = 0;
                    worldMat.transformPoint((cocos2d::Vec3*)ptrPos);
                    ptrPos[2] = z;
                    ptrPos += dataPerVertex;
                }
                break;
        }
    }
    
    // Copy index buffer with vertex offset
    uint16_t* indices = (uint16_t*)data.indices;
    for (int i = 0; i < indexCount; ++i)
    {
        buffer->iData[indexId++] = vertexId + indices[i];
    }
}

void RenderHandle::updateOpacity(int index, uint8_t opacity)
{
    // has no color info in vertex buffer
    if(!_vfColor)
    {
        return;
    }
    
    if (index >= _datas.size() || _vfmt == nullptr)
    {
        return;
    }
    RenderData& data = _datas[index];
    
    CCASSERT(data.vBytes % _bytesPerVertex == 0, "RenderHandle::fillBuffers vertices data doesn't follow vertex format");
    uint32_t vertexCount = (uint32_t)data.vBytes / _bytesPerVertex;
    
    size_t dataPerVertex = _bytesPerVertex / sizeof(uint8_t);
    uint8_t* ptrAlpha = (uint8_t*)data.vertices + _alphaOffset;
    for (uint32_t i = 0; i < vertexCount; ++i)
    {
        *ptrAlpha = opacity;
        ptrAlpha += dataPerVertex;
    }
    
    _dirtyFlag &= ~OPACITY;
}

RENDERER_END
