#include "VKStd.h"
#include "VKShader.h"
#include "VKCommands.h"

NS_CC_BEGIN

CCVKShader::CCVKShader(GFXDevice* device)
    : GFXShader(device)
{
}

CCVKShader::~CCVKShader()
{
}

bool CCVKShader::initialize(const GFXShaderInfo &info)
{
    _name = info.name;
    _stages = info.stages;
    _blocks = info.blocks;
    _samplers = info.samplers;

    _gpuShader = CC_NEW(CCVKGPUShader);
    _gpuShader->name = _name;
    _gpuShader->blocks = _blocks;
    _gpuShader->samplers = _samplers;
    for (const auto& stage : _stages)
    {
        CCVKGPUShaderStage gpuShaderStage = { stage.type, stage.source, stage.macros };
        _gpuShader->gpuStages.emplace_back(std::move(gpuShaderStage));
    }

    CCVKCmdFuncCreateShader((CCVKDevice*)_device, _gpuShader);

    _status = GFXStatus::SUCCESS;

    return true;
}

void CCVKShader::destroy()
{
    if (_gpuShader)
    {
        CCVKCmdFuncDestroyShader((CCVKDevice*)_device, _gpuShader);
        CC_DELETE(_gpuShader);
        _gpuShader = nullptr;
    }

    _status = GFXStatus::UNREADY;
}

NS_CC_END
