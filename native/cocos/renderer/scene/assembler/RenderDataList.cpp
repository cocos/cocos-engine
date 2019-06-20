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

#include "RenderDataList.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

RENDERER_BEGIN

void RenderDataList::updateMesh(std::size_t index, se_object_ptr vertices, se_object_ptr indices)
{
    if (index >= _datas.size())
    {
        _datas.resize(index + 1);
    }
    
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;
    
    RenderData& data = _datas[index];
    data.setVertices(vertices);
    data.setIndices(indices);
}

RenderData* RenderDataList::getRenderData(std::size_t index)
{
    if (index >= _datas.size())
    {
        return nullptr;
    }
    return &_datas[index];
}

void RenderDataList::clear()
{
    for (auto it = _datas.begin(); it != _datas.end(); it++)
    {
        it->clear();
    }
    _datas.clear();
}

RENDERER_END
