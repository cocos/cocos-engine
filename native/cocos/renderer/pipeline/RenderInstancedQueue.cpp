/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "RenderInstancedQueue.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "gfx-base/GFXCommandBuffer.h"

namespace cc {
namespace pipeline {

void RenderInstancedQueue::clear() {
    for (auto *it : _queues) {
        it->clear();
    }
    _queues.clear();
}

void RenderInstancedQueue::uploadBuffers(gfx::CommandBuffer *cmdBuffer) {
    for (auto *instanceBuffer : _queues) {
        if (instanceBuffer->hasPendingModels()) {
            instanceBuffer->uploadBuffers(cmdBuffer);
        }
    }
}

void RenderInstancedQueue::recordCommandBuffer(gfx::Device * /*device*/, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    for (auto *instanceBuffer : _queues) {
        if (!instanceBuffer->hasPendingModels()) continue;

        const auto &instances = instanceBuffer->getInstances();
        const auto *pass      = instanceBuffer->getPass();
        cmdBuffer->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        gfx::PipelineState *lastPSO = nullptr;
        for (const auto &instance : instances) {
            if (!instance.count) {
                continue;
            }
            auto *pso = PipelineStateManager::getOrCreatePipelineState(pass, instance.shader, instance.ia, renderPass);
            if (lastPSO != pso) {
                cmdBuffer->bindPipelineState(pso);
                lastPSO = pso;
            }
            cmdBuffer->bindDescriptorSet(localSet, instance.descriptorSet, instanceBuffer->dynamicOffsets());
            cmdBuffer->bindInputAssembler(instance.ia);
            cmdBuffer->draw(instance.ia);
        }
    }
}

void RenderInstancedQueue::add(InstancedBuffer *instancedBuffer) {
    _queues.emplace(instancedBuffer);
}

} // namespace pipeline
} // namespace cc
