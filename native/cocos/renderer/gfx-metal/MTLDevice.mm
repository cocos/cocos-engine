/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLConfig.h"
#include "MTLContext.h"
#include "MTLDescriptorSet.h"
#include "MTLDescriptorSetLayout.h"
#include "MTLDevice.h"
#include "MTLFramebuffer.h"
#include "MTLInputAssembler.h"
#include "MTLPipelineLayout.h"
#include "MTLPipelineState.h"
#include "MTLQueue.h"
#include "MTLRenderPass.h"
#include "MTLSampler.h"
#include "MTLSemaphore.h"
#include "MTLShader.h"
#include "MTLTexture.h"
#include "cocos/bindings/event/CustomEventTypes.h"
#include "cocos/bindings/event/EventDispatcher.h"

namespace cc {
namespace gfx {

CCMTLDevice::CCMTLDevice() {
    _caps.clipSpaceMinZ = 0.0f;
    _caps.screenSpaceSignY = 1.0f;
    _caps.UVSpaceSignY = 1.0f;
}

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

    _inFlightSemaphore = CC_NEW(CCMTLSemaphore(MAX_FRAMES_IN_FLIGHT));
    _currentFrameIndex = 0;

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    NSView *view = (NSView *)_windowHandle;
#else
    UIView *view = (UIView *)_windowHandle;
#endif
    CAMetalLayer *layer = static_cast<CAMetalLayer *>(view.layer);
    _mtlLayer = layer;
    id<MTLDevice> mtlDevice = (id<MTLDevice>)layer.device;
    _mtlDevice = mtlDevice;
    _mtlCommandQueue = [mtlDevice newCommandQueueWithMaxCommandBufferCount: MAX_COMMAND_BUFFER_COUNT];

    _mtlFeatureSet = mu::highestSupportedFeatureSet(mtlDevice);
    const auto gpuFamily = mu::getGPUFamily(MTLFeatureSet(_mtlFeatureSet));
    _indirectDrawSupported = mu::isIndirectDrawSupported(gpuFamily);
    _caps.maxVertexAttributes = mu::getMaxVertexAttributes(gpuFamily);
    _caps.maxTextureUnits = _caps.maxVertexTextureUnits = mu::getMaxEntriesInTextureArgumentTable(gpuFamily);
    _maxSamplerUnits = mu::getMaxEntriesInSamplerStateArgumentTable(gpuFamily);
    _caps.maxTextureSize = mu::getMaxTexture2DWidthHeight(gpuFamily);
    _caps.maxCubeMapTextureSize = mu::getMaxCubeMapTextureWidthHeight(gpuFamily);
    _caps.maxColorRenderTargets = mu::getMaxColorRenderTarget(gpuFamily);
    _caps.uboOffsetAlignment = mu::getMinBufferOffsetAlignment(gpuFamily);
    _maxBufferBindingIndex = mu::getMaxEntriesInBufferArgumentTable(gpuFamily);
    _icbSuppored = mu::isIndirectCommandBufferSupported(MTLFeatureSet(_mtlFeatureSet));
    _isSamplerDescriptorCompareFunctionSupported = mu::isSamplerDescriptorCompareFunctionSupported(gpuFamily);

    if (layer.pixelFormat == MTLPixelFormatInvalid) {
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
    }
    // Persistent depth stencil texture
    MTLTextureDescriptor *dssDescriptor = [[MTLTextureDescriptor alloc] init];
    dssDescriptor.pixelFormat = mu::getSupportedDepthStencilFormat(mtlDevice, gpuFamily, _caps.depthBits);
    dssDescriptor.width = info.width;
    dssDescriptor.height = info.height;
    dssDescriptor.storageMode = MTLStorageModePrivate;
    dssDescriptor.usage = MTLTextureUsageRenderTarget;
    _dssTex = [mtlDevice newTextureWithDescriptor:dssDescriptor];
    _caps.stencilBits = 8;

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

    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        _gpuStagingBufferPools[i] = CC_NEW(CCMTLGPUStagingBufferPool(mtlDevice));
    }

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
    _features[static_cast<uint>(Feature::MULTITHREADED_SUBMISSION)] = true;

    _features[static_cast<uint>(Feature::FORMAT_RGB8)] = false;
    _features[static_cast<uint>(Feature::FORMAT_D16)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D16, gpuFamily);
    _features[static_cast<uint>(Feature::FORMAT_D16S8)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D16S8, gpuFamily);
    _features[static_cast<uint>(Feature::FORMAT_D24S8)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D24S8, gpuFamily);
    _features[static_cast<uint>(Feature::FORMAT_D32F)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D32F, gpuFamily);
    _features[static_cast<uint>(Feature::FORMAT_D32FS8)] = mu::isDepthStencilFormatSupported(mtlDevice, Format::D32F_S8, gpuFamily);

//    _memoryAlarmListenerId = EventDispatcher::addCustomEventListener(EVENT_MEMORY_WARNING, std::bind(&CCMTLDevice::onMemoryWarning, this));

    CCMTLGPUGarbageCollectionPool::getInstance()->initialize(std::bind(&CCMTLDevice::currentFrameIndex, this));

    CC_LOG_INFO("Metal Feature Set: %s", mu::featureSetToString(MTLFeatureSet(_mtlFeatureSet)).c_str());

    return true;
}

