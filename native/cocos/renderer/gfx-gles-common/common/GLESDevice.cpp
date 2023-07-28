#include "GLESDevice.h"
#include "base/StringUtil.h"
#include "gfx-gles-common/egl/Instance.h"
#include "GLESBuffer.h"
#include "GLESCommandBuffer.h"
#include "GLESDescriptorSet.h"
#include "GLESDescriptorSetLayout.h"
#include "GLESFramebuffer.h"
#include "GLESInputAssembler.h"
#include "GLESPipelineLayout.h"
#include "GLESPipelineState.h"
#include "GLESRenderPass.h"
#include "GLESSampler.h"
#include "GLESShader.h"
#include "GLESSwapchain.h"
#include "GLESTexture.h"

namespace cc::gfx {
static constexpr bool ENABLE_ASYNC_CONTEXT = true;

GLESDevice *GLESDevice::instance = nullptr;
GLESDevice *GLESDevice::getInstance() {
    return GLESDevice::instance;
}

GLESDevice::~GLESDevice() {
    GLESDevice::instance = nullptr;
}

GLESDevice::GLESDevice() {
    GLESDevice::instance = this;
}

bool GLESDevice::initContext(EGLint majorVersion) {
    egl::ContextInfo info = {};
    info.majorVersion = majorVersion;

    uint32_t contextID = 0;
    _mainContext = std::make_unique<egl::Context>(contextID++);
    if (!_mainContext->init(info)) {
        return false;
    }
    if (_mainContext->getMajorVersion() < 3) {
        _api = API::GLES2;
        _deviceName = "GLES2";
    } else {
        _api = API::GLES3;
        _deviceName = "GLES3";
    }

    QueueInfo queueInfo = {};
    _graphicsQueue = ccnew GLESQueue();
    _graphicsQueue->initialize(queueInfo);

    _queue = _graphicsQueue.get();
    _queues[toNumber(QueueType::GRAPHICS)] = _graphicsQueue.get();
    _queues[toNumber(QueueType::COMPUTE)] = _graphicsQueue.get();
    _queues[toNumber(QueueType::TRANSFER)] = _graphicsQueue.get();

    if (ENABLE_ASYNC_CONTEXT) {
        /**
         * 3 context, 2 async queue
         * mainContext(logic thread)
         * graphicsContext(Queue with thread1): for render commands encode
         * asyncContext(Queue with thread2): for transfer commands
         */
        info.sharedContext = _mainContext->getContext();

        // main context
        _mainContext->makeCurrent();

        // init async queue
        queueInfo.type = QueueType::TRANSFER;
        _asyncQueue = ccnew GLESQueue();
        _asyncQueue->initialize(queueInfo);

        // init graphics queue context
        _graphicsContext = std::make_unique<egl::Context>(contextID++);
        _graphicsContext->init(info);
        _graphicsQueue->startThread();
        _graphicsQueue->initContext(_graphicsContext.get());

        // init async queue context
        memset(&info.config, 0, sizeof(egl::Config));
        _asyncContext = std::make_unique<egl::Context>(contextID++);
        _asyncContext->init(info);
        _asyncQueue->startThread();
        _asyncQueue->initContext(_asyncContext.get());

        _queues[toNumber(QueueType::TRANSFER)] = _asyncQueue.get();
    } else {
        /**
         * 1 context, 1 queue
         * mainContext(logic thread)
         */
        _graphicsQueue->initContext(_mainContext.get());
    }
    _cacheStates.resize(contextID);
    for (uint32_t i = 0; i < contextID; ++i) {
        _cacheStates[i].reset(ccnew GLESGPUStateCache);
    }

    _renderer = reinterpret_cast<const char *>(glGetString(GL_RENDERER));
    _vendor = reinterpret_cast<const char *>(glGetString(GL_VENDOR));
    _version = reinterpret_cast<const char *>(glGetString(GL_VERSION));
    _extensions = StringUtil::split(reinterpret_cast<const char *>(glGetString(GL_EXTENSIONS)), " ");

    initGLESCmdFunctions(_mainContext->getMajorVersion());

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff = createCommandBuffer(cmdBuffInfo);
    return true;
}

void GLESDevice::initDeviceFeaturesAndConstants() {
    glesUpdateFormatFeature(this, _formatFeatures);
    glesUpdateTextureExclusive(this, _textureExclusive);
    glesUpdateFeatureAndCapabilities(this, _caps, _gpuConstantRegistry, _features);

    CC_LOG_INFO("GLES3 device initialized.");
    CC_LOG_INFO("RENDERER: %s", _renderer.c_str());
    CC_LOG_INFO("VENDOR: %s", _vendor.c_str());
    CC_LOG_INFO("VERSION: %s", _version.c_str());
    CC_LOG_INFO("COMPRESSED_FORMATS: %s", _gpuConstantRegistry.compressedFmts.c_str());
    CC_LOG_INFO("FRAMEBUFFER_FETCH: %s", _gpuConstantRegistry.fbfLevelStr.c_str());
    CC_LOG_INFO("MULTI_SAMPLE_RENDER_TO_TEXTURE: %s", _gpuConstantRegistry.msaaLevelStr.c_str());
}

void GLESDevice::initDefaultObject() {

}

void GLESDevice::frameSync() {

}

void GLESDevice::acquire(gfx::Swapchain *const *swapchains, uint32_t count) {
    _currentSwapChains.clear();
    for (uint32_t i = 0; i < count; ++i) {
        _currentSwapChains.push_back(static_cast<GLESSwapchain *>(swapchains[i]));
    }
}

void GLESDevice::present() {
    for (auto *swapchain : _currentSwapChains) {
        IntrusivePtr<egl::Surface> const surface = swapchain->gpuSwapchain()->surface;
        _graphicsQueue->queueTask([=]() {
            surface->swapBuffer();
        });
    }

    _frameIndex = (_frameIndex + 1) % _maxFrame;
    _recycleBins[_frameIndex]->clear();
    _stagingStorages[_frameIndex]->reset();
}

void GLESDevice::copyBuffersToTexture(const uint8_t *const *buffers, gfx::Texture *dst, const BufferTextureCopy *regions, uint32_t count) {
    glesCopyBuffersToTexture(GLESDevice::getInstance(), buffers, static_cast<GLESTexture *>(dst)->gpuTexture(), regions, count);
}

void GLESDevice::copyTextureToBuffers(gfx::Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count) {

}

void GLESDevice::waitIdle() {
    _graphicsQueue->waitIdle();
    if (_asyncQueue) {
        _asyncQueue->waitIdle();
    }
}

bool GLESDevice::doInit(const DeviceInfo & /*info*/) {
    if (!egl::Instance::initialize()) {
        return false;
    }

#ifdef CC_USE_GLES3
    if (!initContext(3)) {
        return false;
    }
#endif
#ifdef CC_USE_GLES2
    if (!_mainContext && !initContext(2)) {
        return false;
    }
#endif

    initDeviceFeaturesAndConstants();
    initDefaultObject();

#if CC_USE_PIPELINE_CACHE
    _pipelineCache = std::make_unique<GLES3PipelineCache>();
    _pipelineCache->init();
#endif
    for (uint32_t i = 0; i < MAX_FRAME; ++i) {
        _recycleBins[i] = std::make_unique<GLESRecycleBin>();
        _stagingStorages[i] = std::make_unique<GLESCommandStorage>();
    }

    return true;
}

void GLESDevice::doDestroy() {
    _mainContext = nullptr;
    _graphicsContext = nullptr;
    _asyncContext = nullptr;
    _graphicsQueue = nullptr;
    _asyncQueue = nullptr;
    _defaultCmdBuffer = nullptr;
    _pipelineCache = nullptr;

    _cmdBuff = nullptr;
    _queue = nullptr;
    egl::Instance::shutdown();
}

CommandBuffer *GLESDevice::createCommandBuffer(const CommandBufferInfo & /*info*/, bool /*hasAgent*/) {
    return ccnew GLESCommandBuffer;
}

Queue *GLESDevice::createQueue() {
    return nullptr;
}

QueryPool *GLESDevice::createQueryPool() {
    return nullptr;
}

Swapchain *GLESDevice::createSwapchain() {
    return ccnew GLESSwapchain;
}

Buffer *GLESDevice::createBuffer() {
    return ccnew GLESBuffer;
}

Texture *GLESDevice::createTexture() {
    return ccnew GLESTexture;
}

Shader *GLESDevice::createShader() {
    return ccnew GLESShader;
}

InputAssembler *GLESDevice::createInputAssembler() {
    return ccnew GLESInputAssembler;
}

RenderPass *GLESDevice::createRenderPass() {
    return ccnew GLESRenderPass;
}

Framebuffer *GLESDevice::createFramebuffer() {
    return ccnew GLESFramebuffer;
}

DescriptorSet *GLESDevice::createDescriptorSet() {
    return ccnew GLESDescriptorSet;
}

DescriptorSetLayout *GLESDevice::createDescriptorSetLayout() {
    return ccnew GLESDescriptorSetLayout;
}

PipelineLayout *GLESDevice::createPipelineLayout() {
    return ccnew GLESPipelineLayout;
}

PipelineState *GLESDevice::createPipelineState() {
    return ccnew GLESPipelineState;
}

Sampler *GLESDevice::createSampler(const SamplerInfo &info) {
    return ccnew GLESSampler(info);
}

GeneralBarrier *GLESDevice::createGeneralBarrier(const GeneralBarrierInfo &info) {
    return ccnew GeneralBarrier(info);
}

} // namespace cc::gfx
