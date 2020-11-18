#pragma once

#include "../thread/CommandEncoder.h"
#include "../gfx/GFXCommandBuffer.h"

namespace cc {
namespace gfx {

// 一个Context对应一个CPU Core
struct SubmitContext final
{
    std::unique_ptr<CommandEncoder>         mEncoder        { nullptr };
    std::unique_ptr<CommandBuffer>          mCommandBuffer  { nullptr };
};

class DeviceProxy;

class CC_DLL DeviceThread final
{
public:

    explicit                                DeviceThread(DeviceProxy *device) noexcept;
                                            ~DeviceThread();

    void                                    Run() noexcept;
    void                                    Terminate() noexcept;
    inline CommandEncoder*                  GetMainCommandEncoder() const noexcept { return mMainCommandEncoder.get(); }

    void                                    InitCommandBuffers(DeviceProxy *device) noexcept;
private:

    std::unique_ptr<CommandEncoder>         mMainCommandEncoder  {};
    std::vector<SubmitContext>              mSubmitContexts      {};
};

} // namespace gfx
} // namespace cc
