/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.

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

#include "CCAutoPolygon.h"

USING_NS_CC;

static unsigned short quadIndices[]={0,1,2, 3,2,1};

PolygonInfo::PolygonInfo(const PolygonInfo& other)
{
    filename = other.filename;
    isVertsOwner = true;
    rect = other.rect;
    triangles.verts = new (std::nothrow) V3F_C4B_T2F[other.triangles.vertCount];
    triangles.indices = new (std::nothrow) unsigned short[other.triangles.indexCount];
    triangles.vertCount = other.triangles.vertCount;
    triangles.indexCount = other.triangles.indexCount;
    memcpy(triangles.verts, other.triangles.verts, other.triangles.vertCount*sizeof(V3F_C4B_T2F));
    memcpy(triangles.indices, other.triangles.indices, other.triangles.indexCount*sizeof(unsigned short));
};

PolygonInfo& PolygonInfo::operator= (const PolygonInfo& other)
{
    if(this != &other)
    {
        releaseVertsAndIndices();
        filename = other.filename;
        isVertsOwner = true;
        rect = other.rect;
        triangles.verts = new (std::nothrow) V3F_C4B_T2F[other.triangles.vertCount];
        triangles.indices = new (std::nothrow) unsigned short[other.triangles.indexCount];
        triangles.vertCount = other.triangles.vertCount;
        triangles.indexCount = other.triangles.indexCount;
        memcpy(triangles.verts, other.triangles.verts, other.triangles.vertCount*sizeof(V3F_C4B_T2F));
        memcpy(triangles.indices, other.triangles.indices, other.triangles.indexCount*sizeof(unsigned short));
    }
    return *this;
}

PolygonInfo::~PolygonInfo()
{
    releaseVertsAndIndices();
}

void PolygonInfo::setQuad(V3F_C4B_T2F_Quad *quad)
{
    releaseVertsAndIndices();
    isVertsOwner = false;
    triangles.indices = quadIndices;
    triangles.vertCount = 4;
    triangles.indexCount = 6;
    triangles.verts = (V3F_C4B_T2F*)quad;
}

void PolygonInfo::setTriangles(const TrianglesCommand::Triangles& other)
{
    releaseVertsAndIndices();
    isVertsOwner = false;

    triangles.vertCount = other.vertCount;
    triangles.indexCount = other.indexCount;
    triangles.verts = other.verts;
    triangles.indices = other.indices;
}

void PolygonInfo::releaseVertsAndIndices()
{
    if(isVertsOwner)
    {
        if(nullptr != triangles.verts)
        {
            CC_SAFE_DELETE_ARRAY(triangles.verts);
        }

        if(nullptr != triangles.indices)
        {
            CC_SAFE_DELETE_ARRAY(triangles.indices);
        }
    }
}

unsigned int PolygonInfo::getVertCount() const
{
    return (unsigned int)triangles.vertCount;
}

unsigned int PolygonInfo::getTrianglesCount() const
{
    return (unsigned int)triangles.indexCount/3;
}

float PolygonInfo::getArea() const
{
    float area = 0;
    V3F_C4B_T2F *verts = triangles.verts;
    unsigned short *indices = triangles.indices;
    for(int i = 0; i < triangles.indexCount; i+=3)
    {
        auto A = verts[indices[i]].vertices;
        auto B = verts[indices[i+1]].vertices;
        auto C = verts[indices[i+2]].vertices;
        area += (A.x*(B.y-C.y) + B.x*(C.y-A.y) + C.x*(A.y - B.y))/2;
    }
    return area;
}

