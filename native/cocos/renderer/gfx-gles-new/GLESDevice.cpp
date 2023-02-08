#include "GLESDevice.h"
#include "egl/Wrapper.h"
#include "GLESShader.h"
#include "GLESTexture.h"
#include "GLESBuffer.h"
#include "GLESDescriptorSet.h"
#include "GLESDescriptorSetLayout.h"
#include "GLESPipelineLayout.h"
#include "GLESPipelineState.h"
#include "GLESSampler.h"
#include "GLESQueue.h"
#include "GLESCommandBuffer.h"
#include "GLESSwapchain.h"
#include "GLESFramebuffer.h"
#include "GLESInputAssembler.h"
#include "GLESRenderPass.h"
#include <memory>

std::unique_ptr<cc::gfx::egl::Wrapper> wrapper;

namespace cc::gfx::gles {
Device *Device::instance = nullptr;
Device *Device::getInstance() {
    return Device::instance;
}

Device::~Device() {
    Device::instance = nullptr;
}

Device::Device() {
    _api = API::GLES3;
    _deviceName = "GLES3";
    Device::instance = this;
}

bool Device::doInit(const DeviceInfo &info) {
    if (!wrapper) {
        wrapper = std::make_unique<egl::Wrapper>();
        wrapper->init();
    }
    initContext();
    initDefaultObject();
    initCaps();
    return true;
}

void Device::acquire(gfx::Swapchain *const *swapchains, uint32_t count) {
    _swapChains.clear();
    for (uint32_t i = 0; i < count; ++i) {
        _swapChains.push_back(static_cast<Swapchain *>(swapchains[i]));
    }
}

void Device::present() {
    for (auto *swapchain : _swapChains) {
        IntrusivePtr<egl::Surface> surface = swapchain->getSurface();
        _graphicsQueue->queueTask([surface]() {
            surface->swapBuffer();
        });
    }
}

void Device::waitIdle() {
    _graphicsQueue->waitIdle();
    _asyncQueue->waitIdle();
}

void Device::doDestroy() {

    // release queue && context
    _graphicsQueue = nullptr;
    _asyncQueue = nullptr;

    _cmdBuff = nullptr;
    _queryPool = nullptr;
    _queue = nullptr;

    _mainContext = nullptr;
    _graphicsContext = nullptr;
    _asyncContext = nullptr;
}

void Device::initContext() {
    egl::ContextInfo info = {};
    _mainContext = std::make_unique<egl::Context>();
    _mainContext->init(info);
    _mainContext->makeCurrent();

    info.sharedContext = _mainContext->getContext();

    _renderer = reinterpret_cast<const char *>(glGetString(GL_RENDERER));
    _vendor = reinterpret_cast<const char *>(glGetString(GL_VENDOR));
    _version = reinterpret_cast<const char *>(glGetString(GL_VERSION));

    // init graphics queue
    _graphicsContext = std::make_unique<egl::Context>();
    _graphicsContext->init(info);

    QueueInfo queueInfo = {};
    _graphicsQueue = ccnew Queue();
    _graphicsQueue->initialize(queueInfo);
    _graphicsQueue->initContext(_graphicsContext.get());

    // init async queue
    info.config.rgb     = 8;
    info.config.depth   = 0;
    info.config.stencil = 0;
    _asyncContext = std::make_unique<egl::Context>();
    _asyncContext->init(info);

    queueInfo.type = QueueType::TRANSFER;
    _asyncQueue = ccnew Queue();
    _asyncQueue->initialize(queueInfo);
    _asyncQueue->initContext(_asyncContext.get());
}

void Device::initDefaultObject() {
    _queue = _graphicsQueue.get();

    // QueryPoolInfo queryPoolInfo{QueryType::OCCLUSION, DEFAULT_MAX_QUERY_OBJECTS, false};
    // _queryPool = createQueryPool(queryPoolInfo);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _defaultCmdBuffer = createCommandBuffer(cmdBuffInfo);
    _cmdBuff = _defaultCmdBuffer.get();
}

void Device::initCaps() {
    glGetIntegerv(GL_MAX_VERTEX_ATTRIBS, reinterpret_cast<GLint *>(&_caps.maxVertexAttributes));
    glGetIntegerv(GL_MAX_VERTEX_UNIFORM_VECTORS, reinterpret_cast<GLint *>(&_caps.maxVertexUniformVectors));
    glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_VECTORS, reinterpret_cast<GLint *>(&_caps.maxFragmentUniformVectors));
    glGetIntegerv(GL_MAX_UNIFORM_BUFFER_BINDINGS, reinterpret_cast<GLint *>(&_caps.maxUniformBufferBindings));
    glGetIntegerv(GL_MAX_UNIFORM_BLOCK_SIZE, reinterpret_cast<GLint *>(&_caps.maxUniformBlockSize));
    glGetIntegerv(GL_MAX_DRAW_BUFFERS, reinterpret_cast<GLint *>(&_caps.maxColorRenderTargets));
    glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, reinterpret_cast<GLint *>(&_caps.maxTextureUnits));
    glGetIntegerv(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS, reinterpret_cast<GLint *>(&_caps.maxVertexTextureUnits));
    glGetIntegerv(GL_MAX_TEXTURE_SIZE, reinterpret_cast<GLint *>(&_caps.maxTextureSize));
    glGetIntegerv(GL_MAX_CUBE_MAP_TEXTURE_SIZE, reinterpret_cast<GLint *>(&_caps.maxCubeMapTextureSize));
    glGetIntegerv(GL_UNIFORM_BUFFER_OFFSET_ALIGNMENT, reinterpret_cast<GLint *>(&_caps.uboOffsetAlignment));
    glGetIntegerv(GL_MAX_ARRAY_TEXTURE_LAYERS, reinterpret_cast<GLint *>(&_caps.maxArrayTextureLayers));
    glGetIntegerv(GL_MAX_3D_TEXTURE_SIZE, reinterpret_cast<GLint *>(&_caps.max3DTextureSize));

