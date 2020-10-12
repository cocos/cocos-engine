#include "ShadowMapBatchedQueue.h"
#include "Define.h"
#include "PipelineStateManager.h"
#include "gfx/GFXCommandBuffer.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
ShadowMapBatchedQueue::~ShadowMapBatchedQueue() {
    destroy();
}

void ShadowMapBatchedQueue::clear(gfx::Buffer *buffer) {
    _subModels.clear();
    _shaders.clear();
    _passes.clear();
    _buffer = buffer;
}

void ShadowMapBatchedQueue::add(const RenderObject &renderObject, uint subModelIdx, uint passIdx) {
    const auto subModelID = renderObject.model->getSubModelID();
    const auto subModel = renderObject.model->getSubModelView(subModelID[subModelIdx]);
    const auto pass = subModel->getPassView(passIdx);

    if (pass->phase == _phaseID) {
        if (_buffer) {
            auto shader = subModel->getShader(passIdx);
            _subModels.emplace_back(subModel);
            _shaders.emplace_back(shader);
            _passes.emplace_back(pass);
        } else {
            clear(nullptr);
        }
    }
}

void ShadowMapBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    for (size_t i = 0; i < _subModels.size(); i++) {
        auto subModel = _subModels[i];
        auto shader = _shaders[i];
        auto pass = _passes[i];
        auto ia = subModel->getInputAssembler();
        auto pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(static_cast<uint>(SetIndex::MATERIAL), pass->getDescriptorSet());
        cmdBuffer->bindDescriptorSet(static_cast<uint>(SetIndex::LOCAL), subModel->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);
        cmdBuffer->draw(ia);
    }
}

void ShadowMapBatchedQueue::destroy() {
}
} // namespace pipeline
} // namespace cc
