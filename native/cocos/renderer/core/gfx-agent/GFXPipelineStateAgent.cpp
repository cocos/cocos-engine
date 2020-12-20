#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDeviceAgent.h"
#include "GFXPipelineLayoutAgent.h"
#include "GFXPipelineStateAgent.h"
#include "GFXRenderPassAgent.h"
#include "GFXShaderAgent.h"

namespace cc {
namespace gfx {

bool PipelineStateAgent::initialize(const PipelineStateInfo &info) {
    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _renderPass = info.renderPass;
    _pipelineLayout = info.pipelineLayout;

    PipelineStateInfo actorInfo = info;
    actorInfo.shader = ((ShaderAgent *)info.shader)->getActor();
    actorInfo.renderPass = ((RenderPassAgent *)info.renderPass)->getActor();
    actorInfo.pipelineLayout = ((PipelineLayoutAgent *)info.pipelineLayout)->getActor();

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        PipelineStateInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void PipelineStateAgent::destroy() {
    if (_actor) {
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
            PipelineStateDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

} // namespace gfx
} // namespace cc
