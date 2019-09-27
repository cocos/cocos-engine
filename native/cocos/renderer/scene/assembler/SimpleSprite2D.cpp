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

#include "SimpleSprite2D.hpp"
#include "../RenderFlow.hpp"

RENDERER_BEGIN

SimpleSprite2D::SimpleSprite2D()
{
    
}

SimpleSprite2D::~SimpleSprite2D()
{
    
}

void SimpleSprite2D::fillBuffers(NodeProxy* node, MeshBuffer* buffer, std::size_t index)
{
    RenderData* data = _datas->getRenderData(0);
    if (!data)
    {
        return;
    }
    
    // must retrieve offset before request
    auto& bufferOffset = buffer->request(4, 6);
    uint32_t vBufferOffset = bufferOffset.vByte / sizeof(float);
    uint32_t indexId = bufferOffset.index;
    uint32_t vertexId = bufferOffset.vertex;
    
    if (*_dirty & VERTICES_DIRTY || node->isDirty(RenderFlow::WORLD_TRANSFORM_CHANGED | RenderFlow::NODE_OPACITY_CHANGED))
    {
        float vl = _localData[0],
        vr = _localData[2],
        vb = _localData[1],
        vt = _localData[3];
        
        const Mat4& worldMat = node->getWorldMatrix();
        size_t dataPerVertex = _bytesPerVertex / sizeof(float);
        float* srcWorldVerts = (float*)data->getVertices();
        
        // left bottom
        float u = srcWorldVerts[2];
        worldMat.transformVector(vl, vb, 0.0f, 1.0f, (cocos2d::Vec3*)srcWorldVerts);
        srcWorldVerts[2] = u;

        // right bottom
        srcWorldVerts += dataPerVertex;
        u = srcWorldVerts[2];
        worldMat.transformVector(vr, vb, 0.0f, 1.0f, (cocos2d::Vec3*)srcWorldVerts);
        srcWorldVerts[2] = u;

        // left top
        srcWorldVerts += dataPerVertex;
        u = srcWorldVerts[2];
        worldMat.transformVector(vl, vt, 0.0f, 1.0f, (cocos2d::Vec3*)srcWorldVerts);
        srcWorldVerts[2] = u;

        // right top
        srcWorldVerts += dataPerVertex;
        u = srcWorldVerts[2];
        worldMat.transformVector(vr, vt, 0.0f, 1.0f, (cocos2d::Vec3*)srcWorldVerts);
        srcWorldVerts[2] = u;
        
        *_dirty &= ~VERTICES_DIRTY;
    }
    
    float* dstWorldVerts = buffer->vData + vBufferOffset;
    memcpy(dstWorldVerts, data->getVertices(), 4 * _bytesPerVertex);

    // Copy index buffer with vertex offset
    uint16_t* srcIndices = (uint16_t*)data->getIndices();
    uint16_t* dstIndices = buffer->iData;
    for (auto i = 0, j = 0; i < 6; ++i, ++j)
    {
        dstIndices[indexId++] = vertexId + srcIndices[j];
    }
}

RENDERER_END
