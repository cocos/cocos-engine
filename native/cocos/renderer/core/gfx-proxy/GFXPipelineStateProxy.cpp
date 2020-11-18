#include "CoreStd.h"
#include "GFXPipelineStateProxy.h"
#include "GFXShaderProxy.h"
#include "GFXDeviceProxy.h"

namespace cc {
namespace gfx {

bool PipelineStateProxy::initialize(const PipelineStateInfo &info) {
    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _renderPass = info.renderPass;
    _pipelineLayout = info.pipelineLayout;

    PipelineStateInfo remoteInfo = info;
    remoteInfo.shader = ((ShaderProxy*)info.shader)->GetRemote();

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        PipelineStateInit,
        remote, GetRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void PipelineStateProxy::destroy() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        PipelineStateDestroy,
        remote, GetRemote(),
        {
            remote->destroy();
        });
}

} // namespace gfx
} // namespace cc
