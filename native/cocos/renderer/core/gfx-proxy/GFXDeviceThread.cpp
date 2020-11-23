#include "CoreStd.h"
#include "GFXDeviceThread.h"
#include "gfx-proxy/GFXDeviceProxy.h"
#include "gfx-proxy/GFXCommandBufferProxy.h"

namespace cc {
namespace gfx {

DeviceThread::DeviceThread(DeviceProxy *device) noexcept
{
    mMainCommandEncoder = std::make_unique<CommandEncoder>();

    uint32_t const commandBufferCount = false ? std::thread::hardware_concurrency() : 1u;
    mSubmitContexts.resize(commandBufferCount);

    for (auto& context : mSubmitContexts)
    {
        context.mEncoder = std::make_unique<CommandEncoder>();
    }
}

DeviceThread::~DeviceThread()
{

}

void DeviceThread::Run() noexcept
{
    for (auto& context : mSubmitContexts)
    {
        context.mEncoder->RunConsumerThread();
    }
}

void DeviceThread::Terminate() noexcept
{
    for (auto& context : mSubmitContexts)
    {
        context.mEncoder->TerminateConsumerThread();
    }
}

void DeviceThread::InitCommandBuffers(DeviceProxy *device) noexcept {
    CommandBufferInfo info;
    info.type = CommandBufferType::PRIMARY;
    info.queue = device->getQueue();

    for (auto& context : mSubmitContexts)
    {
        context.mCommandBuffer.reset(device->createCommandBuffer(info));
    }
}

} // namespace gfx
} // namespace cc
