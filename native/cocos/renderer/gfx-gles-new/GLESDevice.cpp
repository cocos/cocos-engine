#include "GLESDevice.h"
#include "base/StringUtil.h"
#include "GLESBuffer.h"
#include "GLESCommandBuffer.h"
#include "GLESDescriptorSet.h"
#include "GLESDescriptorSetLayout.h"
#include "GLESFramebuffer.h"
#include "GLESInputAssembler.h"
#include "GLESPipelineLayout.h"
#include "GLESPipelineState.h"
#include "GLESQueue.h"
#include "GLESRenderPass.h"
#include "GLESSampler.h"
#include "GLESShader.h"
#include "GLESSwapchain.h"
#include "GLESTexture.h"
#include "egl/Wrapper.h"
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

void Device::copyBuffersToTexture(const uint8_t *const *buffers, gfx::Texture *dst, const BufferTextureCopy *regions, uint32_t count) {
    auto *texture = static_cast<Texture *>(dst);
    auto textureType = texture->getInfo().type;

    auto format = texture->getFormat();
    const auto blockSize = formatAlignment(format);

    auto *gpuTextureView = texture->getGPUTextureView();
    auto *gpuFormatInfo = gpuTextureView->texture->format;

    GL_CHECK(glBindTexture(gpuTextureView->texture->target, gpuTextureView->texture->texId));
    Extent extent{};
    Offset offset{};
    Extent stride{};
    for (uint32_t i = 0, n = 0; i < count; ++i) {
        const auto &region = regions[i];
        uint32_t mipLevel = region.texSubres.mipLevel;

        offset.x = region.texOffset.x == 0 ? 0 : utils::alignTo(region.texOffset.x, static_cast<int32_t>(blockSize.first));
        offset.y = region.texOffset.y == 0 ? 0 : utils::alignTo(region.texOffset.y, static_cast<int32_t>(blockSize.second));
        offset.z = region.texOffset.z;

        extent.width = utils::alignTo(region.texExtent.width, static_cast<uint32_t>(blockSize.first));
        extent.height = utils::alignTo(region.texExtent.height, static_cast<uint32_t>(blockSize.second));
        extent.depth = region.texExtent.depth;

        stride.width = region.buffStride > 0 ? region.buffStride : extent.width;
        stride.height = region.buffTexHeight > 0 ? region.buffTexHeight : extent.height;

        uint32_t destWidth = 0;
        uint32_t destHeight = 0;
        destWidth = (region.texExtent.width + offset.x == (texture->getWidth() >> mipLevel)) ? region.texExtent.width : extent.width;
        destHeight = (region.texExtent.height + offset.y == (texture->getWidth() >> mipLevel)) ? region.texExtent.height : extent.height;

        uint32_t faceBegin = region.texSubres.baseArrayLayer;
        uint32_t faceEnd = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
        auto memSize = static_cast<GLsizei>(formatSize(format, extent.width, extent.height, extent.depth));

        GLenum target = GL_NONE;
        switch (textureType) {
            case TextureType::TEX2D:
            case TextureType::CUBE:
                for (uint32_t f = faceBegin; f < faceEnd; ++f) {
                    target = textureType == TextureType::TEX2D ? GL_TEXTURE_2D : GL_TEXTURE_CUBE_MAP_POSITIVE_X + f;
                    auto *buff = buffers[n++] + region.buffOffset;
                    if (gpuFormatInfo->isCompressed) {
                        GL_CHECK(glCompressedTexSubImage2D(target, mipLevel, offset.x, offset.y, destWidth, destHeight,
                                                           gpuFormatInfo->format, memSize, reinterpret_cast<const GLvoid *>(buff)));
                    } else {
                        GL_CHECK(glTexSubImage2D(target, mipLevel, offset.x, offset.y, destWidth, destHeight,
                                                 gpuFormatInfo->format, gpuFormatInfo->type, reinterpret_cast<const GLvoid *>(buff)));
                    }
                }
                break;
            case TextureType::TEX3D:
            case TextureType::TEX2D_ARRAY:
                for (uint32_t f = faceBegin; f < faceEnd; ++f) {
                    target = textureType == TextureType::TEX2D_ARRAY ? GL_TEXTURE_2D_ARRAY : GL_TEXTURE_3D;
                    GLint offsetZ = textureType == TextureType::TEX2D_ARRAY ? f : offset.z;
                    auto *buff = buffers[n++] + region.buffOffset;
                    if (gpuFormatInfo->isCompressed) {
                        GL_CHECK(glCompressedTexSubImage3D(target, mipLevel,
                                                           offset.x, offset.y, offsetZ,
                                                           destWidth, destHeight, extent.depth,
                                                           gpuFormatInfo->format, memSize, reinterpret_cast<const GLvoid *>(buff)));
                    } else {
                        GL_CHECK(glTexSubImage3D(target, mipLevel,
                                                 offset.x, offset.y, offsetZ,
                                                 destWidth, destHeight, extent.depth,
                                                 gpuFormatInfo->format, gpuFormatInfo->type,
                                                 reinterpret_cast<const GLvoid *>(buff)));
                    }
                }
            default:
                CC_ABORT();
                break;
        }
    }
    if (!gpuFormatInfo->isCompressed && hasFlag(dst->getInfo().flags, TextureFlagBit::GEN_MIPMAP)) {
        GL_CHECK(glGenerateMipmap(gpuTextureView->texture->target));
    }
    GL_CHECK(glBindTexture(gpuTextureView->texture->target, 0));
}

void Device::copyTextureToBuffers(gfx::Texture *src, uint8_t *const *buffers, const BufferTextureCopy *regions, uint32_t count) {

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
    ccstd::string extStr = reinterpret_cast<const char *>(glGetString(GL_EXTENSIONS));
    _extensions = StringUtil::split(extStr, " ");

    // init graphics queue
    _graphicsContext = std::make_unique<egl::Context>();
    _graphicsContext->init(info);

    QueueInfo queueInfo = {};
    _graphicsQueue = ccnew Queue();
    _graphicsQueue->initialize(queueInfo);
    _graphicsQueue->initContext(_graphicsContext.get());

    // init async queue
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

    // gl device cap
    if (checkExtension("buffer_storage")) {
        _glCap.persistentMap = true;
    }
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
