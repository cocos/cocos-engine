/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#include "GLES3Std.h"

#include "GLES3Commands.h"
#include "GLES3Device.h"
#include "GLES3PipelineLayout.h"
#include "GLES3PipelineState.h"
#include "GLES3RenderPass.h"
#include "GLES3Shader.h"

namespace cc {
namespace gfx {

const GLenum GLE_S3_PRIMITIVES[] = {
    GL_POINTS,
    GL_LINES,
    GL_LINE_STRIP,
    GL_LINE_LOOP,
    GL_NONE,
    GL_NONE,
    GL_NONE,
    GL_TRIANGLES,
    GL_TRIANGLE_STRIP,
    GL_TRIANGLE_FAN,
    GL_NONE,
    GL_NONE,
    GL_NONE,
    GL_NONE,
};

namespace {
void updateGPUShaderSourceByRenderPass(GLES3GPUShader *gpuShader, GLES3GPURenderPass *renderPass, uint32_t subpassIndex) {
    auto iter = std::find_if(gpuShader->gpuStages.begin(), gpuShader->gpuStages.end(), [](const GLES3GPUShaderStage &stage) {
        return stage.type == ShaderStageFlagBit::FRAGMENT;
    });
    if (iter == gpuShader->gpuStages.end()) {
        return;
    }

    CC_ASSERT(subpassIndex < renderPass->subpasses.size());
    if (renderPass->subpasses.size() <= 1) {
        return;
    }
    bool dsInput{false};
    if (renderPass->depthStencil != INVALID_BINDING && !renderPass->subpasses[subpassIndex].inputs.empty()) {
        const auto &inputs = renderPass->subpasses[subpassIndex].inputs;
        // depth stencil input should always lies at the end of index list.
        dsInput = inputs.back() == renderPass->depthStencil;
    }

    auto &drawBuffers = renderPass->drawBuffers.at(subpassIndex);
    ccstd::string::size_type offset = 0;
    for (uint32_t i = 0; i < drawBuffers.size(); ++i) {
        const char *layoutPrefix = "layout(location = ";

        std::stringstream ss1;
        ss1 << layoutPrefix << i << ") out";

        std::stringstream ss2;
        ss2 << layoutPrefix << i << ") inout";

        auto &source = iter->source;
        auto sIter = source.find(ss1.str(), offset);
        if (sIter == std::string::npos) {
            sIter = source.find(ss2.str(), offset);
        }

        if (sIter != std::string::npos) {
            auto loc = sIter + strlen(layoutPrefix);
            source[loc] = drawBuffers[i] + '0';
            offset = loc;
        }
    }
}

void initGpuShader(GLES3GPUShader *gpuShader, GLES3GPUPipelineLayout *gpuPipelineLayout, GLES3GPURenderPass *renderPass, uint32_t subpassIndex) {
    updateGPUShaderSourceByRenderPass(gpuShader, renderPass, subpassIndex);
    cmdFuncGLES3CreateShader(GLES3Device::getInstance(), gpuShader, gpuPipelineLayout);
    CC_ASSERT(gpuShader->glProgram);

    // Clear shader source after they're uploaded to GPU
    for (auto &stage : gpuShader->gpuStages) {
        stage.source.clear();
        stage.source.shrink_to_fit();
    }
}

} // namespace

GLES3PipelineState::GLES3PipelineState() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3PipelineState::~GLES3PipelineState() {
    destroy();
}

void GLES3PipelineState::doInit(const PipelineStateInfo & /*info*/) {
    _gpuPipelineState = ccnew GLES3GPUPipelineState;
    _gpuPipelineState->glPrimitive = GLE_S3_PRIMITIVES[static_cast<int>(_primitive)];
    _gpuPipelineState->rs = _rasterizerState;
    _gpuPipelineState->dss = _depthStencilState;
    _gpuPipelineState->bs = _blendState;
    _gpuPipelineState->gpuPipelineLayout = static_cast<GLES3PipelineLayout *>(_pipelineLayout)->gpuPipelineLayout();
    _gpuPipelineState->gpuShader = static_cast<GLES3Shader *>(_shader)->gpuShader();
    if (_renderPass) _gpuPipelineState->gpuRenderPass = static_cast<GLES3RenderPass *>(_renderPass)->gpuRenderPass();
    if (_gpuPipelineState->gpuShader->glProgram == 0) {
        initGpuShader(_gpuPipelineState->gpuShader, _gpuPipelineState->gpuPipelineLayout, _gpuPipelineState->gpuRenderPass, _subpass);
    }

    if (_renderPass) _gpuPipelineState->gpuRenderPass = static_cast<GLES3RenderPass *>(_renderPass)->gpuRenderPass();

    for (uint32_t i = 0; i < 31; i++) {
        if (static_cast<uint32_t>(_dynamicStates) & (1 << i)) {
            _gpuPipelineState->dynamicStates.push_back(static_cast<DynamicStateFlagBit>(1 << i));
        }
    }
}

void GLES3PipelineState::doDestroy() {
    CC_SAFE_DELETE(_gpuPipelineState);
}

} // namespace gfx
} // namespace cc
