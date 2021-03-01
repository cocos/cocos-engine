/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "PipelineStateManager.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXInputAssembler.h"
#include "gfx-base/GFXRenderPass.h"
#include "gfx-base/GFXShader.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
map<uint, gfx::PipelineState *> PipelineStateManager::_PSOHashMap;
gfx::PipelineState *            PipelineStateManager::getOrCreatePipelineState(const PassView *     pass,
                                                                   gfx::Shader *        shader,
                                                                   gfx::InputAssembler *inputAssembler,
                                                                   gfx::RenderPass *    renderPass) {
    const auto passHash       = pass->hash;
    const auto renderPassHash = renderPass->getHash();
    const auto iaHash         = inputAssembler->getAttributesHash();
    const auto shaderID       = shader->getID();
    const auto hash           = passHash ^ renderPassHash ^ iaHash ^ shaderID;

    auto pso = _PSOHashMap[hash];
    if (!pso) {
        auto                   pipelineLayout = pass->getPipelineLayout();
        gfx::PipelineStateInfo info           = {
            shader,
            pipelineLayout,
            renderPass,
            {inputAssembler->getAttributes()},
            *(pass->getRasterizerState()),
            *(pass->getDepthStencilState()),
            *(pass->getBlendState()),
            pass->getPrimitive(),
            pass->getDynamicState()};

        pso               = gfx::Device::getInstance()->createPipelineState(std::move(info));
        _PSOHashMap[hash] = pso;
    }

    return pso;
}

gfx::PipelineState *PipelineStateManager::getOrCreatePipelineStateByJS(uint32_t             passHandle,
                                                                       gfx::Shader *        shader,
                                                                       gfx::InputAssembler *inputAssembler,
                                                                       gfx::RenderPass *    renderPass) {
    const auto pass = GET_PASS(passHandle);
    CC_ASSERT(pass);
    return PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass);
}

} // namespace pipeline
} // namespace cc
