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

#include "GraphicsRenderHandle.hpp"
#include "math/CCMath.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_renderer_auto.hpp"

RENDERER_BEGIN

GraphicsRenderHandle::IARenderData::~IARenderData()
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
    vb->release();
    ib->release();
}

GraphicsRenderHandle::GraphicsRenderHandle()
{
    _bytesPerVertex = VertexFormat::XY_Color->getBytes();
}

GraphicsRenderHandle::~GraphicsRenderHandle()
{
    for (std::size_t i = 0, n = _iaPool.size(); i < n; i++)
    {
        auto ia = _iaPool[i];
        delete ia;
    }
    _iaPool.clear();
}

void GraphicsRenderHandle::updateIA(std::size_t index, int start, int count)
{
    InputAssembler* ia = adjustIA(index);
    if (!ia) return;
    
    IARenderData* data = &_datas[index];
    ia->setVertexBuffer(data->vb);
    ia->setIndexBuffer(data->ib);
    ia->setCount(count);
    ia->setStart(start);
}

void GraphicsRenderHandle::renderIA(std::size_t index, ModelBatcher* batcher, NodeProxy* node)
{
    if (index >= _iaCount)
    {
        cocos2d::log("GraphicsRenderHandle:renderIA index:%lu out of range", index);
        return;
    }
    
    batcher->flushIA(_iaPool[index]);
    
    IARenderData* data = &_datas[index];
    uint8_t* verts = data->vertices;
    uint32_t vertexCount = (uint32_t)data->vBytes / _bytesPerVertex;
    uint8_t alpha = node->getRealOpacity();
    for (uint32_t i = 0; i < vertexCount; ++i)
    {
        *(verts + 11) = alpha;
        verts += _bytesPerVertex;
    }
    data->vb->update(0, (float*)data->vertices, data->vBytes);
    data->ib->update(0, (float*)data->indices, data->iBytes);
}

void GraphicsRenderHandle::setMeshCount(uint32_t count)
{
    _datas.resize(count);
}

void GraphicsRenderHandle::updateNativeMesh(uint32_t index, se::Object* vertices, se::Object* indices)
{
    if (index >= _datas.size())
    {
        return;
    }
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;
    
    IARenderData* data = &_datas[index];
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
    
    if(!data->vb)
    {
        data->vb = new VertexBuffer();
        data->vb->init(DeviceGraphics::getInstance(), VertexFormat::XY_Color, Usage::DYNAMIC, nullptr, 0, (uint32_t)data->vBytes);
    }
    else
    {
        data->vb->setBytes((uint32_t)data->vBytes);
    }
    
    if(!data->ib)
    {
        data->ib = new IndexBuffer();
        data->ib->init(DeviceGraphics::getInstance(), IndexFormat::UINT16, Usage::STATIC, nullptr, 0, (uint32_t)data->iBytes);
    }
    else
    {
        data->ib->setBytes((uint32_t)data->iBytes);
    }
}

void GraphicsRenderHandle::updateNativeEffect(size_t index, Effect* effect)
{
    if (index >= _datas.size() || !effect)
    {
        return;
    }
    _datas[index].effect = effect;
    CustomRenderHandle::updateNativeEffect(index, effect);
}

RENDERER_END
