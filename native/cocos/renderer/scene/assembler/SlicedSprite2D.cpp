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

#include "SlicedSprite2D.hpp"
#include "../RenderFlow.hpp"

RENDERER_BEGIN

SlicedSprite2D::SlicedSprite2D()
{
    
}

SlicedSprite2D::~SlicedSprite2D()
{
    
}

void SlicedSprite2D::generateWorldVertices()
{
    RenderData* data = _datas->getRenderData(0);
    float* verts = (float*)data->getVertices();
    
    auto floatsPerVert = _bytesPerVertex / sizeof(float);
    for (auto row = 0; row < 4; ++row) {
        float localRowY = _localData[row * 2 + 1];
        for (auto col = 0; col < 4; ++col) {
            float localColX = _localData[col * 2];
            std::size_t worldIndex = (row * 4 + col) * floatsPerVert;
            verts[worldIndex] = localColX ;
            verts[worldIndex + 1] = localRowY;
        }
    }
}

RENDERER_END
