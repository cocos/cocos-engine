#include "GLESPipelineState.h"
#include "GLESRenderPass.h"
#include "GLESPipelineLayout.h"
#include "GLESShader.h"
#include "GLESDevice.h"

namespace cc::gfx {
namespace {
// return ture if shader source is updated.
void updateGPUShaderSourceByRenderPass(GLESGPUShader *gpuShader, GLESGPURenderPass *renderPass, uint32_t subpassIndex) {
    CC_ASSERT(subpassIndex < renderPass->subpasses.size());
    if (renderPass->subpasses[subpassIndex].inputs.empty()) {
        return;
    }

    auto iter = std::find_if(gpuShader->stages.begin(), gpuShader->stages.end(), [](const GLESGPUShader::Stage &stage) {
        return stage.type == ShaderStageFlagBit::FRAGMENT;
    });
    if (iter == gpuShader->stages.end()) {
        return;
    }
    auto &drawBuffers = renderPass->drawBuffers.at(subpassIndex);
    ccstd::string::size_type offset = 0;
    for (uint32_t i = 0; i < drawBuffers.size(); ++i) {
        const char* layoutPrefix = "layout(location = ";

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
            source[loc] = static_cast<char>('0' + drawBuffers[i]);
            offset = loc;
        }
    }
}

void initProgram(GLESDevice *device, GLESGPUPipelineState *gpuPipelineState) {
    updateGPUShaderSourceByRenderPass(gpuPipelineState->gpuShader, gpuPipelineState->gpuRenderPass, gpuPipelineState->subpassIndex);
    glesCreateShaderByBinary(device, gpuPipelineState->gpuShader, gpuPipelineState->gpuPipelineLayout->hash);
    if (gpuPipelineState->gpuShader->glProgram == 0) {
        glesCreateShaderBySource(device, gpuPipelineState->gpuShader, gpuPipelineState->gpuPipelineLayout->hash);
    }

    CC_ASSERT(gpuPipelineState->gpuShader->glProgram);

    // Clear shader source after they're uploaded to GPU
    for (auto &stage : gpuPipelineState->gpuShader->stages) {
        stage.source.clear();
        stage.source.shrink_to_fit();
    }
}
} // namespace

GLESPipelineState::GLESPipelineState() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESPipelineState::~GLESPipelineState() {
    destroy();
}

void GLESPipelineState::doInit(const PipelineStateInfo & /*info*/) {
    _gpuPipelineState = ccnew GLESGPUPipelineState;
    _gpuPipelineState->rs = _rasterizerState;
    _gpuPipelineState->dss = _depthStencilState;
    _gpuPipelineState->bs = _blendState;
    _gpuPipelineState->subpassIndex = _subpass;
    _gpuPipelineState->gpuPipelineLayout = static_cast<GLESPipelineLayout *>(_pipelineLayout)->gpuPipelineLayout();
    _gpuPipelineState->gpuShader = static_cast<GLESShader *>(_shader)->gpuShader();
    if (_renderPass) _gpuPipelineState->gpuRenderPass = static_cast<GLESRenderPass *>(_renderPass)->gpuRenderPass();

    for (uint32_t i = 0; i < 31; i++) {
        if (static_cast<uint32_t>(_dynamicStates) & (1 << i)) {
            _gpuPipelineState->dynamicStates.push_back(static_cast<DynamicStateFlagBit>(1 << i));
        }
    }

    auto *device = GLESDevice::getInstance();
    initProgram(device, _gpuPipelineState);
    glesCreatePipelineState(device, _gpuPipelineState);
}

void GLESPipelineState::doDestroy() {
    _gpuPipelineState = nullptr;
}

GLESGPUPipelineState::~GLESGPUPipelineState() {
    glesDestroyPipelineState(GLESDevice::getInstance(), this);
}

} // namespace cc::gfx
