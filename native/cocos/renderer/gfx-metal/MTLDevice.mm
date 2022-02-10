/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#import "MTLStd.h"

#import "MTLBuffer.h"
#import "MTLCommandBuffer.h"
#import "MTLConfig.h"
#import "MTLDescriptorSet.h"
#import "MTLDescriptorSetLayout.h"
#import "MTLDevice.h"
#import "MTLFramebuffer.h"
#import "MTLGPUObjects.h"
#import "MTLInputAssembler.h"
#import "MTLPipelineLayout.h"
#import "MTLPipelineState.h"
#import "MTLQueryPool.h"
#import "MTLQueue.h"
#import "MTLRenderPass.h"
#import "MTLSampler.h"
#import "MTLSemaphore.h"
#import "MTLShader.h"
#import "MTLSwapchain.h"
#import "MTLTexture.h"
#import "cocos/bindings/event/CustomEventTypes.h"
#import "cocos/bindings/event/EventDispatcher.h"

namespace cc {
namespace gfx {

CCMTLDevice *CCMTLDevice::_instance = nullptr;

CCMTLDevice *CCMTLDevice::getInstance() {
    return CCMTLDevice::_instance;
}

CCMTLDevice::CCMTLDevice() {
    _api        = API::METAL;
    _deviceName = "Metal";

    _caps.supportQuery     = true;
    _caps.clipSpaceMinZ    = 0.0f;
    _caps.screenSpaceSignY = -1.0f;
    _caps.clipSpaceSignY   = 1.0f;

    CCMTLDevice::_instance = this;
}

CCMTLDevice::~CCMTLDevice() {
    CCMTLDevice::_instance = nullptr;
}

bool CCMTLDevice::doInit(const DeviceInfo &info) {
    _gpuDeviceObj      = CC_NEW(CCMTLGPUDeviceObject);
    _inFlightSemaphore = CC_NEW(CCMTLSemaphore(MAX_FRAMES_IN_FLIGHT));
    _currentFrameIndex = 0;

    id<MTLDevice> mtlDevice = MTLCreateSystemDefaultDevice();
    _mtlDevice              = mtlDevice;

    _mtlFeatureSet            = mu::highestSupportedFeatureSet(mtlDevice);
    const auto gpuFamily      = mu::getGPUFamily(MTLFeatureSet(_mtlFeatureSet));
    _indirectDrawSupported    = mu::isIndirectDrawSupported(gpuFamily);
    _caps.maxVertexAttributes = mu::getMaxVertexAttributes(gpuFamily);
    _caps.maxTextureUnits = _caps.maxVertexTextureUnits = mu::getMaxEntriesInTextureArgumentTable(gpuFamily);
    _maxSamplerUnits                                    = mu::getMaxEntriesInSamplerStateArgumentTable(gpuFamily);
    _caps.maxTextureSize                                = mu::getMaxTexture2DWidthHeight(gpuFamily);
    _caps.maxCubeMapTextureSize                         = mu::getMaxCubeMapTextureWidthHeight(gpuFamily);
    _caps.maxColorRenderTargets                         = mu::getMaxColorRenderTarget(gpuFamily);
    _caps.uboOffsetAlignment                            = mu::getMinBufferOffsetAlignment(gpuFamily);
    _caps.maxComputeWorkGroupInvocations                = mu::getMaxThreadsPerGroup(gpuFamily);
    _caps.maxVertexUniformVectors                       = 255; //no explicit limit on vertex stage.
    _maxBufferBindingIndex                              = mu::getMaxEntriesInBufferArgumentTable(gpuFamily);
    _icbSuppored                                        = mu::isIndirectCommandBufferSupported(MTLFeatureSet(_mtlFeatureSet));
    _isSamplerDescriptorCompareFunctionSupported        = mu::isSamplerDescriptorCompareFunctionSupported(gpuFamily);

    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        _gpuStagingBufferPools[i] = CC_NEW(CCMTLGPUStagingBufferPool(mtlDevice));
    }

