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

#include "renderer/pipeline/helper/Utils.h"
#include "renderer/pipeline/PipelineStateManager.h"
#if CC_USE_DEBUG_RENDERER
    #include "profiler/DebugRenderer.h"
#endif
#include "gfx-base/GFXSwapchain.h"
#include "pipeline/Define.h"
#include "scene/Camera.h"
#include "scene/Model.h"
#include "scene/Pass.h"
#include "scene/RenderWindow.h"
#include "scene/SubModel.h"

namespace cc {
namespace pipeline {

const scene::Camera *profilerCamera{nullptr};

void decideProfilerCamera(const ccstd::vector<scene::Camera *> &cameras) {
    for (int i = static_cast<int>(cameras.size() - 1); i >= 0; --i) {
        if (cameras[i]->getWindow()->getSwapchain()) {
            profilerCamera = cameras[i];
            return;
        }
    }
    profilerCamera = nullptr;
}

void renderProfiler(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, scene::Model *profiler, const scene::Camera *camera) {
    if (!profiler || !profiler->isEnabled()) {
        return;
    }

#if CC_EDITOR
    if (!(camera->getVisibility() & static_cast<uint32_t>(pipeline::LayerList::PROFILER))) {
        return;
    }
#else
    if (camera != profilerCamera) {
        return;
    }
#endif

    const auto &submodel = profiler->getSubModels()[0];
    auto *pass = submodel->getPass(0);
    auto *ia = submodel->getInputAssembler();
    auto *pso = PipelineStateManager::getOrCreatePipelineState(pass, submodel->getShader(0), ia, renderPass);

    gfx::Viewport profilerViewport;
    gfx::Rect profilerScissor;
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

#if CC_USE_DEBUG_RENDERER
void renderDebugRenderer(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, PipelineSceneData *sceneData, const scene::Camera *camera) {
    if (camera != profilerCamera) {
        return;
    }

    CC_DEBUG_RENDERER->render(renderPass, cmdBuff, sceneData);
}
#endif

} // namespace pipeline
} // namespace cc
