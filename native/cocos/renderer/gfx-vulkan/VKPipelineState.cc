#include "VKStd.h"

#include "VKCommands.h"
#include "VKPipelineLayout.h"
#include "VKPipelineState.h"
#include "VKRenderPass.h"
#include "VKShader.h"

namespace cc {
namespace gfx {

CCVKPipelineState::CCVKPipelineState(Device *device)
: PipelineState(device) {
}

CCVKPipelineState::~CCVKPipelineState() {
}

bool CCVKPipelineState::initialize(const PipelineStateInfo &info) {
    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _layout = info.layout;
    _renderPass = info.renderPass;

    _gpuPipelineState = CC_NEW(CCVKGPUPipelineState);
    _gpuPipelineState->primitive = _primitive;
    _gpuPipelineState->gpuShader = ((CCVKShader *)_shader)->gpuShader();
    _gpuPipelineState->inputState = _inputState;
    _gpuPipelineState->rs = _rasterizerState;
    _gpuPipelineState->dss = _depthStencilState;
    _gpuPipelineState->bs = _blendState;
    _gpuPipelineState->dynamicStates = _dynamicStates;
    _gpuPipelineState->gpuLayout = ((CCVKPipelineLayout *)_layout)->gpuPipelineLayout();
    _gpuPipelineState->gpuRenderPass = ((CCVKRenderPass *)_renderPass)->gpuRenderPass();

    CCVKCmdFuncCreatePipelineState((CCVKDevice *)_device, _gpuPipelineState);

    _status = Status::SUCCESS;

    return true;
}

void CCVKPipelineState::destroy() {
    if (_gpuPipelineState) {
        CCVKCmdFuncDestroyPipelineState((CCVKDevice *)_device, _gpuPipelineState);
        CC_DELETE(_gpuPipelineState);
        _gpuPipelineState = nullptr;
    }
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
