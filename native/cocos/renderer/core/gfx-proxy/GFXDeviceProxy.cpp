#include "CoreStd.h"

#include "../thread/CommandEncoder.h"
#include "GFXBufferProxy.h"
#include "GFXCommandBufferProxy.h"
#include "GFXDescriptorSetLayoutProxy.h"
#include "GFXDescriptorSetProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXFramebufferProxy.h"
#include "GFXInputAssemblerProxy.h"
#include "GFXPipelineLayoutProxy.h"
#include "GFXPipelineStateProxy.h"
#include "GFXQueueProxy.h"
#include "GFXRenderPassProxy.h"
#include "GFXSamplerProxy.h"
#include "GFXShaderProxy.h"
#include "GFXTextureProxy.h"

namespace cc {
namespace gfx {

bool DeviceProxy::initialize(const DeviceInfo &info) {
    _clipSpaceMinZ = _remote->getClipSpaceMinZ();
    _screenSpaceSignY = _remote->getScreenSpaceSignY();
    _UVSpaceSignY = _remote->getUVSpaceSignY();

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

    _remote->initialize(info);

    _context = _remote->getContext();
    _API = _remote->getGfxAPI();
    _deviceName = _remote->getDeviceName();
    _queue = CC_NEW(QueueProxy(_remote->getQueue(), this));
    _cmdBuff = CC_NEW(CommandBufferProxy(_remote->getCommandBuffer(), this));
    _renderer = _remote->getRenderer();
    _vendor = _remote->getVendor();
    _maxVertexAttributes = _remote->getMaxVertexAttributes();
    _maxVertexUniformVectors = _remote->getMaxVertexUniformVectors();
    _maxFragmentUniformVectors = _remote->getMaxFragmentUniformVectors();
    _maxTextureUnits = _remote->getMaxTextureUnits();
    _maxVertexTextureUnits = _remote->getMaxVertexTextureUnits();
    _maxUniformBufferBindings = _remote->getMaxUniformBufferBindings();
    _maxUniformBlockSize = _remote->getMaxUniformBlockSize();
    _maxTextureSize = _remote->getMaxTextureSize();
    _maxCubeMapTextureSize = _remote->getMaxCubeMapTextureSize();
    _uboOffsetAlignment = _remote->getUboOffsetAlignment();
    _depthBits = _remote->getDepthBits();
    _stencilBits = _remote->getStencilBits();
    memcpy(_features, ((DeviceProxy *)getRemote())->_features, (uint)Feature::COUNT * sizeof(bool));

    _mainEncoder = CC_NEW(CommandEncoder);
    _mainEncoder->RunConsumerThread();

    _contexts.resize(std::thread::hardware_concurrency() - 1);

    CommandBufferInfo cbInfo;
    cbInfo.type = CommandBufferType::PRIMARY;
    cbInfo.queue = _queue;

    for (auto &context : _contexts) {
        context.encoder = CC_NEW(CommandEncoder);
        context.encoder->RunConsumerThread();
        context.commandBuffer = createCommandBuffer();
        context.commandBuffer->initialize(cbInfo);
        ((CommandBufferProxy *)context.commandBuffer)->setEncoder(context.encoder);
    }

    setMultithreaded(true);

    return true;
}

void DeviceProxy::destroy() {
    for (auto &context : _contexts) {
        context.encoder->TerminateConsumerThread();
        CC_SAFE_DELETE(context.encoder);
        CC_SAFE_DESTROY(context.commandBuffer);
    }
    _contexts.clear();

    if (_remote) {
        ENCODE_COMMAND_2(
            getMainEncoder(),
            DeviceDestroy,
            device, this,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
                CC_SAFE_DELETE(device->_queue);
                CC_SAFE_DELETE(device->_cmdBuff);
            });

        _remote = nullptr;
    }

