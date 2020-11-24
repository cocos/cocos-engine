#include "CoreStd.h"
#include "GFXDeviceThread.h"
#include "gfx-proxy/GFXDeviceProxy.h"
#include "gfx-proxy/GFXCommandBufferProxy.h"

namespace cc {
namespace gfx {

DeviceThread::DeviceThread() noexcept
{
    mMainCommandEncoder = std::make_unique<CommandEncoder>();
}

void DeviceThread::InitSubmitContexts(DeviceProxy *device) {
    uint32_t const commandBufferCount = false ? std::thread::hardware_concurrency() : 1u;
    mSubmitContexts.resize(commandBufferCount);

    CommandBufferInfo info;
    info.type = CommandBufferType::PRIMARY;
    info.queue = device->getQueue();

    for (auto& context : mSubmitContexts)
    {
        context.mCommandBuffer.reset(device->createCommandBuffer(info));
        context.mEncoder = std::make_unique<CommandEncoder>();
    }
}

DeviceThread::~DeviceThread()
{
    for (auto& context : mSubmitContexts)
    {
        context.mCommandBuffer->destroy();
        context.mCommandBuffer.reset();
        context.mEncoder.reset();
    }
    mSubmitContexts.clear();

    mMainCommandEncoder.reset();
}

void DeviceThread::Run() noexcept
{
    mMainCommandEncoder->RunConsumerThread();

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

    mMainCommandEncoder->TerminateConsumerThread();
}

} // namespace gfx
} // namespace cc
