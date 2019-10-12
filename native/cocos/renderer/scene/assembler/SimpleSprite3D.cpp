/****************************************************************************
Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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

#include "SimpleSprite3D.hpp"

RENDERER_BEGIN

SimpleSprite3D::SimpleSprite3D()
{
    
}

SimpleSprite3D::~SimpleSprite3D()
{
    
}

void SimpleSprite3D::generateWorldVertices()
{
    RenderData* data = _datas->getRenderData(0);
    float* verts = (float*)data->getVertices();
    
    auto floatsPerVert = _bytesPerVertex / sizeof(float);
    
    std::size_t dstOffset = 0;
    
    float vl = _localData[0],
    vr = _localData[2],
    vb = _localData[1],
    vt = _localData[3];
    
    // left bottom
    verts[dstOffset] = vl;
    verts[dstOffset+1] = vb;
    verts[dstOffset+2] = 0;
    
    dstOffset += floatsPerVert;
    
    // right bottom
    verts[dstOffset] = vr;
    verts[dstOffset+1] = vb;
    verts[dstOffset+2] = 0;
    
    dstOffset += floatsPerVert;
    
    // left top
    verts[dstOffset] = vl;
    verts[dstOffset+1] = vt;
    verts[dstOffset+2] = 0;
    
    dstOffset += floatsPerVert;
    
    // right top
    verts[dstOffset] = vr;
    verts[dstOffset+1] = vt;
    verts[dstOffset+2] = 0;
}

RENDERER_END
