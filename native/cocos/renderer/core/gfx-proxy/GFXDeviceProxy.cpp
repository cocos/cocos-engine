#include "CoreStd.h"
#include "GFXDeviceProxy.h"
#include "GFXCommandBufferProxy.h"
#include "GFXBufferProxy.h"
#include "GFXTextureProxy.h"
#include "GFXShaderProxy.h"
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

    bool res = _remote->initialize(info);

    _context = _remote->getContext();
    _API = _remote->getGfxAPI();
    _deviceName = _remote->getDeviceName();
    _queue = _remote->getQueue();
    _cmdBuff = _remote->getCommandBuffer();
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
    memcpy(_features, ((DeviceProxy*)_remote.get())->_features, (size_t)Feature::COUNT);

    _thread = std::make_unique<DeviceThread>(this);
    _thread->Run();

    return res;
}

void DeviceProxy::destroy() {
    _thread->Terminate();
    _thread.reset();

    _remote->destroy();
}

void DeviceProxy::resize(uint width, uint height) {
    _width = _nativeWidth = width;
    _height = _nativeHeight = height;
    _remote->resize(width, height);
}

void DeviceProxy::acquire() {
    _remote->acquire();
}

void DeviceProxy::present() {
    _remote->present();
}

CommandBuffer *DeviceProxy::createCommandBuffer(const CommandBufferInfo &info) {
    CommandBuffer *remote = _remote->createCommandBuffer(info);
    CommandBufferProxy *proxy = CC_NEW(CommandBufferProxy(remote));
    return proxy;
}

Buffer *DeviceProxy::createBuffer(const BufferInfo &info) {
    Buffer *remote = _remote->createBuffer(info);
    BufferProxy *proxy = CC_NEW(BufferProxy(remote));
    return proxy;
}

Buffer *DeviceProxy::createBuffer(const BufferViewInfo &info) {
    Buffer *remote = _remote->createBuffer(info);
    BufferProxy *proxy = CC_NEW(BufferProxy(remote));
    return proxy;
}

Texture *DeviceProxy::createTexture(const TextureInfo &info) {
    Texture *remote = _remote->createTexture(info);
    TextureProxy *proxy = CC_NEW(TextureProxy(remote));
    return proxy;
}

Texture *DeviceProxy::createTexture(const TextureViewInfo &info) {
    Texture *remote = _remote->createTexture(info);
    TextureProxy *proxy = CC_NEW(TextureProxy(remote));
    return proxy;
}

Shader *DeviceProxy::createShader(const ShaderInfo &info) {
    Shader *remote = _remote->createShader(info);
    ShaderProxy *proxy = CC_NEW(ShaderProxy(remote));
    return proxy;
}

Fence *DeviceProxy::createFence(const FenceInfo &info) {
    return _remote->createFence(info);
}

Queue *DeviceProxy::createQueue(const QueueInfo &info) {
    return _remote->createQueue(info);
}

Sampler *DeviceProxy::createSampler(const SamplerInfo &info) {
    return _remote->createSampler(info);
}

InputAssembler *DeviceProxy::createInputAssembler(const InputAssemblerInfo &info) {
    return _remote->createInputAssembler(info);
}

RenderPass *DeviceProxy::createRenderPass(const RenderPassInfo &info) {
    return _remote->createRenderPass(info);
}

Framebuffer *DeviceProxy::createFramebuffer(const FramebufferInfo &info) {
    return _remote->createFramebuffer(info);
}

DescriptorSet *DeviceProxy::createDescriptorSet(const DescriptorSetInfo &info) {
    return _remote->createDescriptorSet(info);
}

DescriptorSetLayout *DeviceProxy::createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) {
    return _remote->createDescriptorSetLayout(info);
}

PipelineLayout *DeviceProxy::createPipelineLayout(const PipelineLayoutInfo &info) {
    return _remote->createPipelineLayout(info);
}

PipelineState *DeviceProxy::createPipelineState(const PipelineStateInfo &info) {
    return _remote->createPipelineState(info);
}

void DeviceProxy::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    _remote->copyBuffersToTexture(buffers, dst, regions, count);
}

} // namespace gfx
} // namespace cc