    initFormatFeatures(gpuFamily);

    String compressedFormats;

    if (getFormatFeatures(Format::BC1_SRGB_ALPHA) != FormatFeature::NONE) {
        compressedFormats += "dxt ";
    }

    if (getFormatFeatures(Format::ETC2_RGBA8) != FormatFeature::NONE) {
        compressedFormats += "etc2 ";
    }

    if (getFormatFeatures(Format::ASTC_RGBA_4X4) != FormatFeature::NONE) {
        compressedFormats += "astc ";
    }

    if (getFormatFeatures(Format::PVRTC_RGBA2) != FormatFeature::NONE) {
        compressedFormats += "pvrtc ";
    }

    _features[toNumber(Feature::INSTANCED_ARRAYS)]         = true;
    _features[toNumber(Feature::MULTIPLE_RENDER_TARGETS)]  = true;
    _features[toNumber(Feature::BLEND_MINMAX)]             = true;
    _features[toNumber(Feature::ELEMENT_INDEX_UINT)]       = true;
    _features[toNumber(Feature::COMPUTE_SHADER)]           = true;
    _features[toNumber(Feature::INPUT_ATTACHMENT_BENEFIT)] = true;

    QueueInfo queueInfo;
    queueInfo.type = QueueType::GRAPHICS;
    _queue         = createQueue(queueInfo);

    QueryPoolInfo queryPoolInfo{QueryType::OCCLUSION, DEFAULT_MAX_QUERY_OBJECTS, true};
    _queryPool = createQueryPool(queryPoolInfo);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type  = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff          = createCommandBuffer(cmdBuffInfo);

    //    _memoryAlarmListenerId = EventDispatcher::addCustomEventListener(EVENT_MEMORY_WARNING, std::bind(&CCMTLDevice::onMemoryWarning, this));

    CCMTLGPUGarbageCollectionPool::getInstance()->initialize(std::bind(&CCMTLDevice::currentFrameIndex, this));

    CC_LOG_INFO("Metal Feature Set: %s", mu::featureSetToString(MTLFeatureSet(_mtlFeatureSet)).c_str());

    return true;
}

void CCMTLDevice::doDestroy() {
    //    if (_memoryAlarmListenerId != 0) {
    //        EventDispatcher::removeCustomEventListener(EVENT_MEMORY_WARNING, _memoryAlarmListenerId);
    //        _memoryAlarmListenerId = 0;
    //    }

    CC_DELETE(_gpuDeviceObj);
    
    CC_SAFE_DESTROY_AND_DELETE(_queryPool)
    CC_SAFE_DESTROY_AND_DELETE(_queue);
    CC_SAFE_DESTROY_AND_DELETE(_cmdBuff);

    CCMTLGPUGarbageCollectionPool::getInstance()->flush();

    if (_inFlightSemaphore) {
        // has present ? syncSuccess : no need to wait;
        _inFlightSemaphore->trySyncAll(1000);
    }

    CC_SAFE_DELETE(_inFlightSemaphore);

    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        CC_SAFE_DELETE(_gpuStagingBufferPools[i]);
        _gpuStagingBufferPools[i] = nullptr;
    }

    cc::gfx::mu::clearUtilResource();

    CCMTLTexture::deleteDefaultTexture();
    CCMTLSampler::deleteDefaultSampler();

    CCASSERT(!_memoryStatus.bufferSize, "Buffer memory leaked");
    CCASSERT(!_memoryStatus.textureSize, "Texture memory leaked");
}

void CCMTLDevice::acquire(Swapchain *const *swapchains, uint32_t count) {
    if (_onAcquire) _onAcquire->execute();

    _inFlightSemaphore->wait();

    for (CCMTLSwapchain *swapchain : _swapchains) {
        swapchain->acquire();
    }

    // Clear queue stats
    CCMTLQueue *queue                  = static_cast<CCMTLQueue *>(_queue);
    queue->gpuQueueObj()->numDrawCalls = 0;
    queue->gpuQueueObj()->numInstances = 0;
    queue->gpuQueueObj()->numTriangles = 0;
}

