/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "NativePipelineTypes.h"
#include "pipeline/custom/GslUtils.h"
#include "pipeline/custom/RenderCommonTypes.h"
#include "pipeline/custom/RenderInterfaceFwd.h"
#include "scene/RenderScene.h"
#include "scene/RenderWindow.h"

namespace cc {

namespace render {

NativePipeline::NativePipeline() noexcept {
    CC_EXPECTS(true);
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addRenderTexture(const std::string& name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow* renderWindow) {
    return 0;
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addRenderTarget(const std::string& name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) {
    return 0;
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addDepthStencil(const std::string& name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) {
    return 0;
}

void NativePipeline::beginFrame(pipeline::PipelineSceneData* pplScene) {

}

void NativePipeline::endFrame() {

}

// NOLINTNEXTLINE
RasterPassBuilder* NativePipeline::addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName, const std::string& name) {
    return nullptr;
}

// NOLINTNEXTLINE
RasterPassBuilder* NativePipeline::addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName) {
    return nullptr;
}

// NOLINTNEXTLINE
ComputePassBuilder* NativePipeline::addComputePass(const std::string& layoutName, const std::string& name) {
    return nullptr;
}

// NOLINTNEXTLINE
ComputePassBuilder* NativePipeline::addComputePass(const std::string& layoutName) {
    return nullptr;
}

// NOLINTNEXTLINE
MovePassBuilder* NativePipeline::addMovePass(const std::string& name) {
    return nullptr;
}

// NOLINTNEXTLINE
CopyPassBuilder* NativePipeline::addCopyPass(const std::string& name) {
    return nullptr;
}

// NOLINTNEXTLINE
void NativePipeline::addPresentPass(const std::string& name, const std::string& swapchainName) {

}

// NOLINTNEXTLINE
SceneTransversal* NativePipeline::createSceneTransversal(const scene::Camera* camera, const scene::RenderScene* scene) {
    return nullptr;
}

// NOLINTNEXTLINE
bool NativePipeline::activate(gfx::Swapchain * swapchain) {
    return true;
}

bool NativePipeline::destroy() noexcept {
    return true;
}

// NOLINTNEXTLINE
void NativePipeline::render(const std::vector<const scene::Camera*>& cameras) {
}

const MacroRecord &NativePipeline::getMacros() const {
    return macros;
}

pipeline::GlobalDSManager *NativePipeline::getGlobalDSManager() const {
    return globalDSManager;
}

gfx::DescriptorSetLayout *NativePipeline::getDescriptorSetLayout() const {
    return globalDSManager->getDescriptorSetLayout();
}

pipeline::PipelineSceneData *NativePipeline::getPipelineSceneData() const {
    return pipelineSceneData;
}

const std::string &NativePipeline::getConstantMacros() const {
    return constantMacros;
}

scene::Model *NativePipeline::getProfiler() const {
    return profiler;
}

// NOLINTNEXTLINE
void NativePipeline::setProfiler(scene::Model *profilerIn) {
    profiler = profilerIn;
}

float NativePipeline::getShadingScale() const {
    return 0;
}

void NativePipeline::setShadingScale(float scale) {
}

void NativePipeline::onGlobalPipelineStateChanged() {
}

} // namespace render

} // namespace cc
