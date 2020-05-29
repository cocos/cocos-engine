#include "GLES3Std.h"
#include "GLES3Fence.h"
#include "GLES3Device.h"
#include "GLES3GPUObjects.h"

NS_CC_BEGIN

GLES3Fence::GLES3Fence(GFXDevice* device)
    : GFXFence(device)
{
}

GLES3Fence::~GLES3Fence()
{
}

bool GLES3Fence::initialize(const GFXFenceInfo &info)
{
    _gpuFence = CC_NEW(GLES3GPUFence);
    if (!_gpuFence)
    {
        CC_LOG_ERROR("GLES2Fence: CC_NEW GLES3GPUFence failed.");
        return false;
    }

    // TODO

    _status = GFXStatus::SUCCESS;
    return true;
}

void GLES3Fence::destroy()
{
    if (_gpuFence)
    {
        // TODO

        CC_DELETE(_gpuFence);
        _gpuFence = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

void GLES3Fence::wait()
{
    // TODO
}

void GLES3Fence::reset()
{
    // TODO
}

NS_CC_END
