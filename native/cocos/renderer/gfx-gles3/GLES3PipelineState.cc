#include "GLES3Std.h"
#include "GLES3PipelineState.h"
#include "GLES3Commands.h"
#include "GLES3Shader.h"
#include "GLES3RenderPass.h"

namespace cc {
namespace gfx {

const GLenum GLES3Primitives[] = {
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

GLES3PipelineState::GLES3PipelineState(Device *device)
: PipelineState(device) {
}

GLES3PipelineState::~GLES3PipelineState() {
}

bool GLES3PipelineState::initialize(const PipelineStateInfo &info) {

    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _renderPass = info.renderPass;

    _gpuPipelineState = CC_NEW(GLES3GPUPipelineState);
    _gpuPipelineState->glPrimitive = GLES3Primitives[(int)_primitive];
    _gpuPipelineState->gpuShader = ((GLES3Shader *)_shader)->gpuShader();
    _gpuPipelineState->rs = _rasterizerState;
    _gpuPipelineState->dss = _depthStencilState;
    _gpuPipelineState->bs = _blendState;
    _gpuPipelineState->gpuRenderPass = ((GLES3RenderPass *)_renderPass)->gpuRenderPass();

    for (uint i = 0; i < 31; i++) {
        if ((uint)_dynamicStates & (1 << i)) {
            _gpuPipelineState->dynamicStates.push_back((DynamicStateFlagBit)(1 << i));
        }
    }

    _status = Status::SUCCESS;

    return true;
}

void GLES3PipelineState::destroy() {
    if (_gpuPipelineState) {
        CC_DELETE(_gpuPipelineState);
        _gpuPipelineState = nullptr;
    }
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
