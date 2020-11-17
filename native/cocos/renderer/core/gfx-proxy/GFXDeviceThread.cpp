#include "CoreStd.h"
#include "GFXDeviceThread.h"
#include "gfx-proxy/GFXDeviceProxy.h"
#include "gfx-proxy/GFXCommandBufferProxy.h"

namespace cc {
namespace gfx {

DeviceThread::DeviceThread(DeviceProxy *device) noexcept
{
    mMainCommandEncoder = std::make_unique<CommandEncoder>();

    uint8_t const commandBufferCount = false ? std::thread::hardware_concurrency() : 1;
    mSubmitContexts.resize(commandBufferCount);

    CommandBufferInfo info;
    info.type = CommandBufferType::PRIMARY;
    info.queue = device->getQueue();

    for (auto& context : mSubmitContexts)
    {
        context.mEncoder = std::make_unique<CommandEncoder>();
        context.mCommandBuffer.reset(device->createCommandBuffer(info));
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

} // namespace gfx
} // namespace cc
