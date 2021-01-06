#include "CoreStd.h"

#include "GFXBufferAgent.h"
#include "GFXCommandBufferAgent.h"
#include "GFXDescriptorSetAgent.h"
#include "GFXDescriptorSetLayoutAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXFramebufferAgent.h"
#include "GFXInputAssemblerAgent.h"
#include "GFXLinearAllocatorPool.h"
#include "GFXPipelineLayoutAgent.h"
#include "GFXPipelineStateAgent.h"
#include "GFXPrimaryCommandBufferAgent.h"
#include "GFXQueueAgent.h"
#include "GFXRenderPassAgent.h"
#include "GFXSamplerAgent.h"
#include "GFXShaderAgent.h"
#include "GFXTextureAgent.h"
#include "base/threading/MessageQueue.h"

namespace cc {
namespace gfx {

DeviceAgent::~DeviceAgent() {
    CC_SAFE_DELETE(_actor);
}

bool DeviceAgent::initialize(const DeviceInfo &info) {
    _clipSpaceMinZ = _actor->getClipSpaceMinZ();
    _screenSpaceSignY = _actor->getScreenSpaceSignY();
    _UVSpaceSignY = _actor->getUVSpaceSignY();

    _width = info.width;
    _height = info.height;
    _nativeWidth = info.nativeWidth;
    _nativeHeight = info.nativeHeight;
    _windowHandle = info.windowHandle;

    _bindingMappingInfo = info.bindingMappingInfo;
    if (_bindingMappingInfo.bufferOffsets.empty()) {
        _bindingMappingInfo.bufferOffsets.push_back(0);
    }
    if (_bindingMappingInfo.samplerOffsets.empty()) {
        _bindingMappingInfo.samplerOffsets.push_back(0);
    }

    if (!_actor->initialize(info)) {
        return false;
    }

    _context = _actor->getContext();
    _API = _actor->getGfxAPI();
    _deviceName = _actor->getDeviceName();
    _queue = CC_NEW(QueueAgent(_actor->getQueue(), this));
    _cmdBuff = CC_NEW(PrimaryCommandBufferAgent(_actor->getCommandBuffer(), this));
    _renderer = _actor->getRenderer();
    _vendor = _actor->getVendor();
    _maxVertexAttributes = _actor->getMaxVertexAttributes();
    _maxVertexUniformVectors = _actor->getMaxVertexUniformVectors();
    _maxFragmentUniformVectors = _actor->getMaxFragmentUniformVectors();
    _maxTextureUnits = _actor->getMaxTextureUnits();
    _maxVertexTextureUnits = _actor->getMaxVertexTextureUnits();
    _maxUniformBufferBindings = _actor->getMaxUniformBufferBindings();
    _maxUniformBlockSize = _actor->getMaxUniformBlockSize();
    _maxTextureSize = _actor->getMaxTextureSize();
    _maxCubeMapTextureSize = _actor->getMaxCubeMapTextureSize();
    _uboOffsetAlignment = _actor->getUboOffsetAlignment();
    _depthBits = _actor->getDepthBits();
    _stencilBits = _actor->getStencilBits();
    memcpy(_features, _actor->_features, (uint)Feature::COUNT * sizeof(bool));

    _mainEncoder = CC_NEW(MessageQueue);
    _mainEncoder->runConsumerThread();

    _allocatorPools.resize(MAX_CPU_FRAME_AHEAD + 1);
    for (uint i = 0u; i < MAX_CPU_FRAME_AHEAD + 1; ++i) {
        _allocatorPools[i] = CC_NEW(LinearAllocatorPool);
    }

    setMultithreaded(true);

    return true;
}

void DeviceAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        getMessageQueue(),
        DeviceDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });

    if (_cmdBuff) {
        ((CommandBufferAgent *)_cmdBuff)->_actor = nullptr;
        CC_DELETE(_cmdBuff);
        _cmdBuff = nullptr;
    }
    if (_queue) {
        ((QueueAgent *)_queue)->_actor = nullptr;
        CC_DELETE(_queue);
        _queue = nullptr;
    }

    _mainEncoder->terminateConsumerThread();
    CC_SAFE_DELETE(_mainEncoder);

    for (LinearAllocatorPool *pool : _allocatorPools) {
        CC_SAFE_DELETE(pool);
    }
    _allocatorPools.clear();
}

void DeviceAgent::resize(uint width, uint height) {
    _width = _nativeWidth = width;
    _height = _nativeHeight = height;

    ENQUEUE_MESSAGE_3(
        getMessageQueue(),
        DeviceResize,
        actor, getActor(),
        width, width,
        height, height,
        {
            actor->resize(width, height);
        });
}

void DeviceAgent::acquire() {
    ENQUEUE_MESSAGE_1(
        _mainEncoder,
        DeviceAcquire,
        actor, getActor(),
        {
            actor->acquire();
        });
}

void DeviceAgent::present() {
    ENQUEUE_MESSAGE_2(
        _mainEncoder,
        DevicePresent,
        actor, getActor(),
        frameBoundarySemaphore, &_frameBoundarySemaphore,
        {
            actor->present();
            frameBoundarySemaphore->Signal();
        });

    MessageQueue::freeChunksInFreeQueue(_mainEncoder);
    _mainEncoder->finishWriting();
    _currentIndex = (_currentIndex + 1) % (MAX_CPU_FRAME_AHEAD + 1);
    _frameBoundarySemaphore.Wait();

    getMainAllocator()->reset();
    for (LinearAllocatorPool **allocatorPools : _allocatorPoolRefs) {
        allocatorPools[_currentIndex]->reset();
    }
}

