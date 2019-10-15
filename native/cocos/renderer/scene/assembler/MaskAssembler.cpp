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

#include "MaskAssembler.hpp"
#include "../ModelBatcher.hpp"
#include "../StencilManager.hpp"
#include "../../Macro.h"

RENDERER_BEGIN

MaskAssembler::MaskAssembler()
{
}

MaskAssembler::~MaskAssembler()
{
    CC_SAFE_RELEASE(_renderSubHandle);
    CC_SAFE_RELEASE(_clearSubHandle);
}

void MaskAssembler::setRenderSubHandle(Assembler* renderSubHandle)
{
    if (_renderSubHandle == renderSubHandle) return;
    CC_SAFE_RELEASE(_renderSubHandle);
    _renderSubHandle = renderSubHandle;
    CC_SAFE_RETAIN(_renderSubHandle);
}

void MaskAssembler::setClearSubHandle(Assembler* clearSubHandle)
{
    if (_clearSubHandle == clearSubHandle) return;
    CC_SAFE_RELEASE(_clearSubHandle);
    _clearSubHandle = clearSubHandle;
    CC_SAFE_RETAIN(_clearSubHandle);
}

void MaskAssembler::handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene)
{
    batcher->flush();
    batcher->flushIA();

    StencilManager* instance = StencilManager::getInstance();
    instance->pushMask(_inverted);
    instance->clear();
    batcher->commit(node, _clearSubHandle);
    batcher->flush();
    instance->enterLevel();

    if (_imageStencil)
    {
        batcher->commit(node, this);
    }
    else if (_renderSubHandle)
    {
        _renderSubHandle->handle(node, batcher, scene);
    }

    batcher->flush();
    instance->enableMask();
}

void MaskAssembler::postHandle(NodeProxy *node, ModelBatcher *batcher, Scene *scene)
{
    batcher->flush();
    batcher->flushIA();
    StencilManager::getInstance()->exitMask();
}

RENDERER_END
