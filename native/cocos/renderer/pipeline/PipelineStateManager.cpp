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

#include "PipelineStateManager.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"
#include "scene/Pass.h"

namespace cc {
namespace pipeline {

ccstd::unordered_map<ccstd::hash_t, IntrusivePtr<gfx::PipelineState>> PipelineStateManager::psoHashMap;

gfx::PipelineState *PipelineStateManager::getOrCreatePipelineState(const scene::Pass *pass,
                                                                   gfx::Shader *shader,
                                                                   gfx::InputAssembler *inputAssembler,
                                                                   gfx::RenderPass *renderPass,
                                                                   uint32_t subpass) {
    const auto passHash = pass->getHash();
    const auto renderPassHash = renderPass->getHash();
    const auto iaHash = inputAssembler->getAttributesHash();
    const auto shaderID = shader->getTypedID();
    auto hash = passHash ^ renderPassHash ^ iaHash ^ shaderID;
    if (subpass != 0) {
        hash = hash << subpass;
    }

    auto *pso = psoHashMap[static_cast<ccstd::hash_t>(hash)].get();
    if (!pso) {
        auto *pipelineLayout = pass->getPipelineLayout();

        pso = gfx::Device::getInstance()->createPipelineState({shader,
                                                               pipelineLayout,
                                                               renderPass,
                                                               {inputAssembler->getAttributes()},
                                                               *(pass->getRasterizerState()),
                                                               *(pass->getDepthStencilState()),
                                                               *(pass->getBlendState()),
                                                               pass->getPrimitive(),
                                                               pass->getDynamicStates(),
                                                               gfx::PipelineBindPoint::GRAPHICS,
                                                               subpass});

        psoHashMap[static_cast<ccstd::hash_t>(hash)] = pso;
    }

    return pso;
}

void PipelineStateManager::destroyAll() {
    for (auto &pair : psoHashMap) {
        CC_SAFE_DESTROY_NULL(pair.second);
    }
    psoHashMap.clear();
}

} // namespace pipeline
} // namespace cc
