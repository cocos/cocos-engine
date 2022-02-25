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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/renderer/pipeline/custom/NativePipelineFwd.h"
#include "cocos/renderer/pipeline/custom/RenderCompilerTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {

namespace render {

class NativePipeline final : public Pipeline {
public:
    uint32_t addRenderTexture(const std::string& name, gfx::Format format, uint32_t width, uint32_t height) override;
    uint32_t addRenderTarget(const std::string& name, gfx::Format format, uint32_t width, uint32_t height) override;
    uint32_t addDepthStencil(const std::string& name, gfx::Format format, uint32_t width, uint32_t height) override;
    void beginFrame(pipeline::PipelineSceneData* pplScene) override;
    void endFrame() override;
    RasterPassBuilder* addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName, const std::string& name) override;
    RasterPassBuilder* addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName) override;
    ComputePassBuilder* addComputePass(const std::string& layoutName, const std::string& name) override;
    ComputePassBuilder* addComputePass(const std::string& layoutName) override;
    MovePassBuilder* addMovePass(const std::string& name) override;
    CopyPassBuilder* addCopyPass(const std::string& name) override;
    void addPresentPass(const std::string& name, const std::string& swapchainName) override;
};

} // namespace render

} // namespace cc

// clang-format on
