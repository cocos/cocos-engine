#include "VKStd.h"

#include "VKCommands.h"
#include "VKShader.h"

namespace cc {

CCVKShader::CCVKShader(GFXDevice *device)
: GFXShader(device) {
}

CCVKShader::~CCVKShader() {
}

bool CCVKShader::initialize(const GFXShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    _gpuShader = CC_NEW(CCVKGPUShader);
    _gpuShader->name = _name;
    _gpuShader->attributes = _attributes;
    _gpuShader->blocks = _blocks;
    _gpuShader->samplers = _samplers;
    for (GFXShaderStage &stage : _stages) {
        _gpuShader->gpuStages.push_back({stage.type, stage.source, stage.macros});
    }

    CCVKCmdFuncCreateShader((CCVKDevice *)_device, _gpuShader);

    _status = GFXStatus::SUCCESS;

    return true;
}

void CCVKShader::destroy() {
    if (_gpuShader) {
        CCVKCmdFuncDestroyShader((CCVKDevice *)_device, _gpuShader);
        CC_DELETE(_gpuShader);
        _gpuShader = nullptr;
    }

    _status = GFXStatus::UNREADY;
}

}
