/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "Define.h"
#include "base/Macros.h"
#include "base/TypeDef.h"
#include "base/std/container/set.h"
#include "base/std/container/vector.h"

namespace cc {

namespace gfx {
class Device;
class RenderPass;
class CommandBuffer;
class DescriptorSet;
} // namespace gfx

namespace pipeline {

class InstancedBuffer;

class CC_DLL RenderInstancedQueue final : public RefCounted {
public:
    RenderInstancedQueue() = default;
    ~RenderInstancedQueue() override = default;
    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer,
                             gfx::DescriptorSet *ds = nullptr, uint32_t offset = 0, const ccstd::vector<uint32_t> *dynamicOffsets = nullptr);
    void add(InstancedBuffer *instancedBuffer);
    void uploadBuffers(gfx::CommandBuffer *cmdBuffer);
    void sort();
    void clear();
    bool empty() { return _queues.empty(); }

private:
    // `InstancedBuffer *`: weak reference
    ccstd::set<InstancedBuffer *> _queues;
    ccstd::vector<InstancedBuffer *> _renderQueues;
};

} // namespace pipeline
} // namespace cc
