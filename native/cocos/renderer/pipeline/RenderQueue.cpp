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

#include "RenderQueue.h"

#include <utility>
#include "PipelineStateManager.h"
#include "RenderPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXShader.h"
#include "scene/SubModel.h"

namespace cc {
namespace pipeline {

RenderQueue::RenderQueue(RenderPipeline *pipeline, RenderQueueCreateInfo desc, bool useOcclusionQuery)
: _pipeline(pipeline), _passDesc(std::move(desc)), _useOcclusionQuery(useOcclusionQuery) {
}

void RenderQueue::clear() {
    _queue.clear();
}

bool RenderQueue::insertRenderPass(const RenderObject &renderObj, uint subModelIdx, uint passIdx) {
    const auto *const subModel      = renderObj.model->getSubModels()[subModelIdx];
    const auto *const pass          = subModel->getPass(passIdx);
    const bool        isTransparent = pass->getBlendState()->targets[0].blend;

    if (isTransparent != _passDesc.isTransparent || !(pass->getPhase() & _passDesc.phases)) {
        return false;
    }

    auto       passPriority  = static_cast<uint32_t>(pass->getPriority());
    auto       modelPriority = static_cast<uint32_t>(subModel->getPriority());
    auto       shaderId      = static_cast<uint32_t>(reinterpret_cast<uintptr_t>(subModel->getShader(passIdx)));
    const auto hash          = (0 << 30) | (passPriority << 16) | (modelPriority << 8) | passIdx;
    RenderPass renderPass    = {hash, renderObj.depth, shaderId, passIdx, subModel};
    _queue.emplace_back(renderPass);

    return true;
}

void RenderQueue::sort() {
#if CC_PLATFORM != CC_PLATFORM_LINUX && CC_PLATFORM != CC_PLATFORM_QNX
    std::sort(_queue.begin(), _queue.end(), _passDesc.sortFunc);
#else
    //cannot use std::function as comparator in algorithms https://gcc.gnu.org/bugzilla/show_bug.cgi?id=65942#c11
    std::sort(_queue.begin(), _queue.end(), [this](const RenderPass &a, const RenderPass &b) -> bool {
        return _passDesc.sortFunc(a, b);
    });
#endif
}

void RenderQueue::recordCommandBuffer(gfx::Device * /*device*/, scene::Camera *camera, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, uint32_t subpassIndex) {
    PipelineSceneData *const              sceneData            = _pipeline->getPipelineSceneData();
    const scene::PipelineSharedSceneData *sharedData           = sceneData->getSharedData();
    bool                                  enableOcclusionQuery = _pipeline->getOcclusionQueryEnabled() && _useOcclusionQuery;
    auto *                                queryPool            = _pipeline->getQueryPools()[0];
    for (auto &i : _queue) {
        const auto *subModel = i.subModel;
        if (enableOcclusionQuery) {
            cmdBuff->beginQuery(queryPool, subModel->getId());
        }

        if (enableOcclusionQuery && _pipeline->isOccluded(camera, subModel)) {
            auto *      inputAssembler = sharedData->occlusionQueryInputAssembler;
            const auto *pass           = sharedData->occlusionQueryPass;
            auto *      shader         = sharedData->occlusionQueryShader;
            auto *      pso            = PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass, subpassIndex);

            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            cmdBuff->bindDescriptorSet(localSet, subModel->getWorldBoundDescriptorSet());
            cmdBuff->bindInputAssembler(inputAssembler);
            cmdBuff->draw(inputAssembler);
        } else {
            const auto  passIdx        = i.passIndex;
            auto *      inputAssembler = subModel->getInputAssembler();
            const auto *pass           = subModel->getPass(passIdx);
            auto *      shader         = subModel->getShader(passIdx);
            auto *      pso            = PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass, subpassIndex);

            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            cmdBuff->bindDescriptorSet(localSet, subModel->getDescriptorSet());
            cmdBuff->bindInputAssembler(inputAssembler);
            cmdBuff->draw(inputAssembler);
        }

        if (enableOcclusionQuery) {
            cmdBuff->endQuery(queryPool, subModel->getId());
        }
    }
}

} // namespace pipeline
} // namespace cc