//    if (_gpuConstantRegistry->glMinorVersion) {
//        glGetIntegerv(GL_MAX_IMAGE_UNITS, reinterpret_cast<GLint *>(&_caps.maxImageUnits));
//        glGetIntegerv(GL_MAX_SHADER_STORAGE_BLOCK_SIZE, reinterpret_cast<GLint *>(&_caps.maxShaderStorageBlockSize));
//        glGetIntegerv(GL_MAX_SHADER_STORAGE_BUFFER_BINDINGS, reinterpret_cast<GLint *>(&_caps.maxShaderStorageBufferBindings));
//        glGetIntegerv(GL_MAX_COMPUTE_SHARED_MEMORY_SIZE, reinterpret_cast<GLint *>(&_caps.maxComputeSharedMemorySize));
//        glGetIntegerv(GL_MAX_COMPUTE_WORK_GROUP_INVOCATIONS, reinterpret_cast<GLint *>(&_caps.maxComputeWorkGroupInvocations));
//        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_SIZE, 0, reinterpret_cast<GLint *>(&_caps.maxComputeWorkGroupSize.x));
//        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_SIZE, 1, reinterpret_cast<GLint *>(&_caps.maxComputeWorkGroupSize.y));
//        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_SIZE, 2, reinterpret_cast<GLint *>(&_caps.maxComputeWorkGroupSize.z));
//        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_COUNT, 0, reinterpret_cast<GLint *>(&_caps.maxComputeWorkGroupCount.x));
//        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_COUNT, 1, reinterpret_cast<GLint *>(&_caps.maxComputeWorkGroupCount.y));
//        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_COUNT, 2, reinterpret_cast<GLint *>(&_caps.maxComputeWorkGroupCount.z));
//    }
}

gfx::CommandBuffer *Device::createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) {
    return ccnew CommandBuffer();
}

gfx::Queue *Device::createQueue() {
    return ccnew Queue();
}

gfx::QueryPool *Device::createQueryPool() {
    return nullptr;
}

gfx::Swapchain *Device::createSwapchain() {
    return ccnew Swapchain();
}

gfx::Buffer *Device::createBuffer() {
    return ccnew Buffer();
}

gfx::Texture *Device::createTexture() {
    return ccnew Texture();
}

gfx::Shader *Device::createShader() {
    return ccnew Shader();
}

gfx::InputAssembler *Device::createInputAssembler() {
    return ccnew InputAssembler();
}

gfx::RenderPass *Device::createRenderPass() {
    return ccnew RenderPass();
}

gfx::Framebuffer *Device::createFramebuffer() {
    return ccnew Framebuffer();
}

gfx::DescriptorSet *Device::createDescriptorSet() {
    return ccnew DescriptorSet();
}

gfx::DescriptorSetLayout *Device::createDescriptorSetLayout() {
    return ccnew DescriptorSetLayout();
}

gfx::PipelineLayout *Device::createPipelineLayout() {
    return ccnew PipelineLayout();
}

gfx::PipelineState *Device::createPipelineState() {
    return ccnew PipelineState();
}

gfx::Sampler *Device::createSampler(const SamplerInfo &info) {
    return ccnew Sampler(info);
}

gfx::GeneralBarrier *Device::createGeneralBarrier(const GeneralBarrierInfo &info) {
    return ccnew GeneralBarrier(info);
}


} // namespace cc::gles
