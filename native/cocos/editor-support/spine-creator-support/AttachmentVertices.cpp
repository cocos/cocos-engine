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

#include "spine-creator-support/AttachmentVertices.h"

USING_NS_CC;

namespace spine {
    
    AttachmentVertices::AttachmentVertices (middleware::Texture2D* texture, int verticesCount, unsigned short* triangles, int trianglesCount)
    {
        _texture = texture;
        
        _triangles = new middleware::Triangles();
        _triangles->verts = new middleware::V2F_T2F_C4B[verticesCount];
        _triangles->vertCount = verticesCount;
        _triangles->indices = triangles;
        _triangles->indexCount = trianglesCount;
    }
    
    AttachmentVertices::~AttachmentVertices ()
    {
        delete [] _triangles->verts;
        delete _triangles;
    }
    
}
