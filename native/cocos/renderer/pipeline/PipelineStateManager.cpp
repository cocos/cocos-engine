#include "PipelineStateManager.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXInputAssembler.h"
#include "gfx/GFXRenderPass.h"
#include "helper/SharedMemoryPool.h"

namespace cc {
namespace pipeline {
map<uint, gfx::PipelineState *> PipelineStateManager::_PSOHashMap;
gfx::PipelineState *PipelineStateManager::getOrCreatePipelineStage(const gfx::PipelineStateInfo *psoci,
                                                                   const gfx::InputAssembler *inputAssembler,
                                                                   size_t passHash,
                                                                   gfx::RenderPass *renderPass) {
    const auto renderPassHash = renderPass->getHash();
    const auto iaHash = inputAssembler->getAttributesHash();
    const auto hash = passHash ^ renderPassHash ^ iaHash;

    auto pso = _PSOHashMap[hash];
    if (!pso) {
        gfx::PipelineStateInfo info = {
            psoci->primitive,
            psoci->shader,
            {inputAssembler->getAttributes()},
            psoci->rasterizerState,
            psoci->depthStencilState,
            psoci->blendState,
            psoci->dynamicStates,
            renderPass};

        pso = gfx::Device::getInstance()->createPipelineState(std::move(info));
        _PSOHashMap[hash] = pso;
    }

    return pso;
}

} // namespace pipeline
} // namespace cc