void DeviceAgent::setMultithreaded(bool multithreaded) {
    if (multithreaded == _multithreaded) return;
    _multithreaded = multithreaded;

    if (multithreaded) {
        _mainEncoder->setImmediateMode(false);
        _actor->bindRenderContext(false);
        ENQUEUE_MESSAGE_1(
            _mainEncoder, DeviceMakeCurrent,
            actor, _actor,
            {
                actor->bindDeviceContext(true);
                CC_LOG_INFO("Device thread detached.");
            });
    } else {
        ENQUEUE_MESSAGE_1(
            _mainEncoder, DeviceMakeCurrent,
            actor, _actor,
            {
                actor->bindDeviceContext(false);
            });
        _mainEncoder->finishWriting(true); // wait till finished
        _mainEncoder->setImmediateMode(true);
        _actor->bindRenderContext(true);
        CC_LOG_INFO("Device thread joined.");
    }
}

CommandBuffer *DeviceAgent::doCreateCommandBuffer(const CommandBufferInfo &info) {
    CommandBuffer *actor = _actor->doCreateCommandBuffer(info);
    if (info.type == CommandBufferType::PRIMARY) return CC_NEW(PrimaryCommandBufferAgent(actor, this));
    return CC_NEW(CommandBufferAgent(actor, this));
}

Fence *DeviceAgent::createFence() {
    return _actor->createFence();
}

Queue *DeviceAgent::createQueue() {
    Queue *actor = _actor->createQueue();
    QueueAgent *agent = CC_NEW(QueueAgent(actor, this));
    return agent;
}

Buffer *DeviceAgent::createBuffer() {
    Buffer *actor = _actor->createBuffer();
    BufferAgent *agent = CC_NEW(BufferAgent(actor, this));
    return agent;
}

Texture *DeviceAgent::createTexture() {
    Texture *actor = _actor->createTexture();
    TextureAgent *agent = CC_NEW(TextureAgent(actor, this));
    return agent;
}

Sampler *DeviceAgent::createSampler() {
    Sampler *actor = _actor->createSampler();
    SamplerAgent *agent = CC_NEW(SamplerAgent(actor, this));
    return agent;
}

Shader *DeviceAgent::createShader() {
    Shader *actor = _actor->createShader();
    ShaderAgent *agent = CC_NEW(ShaderAgent(actor, this));
    return agent;
}

InputAssembler *DeviceAgent::createInputAssembler() {
    InputAssembler *actor = _actor->createInputAssembler();
    InputAssemblerAgent *agent = CC_NEW(InputAssemblerAgent(actor, this));
    return agent;
}

RenderPass *DeviceAgent::createRenderPass() {
    RenderPass *actor = _actor->createRenderPass();
    RenderPassAgent *agent = CC_NEW(RenderPassAgent(actor, this));
    return agent;
}

Framebuffer *DeviceAgent::createFramebuffer() {
    Framebuffer *actor = _actor->createFramebuffer();
    FramebufferAgent *agent = CC_NEW(FramebufferAgent(actor, this));
    return agent;
}

DescriptorSet *DeviceAgent::createDescriptorSet() {
    DescriptorSet *actor = _actor->createDescriptorSet();
    DescriptorSetAgent *agent = CC_NEW(DescriptorSetAgent(actor, this));
    return agent;
}

DescriptorSetLayout *DeviceAgent::createDescriptorSetLayout() {
    DescriptorSetLayout *actor = _actor->createDescriptorSetLayout();
    DescriptorSetLayoutAgent *agent = CC_NEW(DescriptorSetLayoutAgent(actor, this));
    return agent;
}

PipelineLayout *DeviceAgent::createPipelineLayout() {
    PipelineLayout *actor = _actor->createPipelineLayout();
    PipelineLayoutAgent *agent = CC_NEW(PipelineLayoutAgent(actor, this));
    return agent;
}

PipelineState *DeviceAgent::createPipelineState() {
    PipelineState *actor = _actor->createPipelineState();
    PipelineStateAgent *agent = CC_NEW(PipelineStateAgent(actor, this));
    return agent;
}

void DeviceAgent::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    LinearAllocatorPool *allocator = getMainAllocator();

    BufferTextureCopy *actorRegions = allocator->allocate<BufferTextureCopy>(count);
    memcpy(actorRegions, regions, count * sizeof(BufferTextureCopy));

    uint bufferCount = 0u;
    for (uint i = 0u; i < count; i++) {
        bufferCount += regions[i].texSubres.layerCount;
    }
    const uint8_t **actorBuffers = allocator->allocate<const uint8_t *>(bufferCount);
    for (uint i = 0u, n = 0u; i < count; i++) {
        const BufferTextureCopy &region = regions[i];
        uint size = FormatSize(dst->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        for (uint l = 0; l < region.texSubres.layerCount; l++) {
            uint8_t *buffer = allocator->allocate<uint8_t>(size);
            memcpy(buffer, buffers[n], size);
            actorBuffers[n++] = buffer;
        }
    }

    ENQUEUE_MESSAGE_5(
        _mainEncoder,
        DeviceCopyBuffersToTexture,
        actor, getActor(),
        buffers, actorBuffers,
        dst, ((TextureAgent *)dst)->getActor(),
        regions, actorRegions,
        count, count,
        {
            actor->copyBuffersToTexture(buffers, dst, regions, count);
        });
}

} // namespace gfx
} // namespace cc
