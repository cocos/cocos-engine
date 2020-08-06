#include "PipelineStateManager.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXInputAssembler.h"
#include "gfx/GFXRenderPass.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
map<uint, gfx::PipelineState *> PipelineStateManager::_PSOHashMap;
gfx::PipelineState *PipelineStateManager::getOrCreatePipelineStage(const PipelineStateInfo *psoci,
                                                                   const Pass *pass,
                                                                   const gfx::InputAssembler *inputAssembler,
                                                                   gfx::RenderPass *renderPass) {
   const auto passHash = pass->hash;
   const auto iaHash = inputAssembler->getAttributesHash();
   const auto hash = passHash ^ passHash ^ iaHash;

   auto pso = _PSOHashMap[hash];
   if (!pso) {
      gfx::PipelineStateInfo info = {
          static_cast<gfx::PrimitiveMode>(pass->primitive),
          GET_SHADER(psoci->shaderID),
          {inputAssembler->getAttributes()},
          *(GET_RASTERIZER_STATE(pass->rasterizerStateID)),
          *(GET_DEPTH_STENCIL_STATE(pass->depthStencilStateID)),
          *(GET_BLEND_STATE(pass->blendStateID)),
          static_cast<gfx::DynamicStateFlags>(pass->dynamicState),
          renderPass};

      pso = gfx::Device::getInstance()->createPipelineState(std::move(info));
       _PSOHashMap[hash] = pso;
   }

   return pso;
}

} // namespace pipeline
} // namespace cc
