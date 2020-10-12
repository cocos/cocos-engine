#include "PipelineStateManager.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXInputAssembler.h"
#include "gfx/GFXRenderPass.h"
#include "gfx/GFXShader.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
map<uint, gfx::PipelineState *> PipelineStateManager::_PSOHashMap;
gfx::PipelineState *PipelineStateManager::getOrCreatePipelineState(const PassView *pass,
                                                                   gfx::Shader *shader,
                                                                   gfx::InputAssembler *inputAssembler,
                                                                   gfx::RenderPass *renderPass) {
    const auto passHash = pass->hash;
    const auto renderPassHash = renderPass->getHash();
    const auto iaHash = inputAssembler->getAttributesHash();
    const auto shaderID = shader->getID();
    const auto hash = passHash ^ renderPassHash ^ iaHash ^ shaderID;

    auto pso = _PSOHashMap[hash];
    if (!pso) {
        auto pipelineLayout = pass->getPipelineLayout();
        gfx::PipelineStateInfo info = {
            shader,
            pipelineLayout,
            renderPass,
            {inputAssembler->getAttributes()},
            *(pass->getRasterizerState()),
            *(pass->getDepthStencilState()),
            *(pass->getBlendState()),
            pass->getPrimitive(),
            pass->getDynamicState()};

        pso = gfx::Device::getInstance()->createPipelineState(std::move(info));
        _PSOHashMap[hash] = pso;
    }

    return pso;
}

gfx::PipelineState *PipelineStateManager::getOrCreatePipelineStateByJS(uint32_t passHandle,
                                                                       gfx::Shader *shader,
                                                                       gfx::InputAssembler *inputAssembler,
                                                                       gfx::RenderPass *renderPass) {
    const auto pass = GET_PASS(passHandle);
    CC_ASSERT(pass);
    return PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass);
}

} // namespace pipeline
} // namespace cc
