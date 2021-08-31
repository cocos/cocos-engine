/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "base/CoreStd.h"
#include "base/threading/MessageQueue.h"

#include "BufferAgent.h"
#include "CommandBufferAgent.h"
#include "DescriptorSetAgent.h"
#include "DescriptorSetLayoutAgent.h"
#include "DeviceAgent.h"
#include "FramebufferAgent.h"
#include "InputAssemblerAgent.h"
#include "PipelineLayoutAgent.h"
#include "PipelineStateAgent.h"
#include "QueueAgent.h"
#include "RenderPassAgent.h"
#include "ShaderAgent.h"
#include "SwapchainAgent.h"
#include "TextureAgent.h"
#include "base/threading/ThreadSafeLinearAllocator.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXSwapchain.h"

namespace cc {
namespace gfx {

DeviceAgent *DeviceAgent::instance = nullptr;

DeviceAgent *DeviceAgent::getInstance() {
    return DeviceAgent::instance;
}

DeviceAgent::DeviceAgent(Device *device) : Agent(device) {
    DeviceAgent::instance = this;
}

DeviceAgent::~DeviceAgent() {
    CC_SAFE_DELETE(_actor);
    DeviceAgent::instance = nullptr;
}

bool DeviceAgent::doInit(const DeviceInfo &info) {
    if (!_actor->initialize(info)) {
        return false;
    }

    _api        = _actor->getGfxAPI();
    _deviceName = _actor->getDeviceName();
    _queue      = CC_NEW(QueueAgent(_actor->getQueue()));
    _cmdBuff    = CC_NEW(CommandBufferAgent(_actor->getCommandBuffer()));
    _renderer   = _actor->getRenderer();
    _vendor     = _actor->getVendor();
    _caps       = _actor->_caps;
    memcpy(_features.data(), _actor->_features.data(), static_cast<uint>(Feature::COUNT) * sizeof(bool));

    _mainMessageQueue = CC_NEW(MessageQueue);

    static_cast<CommandBufferAgent *>(_cmdBuff)->_queue = _queue;
    static_cast<CommandBufferAgent *>(_cmdBuff)->initMessageQueue();

    setMultithreaded(true);

    return true;
}

void DeviceAgent::doDestroy() {
    ENQUEUE_MESSAGE_1(
        _mainMessageQueue, DeviceDestroy,
        actor, _actor,
        {
            actor->destroy();
        });

    if (_cmdBuff) {
        static_cast<CommandBufferAgent *>(_cmdBuff)->destroyMessageQueue();
        static_cast<CommandBufferAgent *>(_cmdBuff)->_actor = nullptr;
        CC_DELETE(_cmdBuff);
        _cmdBuff = nullptr;
    }
    if (_queue) {
        static_cast<QueueAgent *>(_queue)->_actor = nullptr;
        CC_DELETE(_queue);
        _queue = nullptr;
    }

    _mainMessageQueue->terminateConsumerThread();
    CC_SAFE_DELETE(_mainMessageQueue);
}

void DeviceAgent::acquire(Swapchain *const *swapchains, uint32_t count) {
    auto *actorSwapchains = _mainMessageQueue->allocate<Swapchain *>(count);
    for (uint32_t i = 0; i < count; ++i) {
        actorSwapchains[i] = static_cast<SwapchainAgent *>(swapchains[i])->getActor();
    }

    ENQUEUE_MESSAGE_3(
        _mainMessageQueue, DevicePresent,
        actor, _actor,
        swapchains, actorSwapchains,
        count, count,
        {
            actor->acquire(swapchains, count);
        });
}

void DeviceAgent::present() {
    ENQUEUE_MESSAGE_2(
        _mainMessageQueue, DevicePresent,
        actor, _actor,
        frameBoundarySemaphore, &_frameBoundarySemaphore,
        {
            actor->present();
            frameBoundarySemaphore->signal();
        });

    MessageQueue::freeChunksInFreeQueue(_mainMessageQueue);
    _mainMessageQueue->finishWriting();
    _currentIndex = (_currentIndex + 1) % MAX_FRAME_INDEX;
    _frameBoundarySemaphore.wait();
}

void DeviceAgent::setMultithreaded(bool multithreaded) {
    if (multithreaded == _multithreaded) return;
    _multithreaded = multithreaded;

    if (multithreaded) {
        _mainMessageQueue->setImmediateMode(false);
        _actor->bindContext(false);
        _mainMessageQueue->runConsumerThread();
        ENQUEUE_MESSAGE_1(
            _mainMessageQueue, DeviceMakeCurrentTrue,
            actor, _actor,
            {
                actor->bindContext(true);
                CC_LOG_INFO("Device thread detached.");
            });
        for (CommandBufferAgent *cmdBuff : _cmdBuffRefs) {
            cmdBuff->_messageQueue->setImmediateMode(false);
        }
    } else {
        ENQUEUE_MESSAGE_1(
            _mainMessageQueue, DeviceMakeCurrentFalse,
            actor, _actor,
            {
                actor->bindContext(false);
            });
        _mainMessageQueue->terminateConsumerThread();
        _mainMessageQueue->setImmediateMode(true);
        _actor->bindContext(true);
        for (CommandBufferAgent *cmdBuff : _cmdBuffRefs) {
            cmdBuff->_messageQueue->setImmediateMode(true);
        }
        CC_LOG_INFO("Device thread joined.");
    }
}

CommandBuffer *DeviceAgent::createCommandBuffer(const CommandBufferInfo &info, bool /*hasAgent*/) {
    CommandBuffer *actor = _actor->createCommandBuffer(info, true);
    return CC_NEW(CommandBufferAgent(actor));
}

Queue *DeviceAgent::createQueue() {
    Queue *actor = _actor->createQueue();
    return CC_NEW(QueueAgent(actor));
}

Swapchain *DeviceAgent::createSwapchain() {
    Swapchain *actor = _actor->createSwapchain();
    return CC_NEW(SwapchainAgent(actor));
}

Buffer *DeviceAgent::createBuffer() {
    Buffer *actor = _actor->createBuffer();
    return CC_NEW(BufferAgent(actor));
}

Texture *DeviceAgent::createTexture() {
    Texture *actor = _actor->createTexture();
    return CC_NEW(TextureAgent(actor));
}

Shader *DeviceAgent::createShader() {
    Shader *actor = _actor->createShader();
    return CC_NEW(ShaderAgent(actor));
}

InputAssembler *DeviceAgent::createInputAssembler() {
    InputAssembler *actor = _actor->createInputAssembler();
    return CC_NEW(InputAssemblerAgent(actor));
}

RenderPass *DeviceAgent::createRenderPass() {
    RenderPass *actor = _actor->createRenderPass();
    return CC_NEW(RenderPassAgent(actor));
}

Framebuffer *DeviceAgent::createFramebuffer() {
    Framebuffer *actor = _actor->createFramebuffer();
    return CC_NEW(FramebufferAgent(actor));
}

DescriptorSet *DeviceAgent::createDescriptorSet() {
    DescriptorSet *actor = _actor->createDescriptorSet();
    return CC_NEW(DescriptorSetAgent(actor));
}

DescriptorSetLayout *DeviceAgent::createDescriptorSetLayout() {
    DescriptorSetLayout *actor = _actor->createDescriptorSetLayout();
    return CC_NEW(DescriptorSetLayoutAgent(actor));
}

PipelineLayout *DeviceAgent::createPipelineLayout() {
    PipelineLayout *actor = _actor->createPipelineLayout();
    return CC_NEW(PipelineLayoutAgent(actor));
}

PipelineState *DeviceAgent::createPipelineState() {
    PipelineState *actor = _actor->createPipelineState();
    return CC_NEW(PipelineStateAgent(actor));
}

Sampler *DeviceAgent::createSampler(const SamplerInfo &info) {
    return _actor->createSampler(info);
}

GlobalBarrier *DeviceAgent::createGlobalBarrier(const GlobalBarrierInfo &info) {
    return _actor->createGlobalBarrier(info);
}

TextureBarrier *DeviceAgent::createTextureBarrier(const TextureBarrierInfo &info) {
    return _actor->createTextureBarrier(info);
}

void DeviceAgent::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    uint bufferCount = 0U;
    for (uint i = 0U; i < count; i++) {
        bufferCount += regions[i].texSubres.layerCount;
    }
    uint totalSize = sizeof(BufferTextureCopy) * count + sizeof(uint8_t *) * bufferCount;
    for (uint i = 0U; i < count; i++) {
        const BufferTextureCopy &region = regions[i];

        uint size = formatSize(dst->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        totalSize += size * region.texSubres.layerCount;
    }

    auto *allocator = CC_NEW(ThreadSafeLinearAllocator(totalSize));

    auto *actorRegions = allocator->allocate<BufferTextureCopy>(count);
    memcpy(actorRegions, regions, count * sizeof(BufferTextureCopy));

    const auto **actorBuffers = allocator->allocate<const uint8_t *>(bufferCount);
    for (uint i = 0U, n = 0U; i < count; i++) {
        const BufferTextureCopy &region = regions[i];

        uint size = formatSize(dst->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        for (uint l = 0; l < region.texSubres.layerCount; l++) {
            auto *buffer = allocator->allocate<uint8_t>(size);
            memcpy(buffer, buffers[n], size);
            actorBuffers[n++] = buffer;
        }
    }

    ENQUEUE_MESSAGE_6(
        _mainMessageQueue, DeviceCopyBuffersToTexture,
        actor, _actor,
        buffers, actorBuffers,
        dst, static_cast<TextureAgent *>(dst)->getActor(),
        regions, actorRegions,
        count, count,
        allocator, allocator,
        {
            actor->copyBuffersToTexture(buffers, dst, regions, count);
            CC_DELETE(allocator);
        });
}

void DeviceAgent::copyTextureToBuffers(Texture *srcTexture, uint8_t *const *buffers, const BufferTextureCopy *regions, uint count) {
    ENQUEUE_MESSAGE_5(
        _mainMessageQueue,
        DeviceCopyTextureToBuffers,
        actor, getActor(),
        src, static_cast<TextureAgent *>(srcTexture)->getActor(),
        buffers, buffers,
        regions, regions,
        count, count,
        {
            actor->copyTextureToBuffers(src, buffers, regions, count);
        });

    _mainMessageQueue->kickAndWait();
}

void DeviceAgent::flushCommands(CommandBuffer *const *cmdBuffs, uint count) {
    if (!_multithreaded) return; // all command buffers are immediately executed

    auto **agentCmdBuffs = _mainMessageQueue->allocate<CommandBufferAgent *>(count);

    for (uint i = 0; i < count; ++i) {
        agentCmdBuffs[i] = static_cast<CommandBufferAgent *const>(cmdBuffs[i]);
        MessageQueue::freeChunksInFreeQueue(agentCmdBuffs[i]->_messageQueue);
        agentCmdBuffs[i]->_messageQueue->finishWriting();
    }

    ENQUEUE_MESSAGE_3(
        _mainMessageQueue, DeviceFlushCommands,
        count, count,
        cmdBuffs, agentCmdBuffs,
        multiThreaded, _actor->_multithreadedSubmission,
        {
            CommandBufferAgent::flushCommands(count, cmdBuffs, multiThreaded);
        });
}

} // namespace gfx
} // namespace cc