void CCMTLDevice::present() {
    CCMTLQueue *queue = (CCMTLQueue *)_queue;
    _numDrawCalls     = queue->gpuQueueObj()->numDrawCalls;
    _numInstances     = queue->gpuQueueObj()->numInstances;
    _numTriangles     = queue->gpuQueueObj()->numTriangles;

    //hold this pointer before update _currentFrameIndex
    _currentBufferPoolId = _currentFrameIndex;
    _currentFrameIndex   = (_currentFrameIndex + 1) % MAX_FRAMES_IN_FLIGHT;

    std::vector<id<CAMetalDrawable>> releaseQ;
    for (auto *swapchain : _swapchains) {
        auto drawable = swapchain->currentDrawable();
        if (drawable) {
            releaseQ.push_back([drawable retain]);
        }
        swapchain->release();
    }

    // present drawable
    {
        id<MTLCommandBuffer> cmdBuffer = [queue->gpuQueueObj()->mtlCommandQueue commandBuffer];
        [cmdBuffer enqueue];

        for (auto drawable : releaseQ) {
            [cmdBuffer presentDrawable:drawable];
            [drawable release];
        }
        [cmdBuffer addCompletedHandler:^(id<MTLCommandBuffer> commandBuffer) {
            onPresentCompleted();
        }];
        [cmdBuffer commit];
    }
}

void CCMTLDevice::onPresentCompleted() {
    if (_currentBufferPoolId >= 0 && _currentBufferPoolId < MAX_FRAMES_IN_FLIGHT) {
        CCMTLGPUStagingBufferPool *bufferPool = _gpuStagingBufferPools[_currentBufferPoolId];
        if (bufferPool) {
            bufferPool->reset();
            CCMTLGPUGarbageCollectionPool::getInstance()->clear(_currentBufferPoolId);
        }
    }
    _inFlightSemaphore->signal();
}

Queue *CCMTLDevice::createQueue() {
    return CC_NEW(CCMTLQueue);
}

QueryPool *CCMTLDevice::createQueryPool() {
    return CC_NEW(CCMTLQueryPool);
}

CommandBuffer *CCMTLDevice::createCommandBuffer(const CommandBufferInfo &info, bool /*hasAgent*/) {
    return CC_NEW(CCMTLCommandBuffer);
}

Buffer *CCMTLDevice::createBuffer() {
    return CC_NEW(CCMTLBuffer);
}

Texture *CCMTLDevice::createTexture() {
    return CC_NEW(CCMTLTexture);
}

Shader *CCMTLDevice::createShader() {
    return CC_NEW(CCMTLShader);
}

InputAssembler *CCMTLDevice::createInputAssembler() {
    return CC_NEW(CCMTLInputAssembler);
}

RenderPass *CCMTLDevice::createRenderPass() {
    return CC_NEW(CCMTLRenderPass);
}

Framebuffer *CCMTLDevice::createFramebuffer() {
    return CC_NEW(CCMTLFramebuffer);
}

DescriptorSet *CCMTLDevice::createDescriptorSet() {
    return CC_NEW(CCMTLDescriptorSet);
}

DescriptorSetLayout *CCMTLDevice::createDescriptorSetLayout() {
    return CC_NEW(CCMTLDescriptorSetLayout);
}

PipelineLayout *CCMTLDevice::createPipelineLayout() {
    return CC_NEW(CCMTLPipelineLayout);
}

PipelineState *CCMTLDevice::createPipelineState() {
    return CC_NEW(CCMTLPipelineState);
}

Sampler *CCMTLDevice::createSampler(const SamplerInfo &info) {
    return new CCMTLSampler(info);
}

Swapchain *CCMTLDevice::createSwapchain() {
    return new CCMTLSwapchain();
}

void CCMTLDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    // This assumes the default command buffer will get submitted every frame,
    // which is true for now but may change in the future. This approach gives us
    // the wiggle room to leverage immediate update vs. copy-upload strategies without
    // breaking compatibilities. When we reached some conclusion on this subject,
    // getting rid of this interface all together may become a better option.
    static_cast<CCMTLCommandBuffer *>(_cmdBuff)->copyBuffersToTexture(buffers, texture, regions, count);
}

void CCMTLDevice::copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint count) {
    static_cast<CCMTLCommandBuffer *>(_cmdBuff)->copyTextureToBuffers(src, buffers, region, count);
}

void CCMTLDevice::getQueryPoolResults(QueryPool *queryPool) {
    auto *             mtlQueryPool = static_cast<CCMTLQueryPool *>(queryPool);
    CCMTLGPUQueryPool *gpuQueryPool = mtlQueryPool->gpuQueryPool();
    auto               queryCount   = static_cast<uint32_t>(mtlQueryPool->_ids.size());
    CCASSERT(queryCount <= mtlQueryPool->getMaxQueryObjects(), "Too many query commands.");

    gpuQueryPool->semaphore->wait();
    uint64_t *results = queryCount > 0U ? static_cast<uint64_t *>(gpuQueryPool->visibilityResultBuffer.contents) : nullptr;

    std::unordered_map<uint32_t, uint64_t> mapResults;
    for (auto queryId = 0U; queryId < queryCount; queryId++) {
        uint32_t id   = mtlQueryPool->_ids[queryId];
        auto     iter = mapResults.find(id);
        if (iter != mapResults.end()) {
            iter->second += results[queryId];
        } else {
            mapResults[id] = results[queryId];
        }
    }

    {
        std::lock_guard<std::mutex> lock(mtlQueryPool->_mutex);
        mtlQueryPool->_results = std::move(mapResults);
    }
}

