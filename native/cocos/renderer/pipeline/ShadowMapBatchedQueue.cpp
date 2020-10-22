#include "ShadowMapBatchedQueue.h"
#include "BatchedBuffer.h"
#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "gfx/GFXCommandBuffer.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
ShadowMapBatchedQueue::ShadowMapBatchedQueue()
: _phaseID(PassPhase::getPhaseID("shadow-caster")) {
}

void ShadowMapBatchedQueue::clear(gfx::Buffer *buffer) {
    _subModels.clear();
    _shaders.clear();
    _passes.clear();
    _instancedQueue->clear();
    _batchedQueue->clear();
    _buffer = buffer;
}

void ShadowMapBatchedQueue::add(const RenderObject &renderObject, uint subModelIdx, uint passIdx) {
    const auto subModelID = renderObject.model->getSubModelID();
    const auto subModel = renderObject.model->getSubModelView(subModelID[subModelIdx]);
    const auto pass = subModel->getPassView(passIdx);

    if (pass->phase == _phaseID) {
        if (_buffer) {
            if (pass->getBatchingScheme() == BatchingSchemes::INSTANCING) { // instancing
                const auto buffer = InstancedBuffer::get(passIdx);
                buffer->merge(renderObject.model, subModel, passIdx);
                _instancedQueue->add(buffer);
            } else if (pass->getBatchingScheme() == BatchingSchemes::VB_MERGING) { // vb-merging
                const auto buffer = BatchedBuffer::get(passIdx);
                buffer->merge(subModel, passIdx, &renderObject);
                _batchedQueue->add(buffer);
            } else { // standard draw
                auto shader = subModel->getShader(passIdx);
                _subModels.emplace_back(subModel);
                _shaders.emplace_back(shader);
                _passes.emplace_back(pass);
            }
        } else {
            _subModels.clear();
            _shaders.clear();
            _passes.clear();
            _instancedQueue->clear();
            _batchedQueue->clear();
        }
    }
}

void ShadowMapBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    for (size_t i = 0; i < _subModels.size(); i++) {
        auto subModel = _subModels[i];
        auto shader = _shaders[i];
        auto pass = _passes[i];
        auto ia = subModel->getInputAssembler();
        auto pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
        cmdBuffer->bindDescriptorSet(LOCAL_SET, subModel->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);
        cmdBuffer->draw(ia);
    }
}

void ShadowMapBatchedQueue::destroy() {
}
} // namespace pipeline
} // namespace cc
