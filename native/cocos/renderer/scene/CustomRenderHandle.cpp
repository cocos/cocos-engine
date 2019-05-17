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

#include "CustomRenderHandle.hpp"
#include "RenderFlow.hpp"

RENDERER_BEGIN

CustomRenderHandle::CustomRenderHandle()
{
    
}

CustomRenderHandle::~CustomRenderHandle()
{
    
}

void CustomRenderHandle::handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene)
{
    batcher->commitIA(node, this);
}

void CustomRenderHandle::updateNativeEffect(std::size_t index, Effect* effect)
{
    auto size = _effects.size();
    if (index == size)
    {
        _effects.pushBack(effect);
        return;
    }
    else if (index < size)
    {
        _effects.replace(index, effect);
        return;
    }
    cocos2d::log("CustomRenderHandle:updateNativeEffect index:%lu out of range", index);
}

void CustomRenderHandle::reset()
{
    _iaCount = 0;
    for (auto it = _iaPool.begin(); it != _iaPool.end(); it++)
    {
        (*it)->clear();
    }
}

InputAssembler* CustomRenderHandle::adjustIA(std::size_t index)
{
    auto size = _iaPool.size();
    InputAssembler* ia = nullptr;
    if (index == size)
    {
        ia = new InputAssembler();
        _iaPool.push_back(ia);
    }
    else if (index < size)
    {
        ia = _iaPool[index];
    }
    else
    {
        cocos2d::log("MiddlewareRenderHandle:updateIA index:%lu is out of range", index);
        return nullptr;
    }
    
    auto newIACount = index + 1;
    if (_iaCount < newIACount)
    {
        _iaCount = newIACount;
    }
    
    return ia;
}

RENDERER_END
