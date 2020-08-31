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
    const auto subModel = GET_SUBMODEL(subModelIdx);
    const auto pass = GET_PASS(subModel->pass0ID + passIdx);

    if (pass->phase == _phaseID) {
        if (_buffer) {
            auto shader = GET_SHADER(subModel->shader0ID + passIdx);
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
        auto ia = GET_IA(subModel->inputAssemblerID);
        auto pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(static_cast<uint>(SetIndex::MATERIAL), GET_DESCRIPTOR_SET(pass->descriptorSetID));
        cmdBuffer->bindDescriptorSet(static_cast<uint>(SetIndex::LOCAL), GET_DESCRIPTOR_SET(subModel->descriptorSetID));
        cmdBuffer->bindInputAssembler(ia);
        cmdBuffer->draw(ia);
    }
}

void ShadowMapBatchedQueue::destroy() {
}
} // namespace pipeline
} // namespace cc
