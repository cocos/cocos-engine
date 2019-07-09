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

#include "RenderData.hpp"
#include "../../renderer/Effect.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

RENDERER_BEGIN
RenderData::RenderData ()
{
    
}

RenderData::RenderData (const RenderData& o)
{
    setVertices(o._jsVertices);
    setIndices(o._jsIndices);
}

RenderData::~RenderData ()
{
    if(_jsVertices != nullptr)
    {
        _jsVertices->unroot();
        _jsVertices->decRef();
        _jsVertices = nullptr;
        _vertices = nullptr;
        _vBytes = 0;
    }
    
    if(_jsIndices != nullptr)
    {
        _jsIndices->unroot();
        _jsIndices->decRef();
        _jsIndices = nullptr;
        _indices = nullptr;
        _iBytes = 0;
    }
}

void RenderData::setVertices (se::Object* jsVertices)
{
    if (!jsVertices || jsVertices == _jsVertices) return;
    if (_jsVertices)
    {
        _jsVertices->unroot();
        _jsVertices->decRef();
    }
    _jsVertices = jsVertices;
    _jsVertices->root();
    _jsVertices->incRef();
    _vertices = nullptr;
    _vBytes = 0;
    _jsVertices->getTypedArrayData(&_vertices, (std::size_t*)&_vBytes);
}

void RenderData::setIndices (se::Object* jsIndices)
{
    if (!jsIndices || jsIndices == _jsIndices) return;
    if (_jsIndices)
    {
        _jsIndices->unroot();
        _jsIndices->decRef();
    }
    _jsIndices = jsIndices;
    _jsIndices->root();
    _jsIndices->incRef();
    _indices = nullptr;
    _iBytes = 0;
    _jsIndices->getTypedArrayData(&_indices, (std::size_t*)&_iBytes);
}

uint8_t* RenderData::getVertices () const
{
    return _vertices;
}

uint8_t* RenderData::getIndices () const
{
    return _indices;
}

void RenderData::clear()
{
    if(_jsVertices != nullptr)
    {
        _jsVertices->unroot();
        _jsVertices->decRef();
        _jsVertices = nullptr;
    }
    
    if(_jsIndices != nullptr)
    {
        _jsIndices->unroot();
        _jsIndices->decRef();
        _jsIndices = nullptr;
    }
    
    _vBytes = 0;
    _iBytes = 0;
    _vertices = nullptr;
    _indices = nullptr;
}

RENDERER_END
