#include "CoreStd.h"

#include "base/threading/MessageQueue.h"
#include "GFXDeviceAgent.h"
#include "GFXPipelineLayoutAgent.h"
#include "GFXPipelineStateAgent.h"
#include "GFXRenderPassAgent.h"
#include "GFXShaderAgent.h"

namespace cc {
namespace gfx {

PipelineStateAgent::~PipelineStateAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        PipelineStateDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool PipelineStateAgent::initialize(const PipelineStateInfo &info) {
    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _bindPoint = info.bindPoint;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _renderPass = info.renderPass;
    _pipelineLayout = info.pipelineLayout;

    PipelineStateInfo actorInfo = info;
    actorInfo.shader = ((ShaderAgent *)info.shader)->getActor();
    actorInfo.pipelineLayout = ((PipelineLayoutAgent *)info.pipelineLayout)->getActor();
    if (info.renderPass) actorInfo.renderPass = ((RenderPassAgent *)info.renderPass)->getActor();

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        PipelineStateInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void PipelineStateAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        PipelineStateDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