void CCMTLDevice::destroy() {
//    if (_memoryAlarmListenerId != 0) {
//        EventDispatcher::removeCustomEventListener(EVENT_MEMORY_WARNING, _memoryAlarmListenerId);
//        _memoryAlarmListenerId = 0;
//    }
    if (_autoreleasePool) {
        [(NSAutoreleasePool*)_autoreleasePool drain];
        _autoreleasePool = nullptr;
    }

    CCMTLGPUGarbageCollectionPool::getInstance()->flush();

    if (_inFlightSemaphore) {
        _inFlightSemaphore->syncAll();
    }

    if (_mtlCommandQueue) {
        [id<MTLCommandQueue>(_mtlCommandQueue) release];
        _mtlCommandQueue = nullptr;
    }

    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_cmdBuff);
    CC_SAFE_DESTROY(_context);
    CC_SAFE_DELETE(_inFlightSemaphore);

    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        CC_SAFE_DELETE(_gpuStagingBufferPools[i]);
        _gpuStagingBufferPools[i] = nullptr;
    }
}

void CCMTLDevice::resize(uint /*width*/, uint /*height*/) {}

void CCMTLDevice::acquire() {
    _inFlightSemaphore->wait();

    if (!_autoreleasePool) {
        _autoreleasePool = [[NSAutoreleasePool alloc] init];
//        CC_LOG_INFO("POOL: %p ALLOCED", _autoreleasePool);
    }
    // Clear queue stats
    CCMTLQueue *queue = static_cast<CCMTLQueue *>(_queue);
    queue->_numDrawCalls = 0;
    queue->_numInstances = 0;
    queue->_numTriangles = 0;
}

void CCMTLDevice::present() {
    CCMTLQueue *queue = (CCMTLQueue *)_queue;
    _numDrawCalls = queue->_numDrawCalls;
    _numInstances = queue->_numInstances;
    _numTriangles = queue->_numTriangles;

    //hold this pointer before update _currentFrameIndex
    _currentBufferPoolId = _currentFrameIndex;
    _currentFrameIndex = (_currentFrameIndex + 1) % MAX_FRAMES_IN_FLIGHT;

    if (_autoreleasePool) {
//        CC_LOG_INFO("POOL: %p RELEASED", _autoreleasePool);
        [(NSAutoreleasePool*)_autoreleasePool drain];
        _autoreleasePool = nullptr;
    }
}

void CCMTLDevice::presentCompleted() {
    if (_currentBufferPoolId >= 0 && _currentBufferPoolId < MAX_FRAMES_IN_FLIGHT) {
        CCMTLGPUStagingBufferPool *bufferPool = _gpuStagingBufferPools[_currentBufferPoolId];
        if (bufferPool) {
            bufferPool->reset();
            CCMTLGPUGarbageCollectionPool::getInstance()->clear(_currentBufferPoolId);
        }
    }
    _inFlightSemaphore->signal();
}

void *CCMTLDevice::getCurrentDrawable() {
    if (!_activeDrawable)    {
        CAMetalLayer *layer = (CAMetalLayer*)getMTLLayer();
        _activeDrawable = [[layer nextDrawable] retain];
    }
    return _activeDrawable;
}

void CCMTLDevice::disposeCurrentDrawable() {
    if (_activeDrawable) {
        [(id<CAMetalDrawable>)_activeDrawable release];
        _activeDrawable = nil;
    }
}

Queue *CCMTLDevice::createQueue() {
    return CC_NEW(CCMTLQueue(this));
}

CommandBuffer *CCMTLDevice::doCreateCommandBuffer(const CommandBufferInfo &info, bool /*hasAgent*/) {
    return CC_NEW(CCMTLCommandBuffer(this));
}

Buffer *CCMTLDevice::createBuffer() {
    return CC_NEW(CCMTLBuffer(this));
}

Texture *CCMTLDevice::createTexture() {
    return CC_NEW(CCMTLTexture(this));
}

Sampler *CCMTLDevice::createSampler() {
    return CC_NEW(CCMTLSampler(this));
}

Shader *CCMTLDevice::createShader() {
    return CC_NEW(CCMTLShader(this));
}

InputAssembler *CCMTLDevice::createInputAssembler() {
    return CC_NEW(CCMTLInputAssembler(this));
}

RenderPass *CCMTLDevice::createRenderPass() {
    return CC_NEW(CCMTLRenderPass(this));
}

Framebuffer *CCMTLDevice::createFramebuffer() {
    return CC_NEW(CCMTLFramebuffer(this));
}

DescriptorSet *CCMTLDevice::createDescriptorSet() {
    return CC_NEW(CCMTLDescriptorSet(this));
}

DescriptorSetLayout *CCMTLDevice::createDescriptorSetLayout() {
    return CC_NEW(CCMTLDescriptorSetLayout(this));
}

PipelineLayout *CCMTLDevice::createPipelineLayout() {
    return CC_NEW(CCMTLPipelineLayout(this));
}

PipelineState *CCMTLDevice::createPipelineState() {
    return CC_NEW(CCMTLPipelineState(this));
}

GlobalBarrier *CCMTLDevice::createGlobalBarrier() {
    return CC_NEW(GlobalBarrier(this));
}

TextureBarrier *CCMTLDevice::createTextureBarrier() {
    return CC_NEW(TextureBarrier(this));
}

void CCMTLDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    // This assumes the default command buffer will get submitted every frame,
    // which is true for now but may change in the future. This approach gives us
    // the wiggle room to leverage immediate update vs. copy-upload strategies without
    // breaking compatibilities. When we reached some conclusion on this subject,
    // getting rid of this interface all together may become a better option.
    _cmdBuff->begin();
    static_cast<CCMTLCommandBuffer *>(_cmdBuff)->copyBuffersToTexture(buffers, texture, regions, count);
}

void CCMTLDevice::onMemoryWarning() {
    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        _gpuStagingBufferPools[i]->shrinkSize();
    }
}

} // namespace gfx
} // namespace cc