void CCMTLDevice::onMemoryWarning() {
    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        _gpuStagingBufferPools[i]->shrinkSize();
    }
}
void CCMTLDevice::initFormatFeatures(uint gpuFamily) {
    const FormatFeature completeFeature = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE;

    FormatFeature tempFeature = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::STORAGE_TEXTURE;

    _formatFeatures[toNumber(Format::R8UI)]    = tempFeature;
    _formatFeatures[toNumber(Format::RG8UI)]   = tempFeature;
    _formatFeatures[toNumber(Format::RGBA8UI)] = tempFeature;

    _formatFeatures[toNumber(Format::R16UI)]    = tempFeature;
    _formatFeatures[toNumber(Format::RG16UI)]   = tempFeature;
    _formatFeatures[toNumber(Format::RGBA16UI)] = tempFeature;

    _formatFeatures[toNumber(Format::R32F)]    = tempFeature;
    _formatFeatures[toNumber(Format::RG32F)]   = tempFeature;
    _formatFeatures[toNumber(Format::RGBA32F)] = tempFeature;

    if (mu::isUISamplerSupported(gpuFamily)) {
        tempFeature                                 = FormatFeature::RENDER_TARGET | FormatFeature::STORAGE_TEXTURE;
        _formatFeatures[toNumber(Format::R32UI)]    = tempFeature;
        _formatFeatures[toNumber(Format::RG32UI)]   = tempFeature;
        _formatFeatures[toNumber(Format::RGBA32UI)] = tempFeature;
    } else {
        tempFeature                                 = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::STORAGE_TEXTURE;
        _formatFeatures[toNumber(Format::R32UI)]    = tempFeature;
        _formatFeatures[toNumber(Format::RG32UI)]   = tempFeature;
        _formatFeatures[toNumber(Format::RGBA32UI)] = tempFeature;
    }

    if (mu::isRGB10A2UIStorageSupported(gpuFamily)) {
        _formatFeatures[toNumber(Format::RGB10A2UI)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
    } else {
        _formatFeatures[toNumber(Format::RGB10A2UI)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::STORAGE_TEXTURE;
    }

    tempFeature = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE;

    _formatFeatures[toNumber(Format::R8SN)]    = tempFeature;
    _formatFeatures[toNumber(Format::RG8SN)]   = tempFeature;
    _formatFeatures[toNumber(Format::RGBA8SN)] = tempFeature;

    _formatFeatures[toNumber(Format::R8)]    = tempFeature;
    _formatFeatures[toNumber(Format::RG8)]   = tempFeature;
    _formatFeatures[toNumber(Format::RGBA8)] = tempFeature;

    _formatFeatures[toNumber(Format::R16F)]    = tempFeature;
    _formatFeatures[toNumber(Format::RG16F)]   = tempFeature;
    _formatFeatures[toNumber(Format::RGBA16F)] = tempFeature;

    _formatFeatures[toNumber(Format::R11G11B10F)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
    _formatFeatures[toNumber(Format::RGB9E5)]     = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;

    if (mu::isDDepthStencilFilterSupported(gpuFamily)) {
        _formatFeatures[toNumber(Format::DEPTH)]         = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
        _formatFeatures[toNumber(Format::DEPTH_STENCIL)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
    } else {
        _formatFeatures[toNumber(Format::DEPTH)]         = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;
        _formatFeatures[toNumber(Format::DEPTH_STENCIL)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;
    }

    const FormatFeature compressedFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;
    if (mu::isPVRTCSuppported(gpuFamily)) {
        _formatFeatures[toNumber(Format::PVRTC_RGB2)]  = compressedFeature;
        _formatFeatures[toNumber(Format::PVRTC_RGBA2)] = compressedFeature;
        _formatFeatures[toNumber(Format::PVRTC_RGB4)]  = compressedFeature;
        _formatFeatures[toNumber(Format::PVRTC_RGBA4)] = compressedFeature;
    }
    if (mu::isEAC_ETCCSuppported(gpuFamily)) {
        _formatFeatures[toNumber(Format::ETC2_RGB8)]     = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_RGBA8)]    = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_SRGB8)]    = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_SRGB8_A8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_RGB8_A1)]  = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_SRGB8_A1)] = compressedFeature;
    }
    if (mu::isASTCSuppported(gpuFamily)) {
        _formatFeatures[toNumber(Format::ASTC_RGBA_4X4)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_5X4)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_5X5)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_6X5)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_6X6)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_8X5)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_8X6)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_8X8)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_10X5)]  = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_10X6)]  = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_10X8)]  = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_10X10)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_12X10)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_12X12)] = compressedFeature;

        _formatFeatures[toNumber(Format::ASTC_SRGBA_4X4)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_5X4)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_5X5)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_6X5)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_6X6)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_8X5)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_8X6)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_8X8)]   = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_10X5)]  = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_10X6)]  = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_10X8)]  = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_10X10)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_12X10)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_12X12)] = compressedFeature;
    }

    if (mu::isBCSupported(gpuFamily)) {
        _formatFeatures[toNumber(Format::BC1)]            = compressedFeature;
        _formatFeatures[toNumber(Format::BC1_ALPHA)]      = compressedFeature;
        _formatFeatures[toNumber(Format::BC1_SRGB)]       = compressedFeature;
        _formatFeatures[toNumber(Format::BC1_SRGB_ALPHA)] = compressedFeature;
        _formatFeatures[toNumber(Format::BC2)]            = compressedFeature;
        _formatFeatures[toNumber(Format::BC2_SRGB)]       = compressedFeature;
        _formatFeatures[toNumber(Format::BC3)]            = compressedFeature;
        _formatFeatures[toNumber(Format::BC3_SRGB)]       = compressedFeature;
    }

    _formatFeatures[toNumber(Format::R8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA8)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R8SN)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG8SN)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB8SN)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA8SN)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA8I)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA16I)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA16F)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R32UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG32UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB32UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA32UI)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R32I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG32I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB32I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA32I)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA32F)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::RGB10A2)] |= FormatFeature::VERTEX_ATTRIBUTE;
}

} // namespace gfx
} // namespace cc
