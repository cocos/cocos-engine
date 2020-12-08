#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDeviceProxy.h"
#include "GFXPipelineLayoutProxy.h"
#include "GFXPipelineStateProxy.h"
#include "GFXRenderPassProxy.h"
#include "GFXShaderProxy.h"

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
    remoteInfo.shader = ((ShaderProxy *)info.shader)->getRemote();
    remoteInfo.renderPass = ((RenderPassProxy *)info.renderPass)->getRemote();
    remoteInfo.pipelineLayout = ((PipelineLayoutProxy *)info.pipelineLayout)->getRemote();

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        PipelineStateInit,
        remote, getRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void PipelineStateProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            PipelineStateDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

} // namespace gfx
} // namespace cc
