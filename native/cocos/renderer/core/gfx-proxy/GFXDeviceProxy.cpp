#include "CoreStd.h"
#include "GFXDeviceProxy.h"
#include "GFXCommandBufferProxy.h"
#include "GFXBufferProxy.h"
#include "GFXTextureProxy.h"
#include "GFXShaderProxy.h"
#include "GFXDescriptorSetProxy.h"
#include "GFXInputAssemblerProxy.h"
#include "GFXPipelineStateProxy.h"
#include "GFXFramebufferProxy.h"
#include "GFXQueueProxy.h"
#include "GFXDeviceThread.h"

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
    memcpy(_features, ((DeviceProxy*)GetRemote())->_features, (uint)Feature::COUNT * sizeof(bool));

    _thread = std::make_unique<DeviceThread>();
    _thread->InitSubmitContexts(this);
    _thread->Run();

    ENCODE_COMMAND_1(
            getDeviceThread()->GetMainCommandEncoder(),
            DeviceMakeCurrent,
            remote, GetRemote(),
            {
                remote->makeCurrent();
            });

    return true;
}

void DeviceProxy::destroy() {
    ENCODE_COMMAND_2(
        getDeviceThread()->GetMainCommandEncoder(),
        DeviceDestroy,
        remote, GetRemote(),
        device, this,
        {
            remote->destroy();
            CC_SAFE_DELETE(device->_queue);
            CC_SAFE_DELETE(device->_cmdBuff);
            device->_thread->Terminate();
            device->_thread.reset();
        });
}

void DeviceProxy::resize(uint width, uint height) {
    _width = _nativeWidth = width;
    _height = _nativeHeight = height;

    ENCODE_COMMAND_3(
        getDeviceThread()->GetMainCommandEncoder(),
        DeviceResize,
        remote, GetRemote(),
        width, width,
        height, height,
        {
            remote->resize(width, height);
        });
}

void DeviceProxy::acquire() {
    _frameBoundarySemaphore.Wait();
    CommandEncoder *encoder = getDeviceThread()->GetMainCommandEncoder();
    ENCODE_COMMAND_2(
        encoder,
        DeviceAcquire,
        remote, GetRemote(),
        encoder, encoder,
        {
            remote->acquire();
//            CommandEncoder::FreeChunksInFreeQueue(encoder);
        });
}

void DeviceProxy::present() {
    CommandEncoder *encoder = getDeviceThread()->GetMainCommandEncoder();
    ENCODE_COMMAND_2(
        encoder,
        DevicePresent,
        remote, GetRemote(),
        frameBoundarySemaphore, &_frameBoundarySemaphore,
        {
            remote->present();
            frameBoundarySemaphore->Signal();
        });

    encoder->FinishWriting();
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
    return _remote->createSampler();
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
    return _remote->createRenderPass();
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
    return _remote->createDescriptorSetLayout();
}

PipelineLayout *DeviceProxy::createPipelineLayout() {
    return _remote->createPipelineLayout();
}

PipelineState *DeviceProxy::createPipelineState() {
    PipelineState *remote = _remote->createPipelineState();
    PipelineStateProxy *proxy = CC_NEW(PipelineStateProxy(remote, this));
    return proxy;
}

void DeviceProxy::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    CommandEncoder *encoder = _thread->GetMainCommandEncoder();

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
        remote, GetRemote(),
        buffers, remoteBuffers,
        dst, ((TextureProxy*)dst)->GetRemote(),
        regions, regions,
        count, count,
        {
            remote->copyBuffersToTexture(buffers, dst, regions, count);
        });
}

} // namespace gfx
} // namespace cc
