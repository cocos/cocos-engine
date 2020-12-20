#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXBufferAgent.h"
#include "GFXCommandBufferAgent.h"
#include "GFXDescriptorSetLayoutAgent.h"
#include "GFXDescriptorSetAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXFramebufferAgent.h"
#include "GFXInputAssemblerAgent.h"
#include "GFXPipelineLayoutAgent.h"
#include "GFXPipelineStateAgent.h"
#include "GFXQueueAgent.h"
#include "GFXRenderPassAgent.h"
#include "GFXSamplerAgent.h"
#include "GFXShaderAgent.h"
#include "GFXTextureAgent.h"

namespace cc {
namespace gfx {

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
    _cmdBuff = CC_NEW(CommandBufferAgent(_actor->getCommandBuffer(), this));
    ((CommandBufferAgent *)_cmdBuff)->initEncoder();
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

    _mainEncoder = CC_NEW(CommandEncoder);
    _mainEncoder->RunConsumerThread();

    setMultithreaded(true);

    return true;
}

void DeviceAgent::destroy() {
    if (_actor) {
        ENCODE_COMMAND_1(
            getMainEncoder(),
            DeviceDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }

    ((CommandBufferAgent *)_cmdBuff)->destroyEncoder();
    CC_SAFE_DELETE(_cmdBuff);
    CC_SAFE_DELETE(_queue);

    _mainEncoder->TerminateConsumerThread();
    CC_SAFE_DELETE(_mainEncoder);
}

void DeviceAgent::resize(uint width, uint height) {
    _width = _nativeWidth = width;
    _height = _nativeHeight = height;

    ENCODE_COMMAND_3(
        getMainEncoder(),
        DeviceResize,
        actor, getActor(),
        width, width,
        height, height,
        {
            actor->resize(width, height);
        });
}

void DeviceAgent::acquire() {
    _frameBoundarySemaphore.Wait();
    CommandEncoder *encoder = getMainEncoder();
    ENCODE_COMMAND_1(
        encoder,
        DeviceAcquire,
        actor, getActor(),
        {
            actor->acquire();
        });
}

void DeviceAgent::present() {
    CommandEncoder *encoder = getMainEncoder();
    ENCODE_COMMAND_2(
        encoder,
        DevicePresent,
        actor, getActor(),
        frameBoundarySemaphore, &_frameBoundarySemaphore,
        {
            actor->present();
            frameBoundarySemaphore->Signal();
        });

    CommandEncoder::FreeChunksInFreeQueue(encoder);
    encoder->FinishWriting();
}

void DeviceAgent::setMultithreaded(bool multithreaded) {
    if (multithreaded == _multithreaded) return;
    _multithreaded = multithreaded;

    if (multithreaded) {
        _mainEncoder->SetImmediateMode(false);
        _actor->bindRenderContext(false);
        ENCODE_COMMAND_1(
            _mainEncoder, DeviceMakeCurrent,
            actor, _actor,
            {
                actor->bindDeviceContext(true);
            });
    } else {
        ENCODE_COMMAND_1(
            _mainEncoder, DeviceMakeCurrent,
            actor, _actor,
            {
                actor->bindDeviceContext(false);
            });
        _mainEncoder->FinishWriting(true); // wait till finished
        _mainEncoder->SetImmediateMode(true);
        _actor->bindRenderContext(true);
    }
}

CommandBuffer *DeviceAgent::createCommandBuffer() {
    CommandBuffer *actor = _actor->createCommandBuffer();
    CommandBufferAgent *agent = CC_NEW(CommandBufferAgent(actor, this));
    return agent;
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
    CommandEncoder *encoder = getMainEncoder();

    BufferTextureCopy *actorRegions = encoder->Allocate<BufferTextureCopy>(count);
    memcpy(actorRegions, regions, count * sizeof(BufferTextureCopy));

    uint bufferCount = 0u;
    for (uint i = 0u; i < count; i++) {
        bufferCount += regions[i].texSubres.layerCount;
    }
    const uint8_t **actorBuffers = encoder->Allocate<const uint8_t *>(bufferCount);
    for (uint i = 0u, n = 0u; i < count; i++) {
        const BufferTextureCopy &region = regions[i];
        uint size = FormatSize(dst->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        for (uint l = 0; l < region.texSubres.layerCount; l++) {
            uint8_t *buffer = encoder->Allocate<uint8_t>(size);
            memcpy(buffer, buffers[n], size);
            actorBuffers[n++] = buffer;
        }
    }

    ENCODE_COMMAND_5(
        encoder,
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
