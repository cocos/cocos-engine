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

#include "renderer/pipeline/helper/Utils.h"
#include "renderer/pipeline/PipelineStateManager.h"

#include "gfx-base/GFXSwapchain.h"
#include "pipeline/Define.h"
#include "scene/Camera.h"
#include "scene/Model.h"
#include "scene/RenderWindow.h"
#include "scene/SubModel.h"
#include "scene/Pass.h"

namespace cc {
namespace pipeline {

const scene::Camera *profilerCamera{nullptr};

void decideProfilerCamera(const vector<scene::Camera *> &cameras) {
    for (int i = static_cast<int>(cameras.size() - 1); i >= 0; --i) {
        if (cameras[i]->getWindow()->getSwapchain()) {
            profilerCamera = cameras[i];
            return;
        }
    }
    profilerCamera = nullptr;
}

void renderProfiler(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, scene::Model *profiler, const scene::Camera *camera) {
    if (profiler && profiler->isEnabled() && camera == profilerCamera) {
        const auto &submodel = profiler->getSubModels()[0];
        auto *      pass     = submodel->getPass(0);
        auto *      ia       = submodel->getInputAssembler();
        auto *      pso      = PipelineStateManager::getOrCreatePipelineState(pass, submodel->getShader(0), ia, renderPass);

        gfx::Viewport profilerViewport;
        gfx::Rect     profilerScissor;
        profilerViewport.width = profilerScissor.width = camera->getWindow()->getWidth();
        profilerViewport.height = profilerScissor.height = camera->getWindow()->getHeight();
        cmdBuff->setViewport(profilerViewport);
        cmdBuff->setScissor(profilerScissor);

        cmdBuff->bindPipelineState(pso);
        cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        cmdBuff->bindDescriptorSet(localSet, submodel->getDescriptorSet());
        cmdBuff->bindInputAssembler(ia);
        cmdBuff->draw(ia);
    }
}

} // namespace pipeline
} // namespace cc
