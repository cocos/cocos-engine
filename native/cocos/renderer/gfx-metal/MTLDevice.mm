#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLContext.h"
#include "MTLDescriptorSet.h"
#include "MTLDescriptorSetLayout.h"
#include "MTLDevice.h"
#include "MTLFence.h"
#include "MTLFramebuffer.h"
#include "MTLInputAssembler.h"
#include "MTLPipelineLayout.h"
#include "MTLPipelineState.h"
#include "MTLQueue.h"
#include "MTLRenderPass.h"
#include "MTLSampler.h"
#include "MTLShader.h"
#include "MTLStateCache.h"
#include "MTLTexture.h"
#include "MTLUtils.h"
#include "TargetConditionals.h"

#import <MetalKit/MTKView.h>

namespace cc {
namespace gfx {

CCMTLDevice::CCMTLDevice() {
    _clipSpaceMinZ = 0.0f;
    _screenSpaceSignY = 1.0f;
    _UVSpaceSignY = 1.0f;
}

CCMTLDevice::~CCMTLDevice() {}

bool CCMTLDevice::initialize(const DeviceInfo &info) {
    _API = API::METAL;
    _deviceName = "Metal";
    _width = info.width;
    _height = info.height;
    _nativeWidth = info.nativeWidth;
    _nativeHeight = info.nativeHeight;
    _windowHandle = info.windowHandle;

    _bindingMappingInfo = info.bindingMappingInfo;
    if (!_bindingMappingInfo.bufferOffsets.size()) {
        _bindingMappingInfo.bufferOffsets.push_back(0);
    }
    if (!_bindingMappingInfo.samplerOffsets.size()) {
        _bindingMappingInfo.samplerOffsets.push_back(0);
    }

    _stateCache = CC_NEW(CCMTLStateCache);

    _mtkView = (MTKView *)_windowHandle;
    id<MTLDevice> mtlDevice = ((MTKView *)_mtkView).device;
    _mtlDevice = mtlDevice;
    _mtlCommandQueue = [mtlDevice newCommandQueue];

    _mtlFeatureSet = mu::highestSupportedFeatureSet(mtlDevice);
    const auto gpuFamily = mu::getGPUFamily(MTLFeatureSet(_mtlFeatureSet));
    _indirectDrawSupported = mu::isIndirectDrawSupported(gpuFamily);
    _maxVertexAttributes = mu::getMaxVertexAttributes(gpuFamily);
    _maxTextureUnits = mu::getMaxEntriesInTextureArgumentTable(gpuFamily);
    _maxSamplerUnits = mu::getMaxEntriesInSamplerStateArgumentTable(gpuFamily);
    _maxTextureSize = mu::getMaxTexture2DWidthHeight(gpuFamily);
    _maxCubeMapTextureSize = mu::getMaxCubeMapTextureWidthHeight(gpuFamily);
    _maxColorRenderTargets = mu::getMaxColorRenderTarget(gpuFamily);
    _maxBufferBindingIndex = mu::getMaxEntriesInBufferArgumentTable(gpuFamily);
    _uboOffsetAlignment = mu::getMinBufferOffsetAlignment(gpuFamily);
    _icbSuppored = mu::isIndirectCommandBufferSupported(MTLFeatureSet(_mtlFeatureSet));
    static_cast<MTKView *>(_mtkView).depthStencilPixelFormat = mu::getSupportedDepthStencilFormat(mtlDevice, gpuFamily, _depthBits);
    _stencilBits = 8;

    ContextInfo contextCreateInfo;
    contextCreateInfo.windowHandle = _windowHandle;
    contextCreateInfo.sharedCtx = info.sharedCtx;
    _context = CC_NEW(CCMTLContext(this));
    if (!_context->initialize(contextCreateInfo)) {
        destroy();
        return false;
    }

    QueueInfo queue_info;
    queue_info.type = QueueType::GRAPHICS;
    _queue = createQueue(queue_info);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff = createCommandBuffer(cmdBuffInfo);

    _gpuStagingBufferPool = CC_NEW(CCMTLGPUStagingBufferPool(mtlDevice));

    _features[static_cast<int>(Feature::COLOR_FLOAT)] = mu::isColorBufferFloatSupported(gpuFamily);
    _features[static_cast<int>(Feature::COLOR_HALF_FLOAT)] = mu::isColorBufferHalfFloatSupported(gpuFamily);
    _features[static_cast<int>(Feature::TEXTURE_FLOAT_LINEAR)] = mu::isLinearTextureSupported(gpuFamily);
    _features[static_cast<int>(Feature::TEXTURE_HALF_FLOAT_LINEAR)] = mu::isLinearTextureSupported(gpuFamily);

    String compressedFormats;
    if (mu::isPVRTCSuppported(gpuFamily)) {
        _features[static_cast<int>(Feature::FORMAT_PVRTC)] = true;
        compressedFormats += "pvrtc ";
    }
    if (mu::isEAC_ETCCSuppported(gpuFamily)) {
        _features[static_cast<int>(Feature::FORMAT_ETC2)] = true;
        compressedFormats += "etc2 ";
    }
    if (mu::isASTCSuppported(gpuFamily)) {
        _features[static_cast<int>(Feature::FORMAT_ASTC)] = true;
        compressedFormats += "astc ";
    }
    if (mu::isBCSupported(gpuFamily)) {
        _features[static_cast<int>(Feature::FORMAT_ASTC)] = true;
        compressedFormats += "dxt ";
    }

    _features[(int)Feature::TEXTURE_FLOAT] = true;
    _features[(int)Feature::TEXTURE_HALF_FLOAT] = true;
    _features[(int)Feature::FORMAT_R11G11B10F] = true;
    _features[(int)Feature::MSAA] = true;
    _features[(int)Feature::INSTANCED_ARRAYS] = true;
    _features[(int)Feature::MULTIPLE_RENDER_TARGETS] = true;
    _features[(uint)Feature::BLEND_MINMAX] = true;
    _features[static_cast<uint>(Feature::DEPTH_BOUNDS)] = false;
    _features[static_cast<uint>(Feature::LINE_WIDTH)] = false;
    _features[static_cast<uint>(Feature::STENCIL_COMPARE_MASK)] = false;
    _features[static_cast<uint>(Feature::STENCIL_WRITE_MASK)] = false;
    _features[static_cast<uint>(Feature::FORMAT_RGB8)] = false;
    _features[static_cast<uint>(Feature::FORMAT_D16)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D16, gpuFamily);
    _features[static_cast<uint>(Feature::FORMAT_D16S8)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D16S8, gpuFamily);
    _features[static_cast<uint>(Feature::FORMAT_D24S8)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D24S8, gpuFamily);
    _features[static_cast<uint>(Feature::FORMAT_D32F)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D32F, gpuFamily);
    _features[static_cast<uint>(Feature::FORMAT_D32FS8)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D32F_S8, gpuFamily);

    CC_LOG_INFO("Metal Feature Set: %s", mu::featureSetToString(MTLFeatureSet(_mtlFeatureSet)).c_str());

    return true;
}

void CCMTLDevice::destroy() {
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_cmdBuff);
    CC_SAFE_DESTROY(_context);
    CC_SAFE_DELETE(_stateCache);
    CC_SAFE_DELETE(_gpuStagingBufferPool);
}

void CCMTLDevice::resize(uint width, uint height) {}

void CCMTLDevice::acquire() {
    CCMTLQueue *queue = (CCMTLQueue *)_queue;

    // Clear queue stats
    queue->_numDrawCalls = 0;
    queue->_numInstances = 0;
    queue->_numTriangles = 0;
}

void CCMTLDevice::present() {
    CCMTLQueue *queue = (CCMTLQueue *)_queue;
    _numDrawCalls = queue->_numDrawCalls;
    _numInstances = queue->_numInstances;
    _numTriangles = queue->_numTriangles;
    _gpuStagingBufferPool->reset();
}

Fence *CCMTLDevice::createFence(const FenceInfo &info) {
    auto fence = CC_NEW(CCMTLFence(this));
    if (fence && fence->initialize(info))
        return fence;

    CC_SAFE_DESTROY(fence);
    return nullptr;
}

Queue *CCMTLDevice::createQueue(const QueueInfo &info) {
    auto queue = CC_NEW(CCMTLQueue(this));
    if (queue && queue->initialize(info))
        return queue;

    CC_SAFE_DESTROY(queue);
    return nullptr;
}

CommandBuffer *CCMTLDevice::createCommandBuffer(const CommandBufferInfo &info) {
    auto commandBuffer = CC_NEW(CCMTLCommandBuffer(this));
    if (commandBuffer && commandBuffer->initialize(info))
        return commandBuffer;

    CC_SAFE_DESTROY(commandBuffer);
    return nullptr;
}

Buffer *CCMTLDevice::createBuffer(const BufferInfo &info) {
    auto buffer = CC_NEW(CCMTLBuffer(this));
    if (buffer && buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

Buffer *CCMTLDevice::createBuffer(const BufferViewInfo &info) {
    auto buffer = CC_NEW(CCMTLBuffer(this));
    if (buffer && buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

Texture *CCMTLDevice::createTexture(const TextureInfo &info) {
    auto texture = CC_NEW(CCMTLTexture(this));
    if (texture && texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

Texture *CCMTLDevice::createTexture(const TextureViewInfo &info) {
    auto texture = CC_NEW(CCMTLTexture(this));
    if (texture && texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

Sampler *CCMTLDevice::createSampler(const SamplerInfo &info) {
    auto sampler = CC_NEW(CCMTLSampler(this));
    if (sampler && sampler->initialize(info))
        return sampler;

    CC_SAFE_DESTROY(sampler);
    return sampler;
}

Shader *CCMTLDevice::createShader(const ShaderInfo &info) {
    auto shader = CC_NEW(CCMTLShader(this));
    if (shader && shader->initialize(info))
        return shader;

    CC_SAFE_DESTROY(shader);
    return shader;
}

InputAssembler *CCMTLDevice::createInputAssembler(const InputAssemblerInfo &info) {
    auto ia = CC_NEW(CCMTLInputAssembler(this));
    if (ia && ia->initialize(info))
        return ia;

    CC_SAFE_DESTROY(ia);
    return nullptr;
}

RenderPass *CCMTLDevice::createRenderPass(const RenderPassInfo &info) {
    auto renderPass = CC_NEW(CCMTLRenderPass(this));
    if (renderPass && renderPass->initialize(info))
        return renderPass;

    CC_SAFE_DESTROY(renderPass);
    return nullptr;
}

Framebuffer *CCMTLDevice::createFramebuffer(const FramebufferInfo &info) {
    auto frameBuffer = CC_NEW(CCMTLFramebuffer(this));
    if (frameBuffer && frameBuffer->initialize(info))
        return frameBuffer;

    CC_SAFE_DESTROY(frameBuffer);
    return nullptr;
}

DescriptorSet *CCMTLDevice::createDescriptorSet(const DescriptorSetInfo &info) {
    auto descriptorSet = CC_NEW(CCMTLDescriptorSet(this));
    if (descriptorSet && descriptorSet->initialize(info))
        return descriptorSet;

    CC_SAFE_DESTROY(descriptorSet);
    return nullptr;
}

DescriptorSetLayout *CCMTLDevice::createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) {
    auto descriptorSetLayout = CC_NEW(CCMTLDescriptorSetLayout(this));
    if (descriptorSetLayout && descriptorSetLayout->initialize(info))
        return descriptorSetLayout;

    CC_SAFE_DESTROY(descriptorSetLayout);
    return nullptr;
}

PipelineLayout *CCMTLDevice::createPipelineLayout(const PipelineLayoutInfo &info) {
    auto pipelineLayout = CC_NEW(CCMTLPipelineLayout(this));
    if (pipelineLayout && pipelineLayout->initialize(info))
        return pipelineLayout;

    CC_SAFE_DESTROY(pipelineLayout);
    return nullptr;
}

PipelineState *CCMTLDevice::createPipelineState(const PipelineStateInfo &info) {
    auto ps = CC_NEW(CCMTLPipelineState(this));
    if (ps && ps->initialize(info))
        return ps;

    CC_SAFE_DESTROY(ps);
    return nullptr;
}

void CCMTLDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    // This assumes the default command buffer will get submitted every frame,
    // which is true for now but may change in the future. This appoach gives us
    // the wiggle room to leverage immediate update vs. copy-upload strategies without
    // breaking compatabilities. When we reached some conclusion on this subject,
    // getting rid of this interface all together may become a better option.
    _cmdBuff->begin();
    static_cast<CCMTLCommandBuffer *>(_cmdBuff)->copyBuffersToTexture(buffers, texture, regions, count);
}

void CCMTLDevice::blitBuffer(void *srcData, uint offset, uint size, void *dstBuffer) {
    CCMTLGPUBuffer stagingBuffer;
    stagingBuffer.size = size;
    _gpuStagingBufferPool->alloc(&stagingBuffer);
    memcpy(stagingBuffer.mappedData, srcData, size);

    // Create a command buffer for GPU work.
    id<MTLCommandBuffer> commandBuffer = [id<MTLCommandQueue>(_mtlCommandQueue) commandBuffer];

    // Encode a blit pass to copy data from the source buffer to the private buffer.
    id<MTLBlitCommandEncoder> blitCommandEncoder = [commandBuffer blitCommandEncoder];
    [blitCommandEncoder copyFromBuffer:stagingBuffer.mtlBuffer
                          sourceOffset:stagingBuffer.startOffset
                              toBuffer:id<MTLBuffer>(dstBuffer)
                     destinationOffset:offset
                                  size:size];
    [blitCommandEncoder endEncoding];
    [commandBuffer commit];
}

} // namespace gfx
} // namespace cc
