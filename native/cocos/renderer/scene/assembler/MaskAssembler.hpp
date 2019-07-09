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

#pragma once

#include <stdio.h>
#include "Assembler.hpp"
#include "../MeshBuffer.hpp"
#include "math/CCMath.h"
#include "SimpleSprite2D.hpp"

class ModelBatcher;

RENDERER_BEGIN

class MaskAssembler: public SimpleSprite2D
{
public:
    MaskAssembler();
    virtual ~MaskAssembler();
    virtual void handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override;
    virtual void postHandle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override;

    void setMaskInverted(bool inverted) { _inverted = inverted; };
    bool getMaskInverted() { return _inverted; };

    void setRenderSubHandle(Assembler* renderSubHandle);
    void setClearSubHandle(Assembler* clearSubHandle);

    void setImageStencil(bool isImageStencil) { _imageStencil = isImageStencil; };
    
protected:
    bool _inverted = false;
    bool _imageStencil = false;

private:
    Assembler* _renderSubHandle = nullptr;
    Assembler* _clearSubHandle = nullptr;
};

RENDERER_END
