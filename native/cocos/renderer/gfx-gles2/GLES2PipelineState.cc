#include "GLES2Std.h"
#include "GLES2PipelineState.h"
#include "GLES2Commands.h"
#include "GLES2Shader.h"
#include "GLES2RenderPass.h"
#include "GLES2PipelineLayout.h"

namespace cc {
namespace gfx {

const GLenum GLES2Primitives[] = {
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

GLES2PipelineState::GLES2PipelineState(Device *device)
: PipelineState(device) {
}

GLES2PipelineState::~GLES2PipelineState() {
}

bool GLES2PipelineState::initialize(const PipelineStateInfo &info) {

    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _layout = info.layout;
    _renderPass = info.renderPass;

    _gpuPipelineState = CC_NEW(GLES2GPUPipelineState);
    _gpuPipelineState->glPrimitive = GLES2Primitives[(int)_primitive];
    _gpuPipelineState->gpuShader = ((GLES2Shader *)_shader)->gpuShader();
    _gpuPipelineState->rs = _rasterizerState;
    _gpuPipelineState->dss = _depthStencilState;
    _gpuPipelineState->bs = _blendState;
    _gpuPipelineState->dynamicStates = _dynamicStates;
    _gpuPipelineState->gpuLayout = ((GLES2PipelineLayout *)_layout)->gpuPipelineLayout();
    _gpuPipelineState->gpuRenderPass = ((GLES2RenderPass *)_renderPass)->gpuRenderPass();

    _status = Status::SUCCESS;

    return true;
}

void GLES2PipelineState::destroy() {
    if (_gpuPipelineState) {
        CC_DELETE(_gpuPipelineState);
        _gpuPipelineState = nullptr;
    }

    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