    _mainEncoder->TerminateConsumerThread();
    CC_SAFE_DELETE(_mainEncoder);
}

void DeviceProxy::resize(uint width, uint height) {
    _width = _nativeWidth = width;
    _height = _nativeHeight = height;

    ENCODE_COMMAND_3(
        getMainEncoder(),
        DeviceResize,
        remote, getRemote(),
        width, width,
        height, height,
        {
            remote->resize(width, height);
        });
}

void DeviceProxy::acquire() {
    _frameBoundarySemaphore.Wait();
    CommandEncoder *encoder = getMainEncoder();
    ENCODE_COMMAND_1(
        encoder,
        DeviceAcquire,
        remote, getRemote(),
        {
            remote->acquire();
        });
}

void DeviceProxy::present() {
    CommandEncoder *encoder = getMainEncoder();
    ENCODE_COMMAND_2(
        encoder,
        DevicePresent,
        remote, getRemote(),
        frameBoundarySemaphore, &_frameBoundarySemaphore,
        {
            remote->present();
            frameBoundarySemaphore->Signal();
        });

    CommandEncoder::FreeChunksInFreeQueue(encoder);
    encoder->FinishWriting();
}

void DeviceProxy::setMultithreaded(bool multithreaded) {
    if (multithreaded == _multithreaded) return;
    _multithreaded = multithreaded;

    if (multithreaded) {
        _mainEncoder->SetImmediateMode(false);
        ((DeviceProxy *) _remote)->bindRenderContext(false);
        ENCODE_COMMAND_1(
                _mainEncoder, DeviceMakeCurrent,
                remote, (DeviceProxy*)_remote,
                {
                    remote->bindDeviceContext(true);
                });
    } else {
        ENCODE_COMMAND_1(
                _mainEncoder, DeviceMakeCurrent,
                remote, (DeviceProxy*)_remote,
                {
                    remote->bindDeviceContext(false);
                });
        _mainEncoder->FinishWriting(true); // wait till finished
        _mainEncoder->SetImmediateMode(true);
        ((DeviceProxy *) _remote)->bindRenderContext(true);
    }
}

CommandBuffer *DeviceProxy::createCommandBuffer() {
    CommandBuffer *remote = _remote->createCommandBuffer();
    CommandBufferProxy *proxy = CC_NEW(CommandBufferProxy(remote, this));
    return proxy;
}

Fence *DeviceProxy::createFence() {
    return _remote->createFence();
}

Queue *DeviceProxy::createQueue() {
    Queue *remote = _remote->createQueue();
    QueueProxy *proxy = CC_NEW(QueueProxy(remote, this));
    return proxy;
}

Buffer *DeviceProxy::createBuffer() {
    Buffer *remote = _remote->createBuffer();
    BufferProxy *proxy = CC_NEW(BufferProxy(remote, this));
    return proxy;
}

Texture *DeviceProxy::createTexture() {
    Texture *remote = _remote->createTexture();
    TextureProxy *proxy = CC_NEW(TextureProxy(remote, this));
    return proxy;
}

Sampler *DeviceProxy::createSampler() {
    Sampler *remote = _remote->createSampler();
    SamplerProxy *proxy = CC_NEW(SamplerProxy(remote, this));
    return proxy;
}

Shader *DeviceProxy::createShader() {
    Shader *remote = _remote->createShader();
    ShaderProxy *proxy = CC_NEW(ShaderProxy(remote, this));
    return proxy;
}

InputAssembler *DeviceProxy::createInputAssembler() {
    InputAssembler *remote = _remote->createInputAssembler();
    InputAssemblerProxy *proxy = CC_NEW(InputAssemblerProxy(remote, this));
    return proxy;
}

RenderPass *DeviceProxy::createRenderPass() {
    RenderPass *remote = _remote->createRenderPass();
    RenderPassProxy *proxy = CC_NEW(RenderPassProxy(remote, this));
    return proxy;
}

Framebuffer *DeviceProxy::createFramebuffer() {
    Framebuffer *remote = _remote->createFramebuffer();
    FramebufferProxy *proxy = CC_NEW(FramebufferProxy(remote, this));
    return proxy;
}

DescriptorSet *DeviceProxy::createDescriptorSet() {
    DescriptorSet *remote = _remote->createDescriptorSet();
    DescriptorSetProxy *proxy = CC_NEW(DescriptorSetProxy(remote, this));
    return proxy;
}

DescriptorSetLayout *DeviceProxy::createDescriptorSetLayout() {
    DescriptorSetLayout *remote = _remote->createDescriptorSetLayout();
    DescriptorSetLayoutProxy *proxy = CC_NEW(DescriptorSetLayoutProxy(remote, this));
    return proxy;
}

PipelineLayout *DeviceProxy::createPipelineLayout() {
    PipelineLayout *remote = _remote->createPipelineLayout();
    PipelineLayoutProxy *proxy = CC_NEW(PipelineLayoutProxy(remote, this));
    return proxy;
}

PipelineState *DeviceProxy::createPipelineState() {
    PipelineState *remote = _remote->createPipelineState();
    PipelineStateProxy *proxy = CC_NEW(PipelineStateProxy(remote, this));
    return proxy;
}

void DeviceProxy::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    CommandEncoder *encoder = getMainEncoder();

    BufferTextureCopy *remoteRegions = encoder->Allocate<BufferTextureCopy>(count);
    memcpy(remoteRegions, regions, count * sizeof(BufferTextureCopy));

    uint bufferCount = 0u;
    for (uint i = 0u; i < count; i++) {
        bufferCount += regions[i].texSubres.layerCount;
    }
    const uint8_t **remoteBuffers = encoder->Allocate<const uint8_t *>(bufferCount);
    for (uint i = 0u, n = 0u; i < count; i++) {
        const BufferTextureCopy &region = regions[i];
        uint size = FormatSize(dst->getFormat(), region.texExtent.width, region.texExtent.height, 1);
        for (uint l = 0; l < region.texSubres.layerCount; l++) {
            uint8_t *buffer = encoder->Allocate<uint8_t>(size);
            memcpy(buffer, buffers[n], size);
            remoteBuffers[n++] = buffer;
        }
    }

    ENCODE_COMMAND_5(
        encoder,
        DeviceCopyBuffersToTexture,
        remote, getRemote(),
        buffers, remoteBuffers,
        dst, ((TextureProxy *)dst)->getRemote(),
        regions, remoteRegions,
        count, count,
        {
            remote->copyBuffersToTexture(buffers, dst, regions, count);
        });
}

} // namespace gfx
} // namespace cc
