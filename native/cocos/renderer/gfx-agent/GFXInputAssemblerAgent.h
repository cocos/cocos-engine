/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "GFXAgent.h"
#include "gfx-base/GFXInputAssembler.h"

namespace cc {
namespace gfx {

class CC_DLL InputAssemblerAgent final : public Agent<InputAssembler> {
public:
    using Agent::Agent;
    InputAssemblerAgent(Device *device) = delete;
    ~InputAssemblerAgent() override;

    bool initialize(const InputAssemblerInfo &info) override;
    void destroy() override;

    void setVertexCount(uint count) override { _vertexCount = count; _actor->setVertexCount(count); }
    void setFirstVertex(uint first) override { _firstVertex = first; _actor->setFirstVertex(first); }
    void setIndexCount(uint count) override { _indexCount = count; _actor->setIndexCount(count); }
    void setFirstIndex(uint first) override { _firstIndex = first; _actor->setFirstIndex(first); }
    void setVertexOffset(uint offset) override { _vertexOffset = offset; _actor->setVertexOffset(offset); }
    void setInstanceCount(uint count) override { _instanceCount = count; _actor->setInstanceCount(count); }
    void setFirstInstance(uint first) override { _firstInstance = first; _actor->setFirstInstance(first); }
};

} // namespace gfx
} // namespace cc
