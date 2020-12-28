#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3CommandBuffer.h"
#include "GLES3Context.h"
#include "GLES3DescriptorSet.h"
#include "GLES3DescriptorSetLayout.h"
#include "GLES3Device.h"
#include "GLES3Fence.h"
#include "GLES3Framebuffer.h"
#include "GLES3InputAssembler.h"
#include "GLES3PipelineLayout.h"
#include "GLES3PipelineState.h"
#include "GLES3PrimaryCommandBuffer.h"
#include "GLES3Queue.h"
#include "GLES3RenderPass.h"
#include "GLES3Sampler.h"
#include "GLES3Shader.h"
#include "GLES3Texture.h"

namespace cc {
namespace gfx {

GLES3Device::GLES3Device() {
}

GLES3Device::~GLES3Device() {
}

bool GLES3Device::initialize(const DeviceInfo &info) {
    _API = API::GLES3;
    _deviceName = "GLES3";
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

    _gpuStateCache = CC_NEW(GLES3GPUStateCache);
    _gpuStagingBufferPool = CC_NEW(GLES3GPUStagingBufferPool);

    ContextInfo ctxInfo;
    ctxInfo.windowHandle = _windowHandle;
    ctxInfo.sharedCtx = info.sharedCtx;

    _renderContext = CC_NEW(GLES3Context(this));
    if (!_renderContext->initialize(ctxInfo)) {
        destroy();
        return false;
    }
    bindRenderContext(true);

    String extStr = (const char *)glGetString(GL_EXTENSIONS);
    _extensions = StringUtil::Split(extStr, " ");

    _features[(int)Feature::TEXTURE_FLOAT] = true;
    _features[(int)Feature::TEXTURE_HALF_FLOAT] = true;
    _features[(int)Feature::FORMAT_R11G11B10F] = true;
    _features[(int)Feature::FORMAT_D24S8] = true;
    _features[(int)Feature::MSAA] = true;
    _features[(int)Feature::INSTANCED_ARRAYS] = true;
    _features[(int)Feature::MULTIPLE_RENDER_TARGETS] = true;
    _features[(uint)Feature::BLEND_MINMAX] = true;

    if (checkExtension("color_buffer_float"))
        _features[(int)Feature::COLOR_FLOAT] = true;

    if (checkExtension("color_buffer_half_float"))
        _features[(int)Feature::COLOR_HALF_FLOAT] = true;

    if (checkExtension("texture_float_linear"))
        _features[(int)Feature::TEXTURE_FLOAT_LINEAR] = true;

    if (checkExtension("texture_half_float_linear"))
        _features[(int)Feature::TEXTURE_HALF_FLOAT_LINEAR] = true;

    String compressedFmts;

    if (checkExtension("compressed_ETC1")) {
        _features[(int)Feature::FORMAT_ETC1] = true;
        compressedFmts += "etc1 ";
    }

    _features[(int)Feature::FORMAT_ETC2] = true;
    compressedFmts += "etc2 ";

    if (checkExtension("texture_compression_pvrtc")) {
        _features[(int)Feature::FORMAT_PVRTC] = true;
        compressedFmts += "pvrtc ";
    }

    if (checkExtension("texture_compression_astc")) {
        _features[(int)Feature::FORMAT_ASTC] = true;
        compressedFmts += "astc ";
    }
    _features[static_cast<uint>(Feature::DEPTH_BOUNDS)] = true;
    _features[static_cast<uint>(Feature::LINE_WIDTH)] = true;
    _features[static_cast<uint>(Feature::STENCIL_COMPARE_MASK)] = true;
    _features[static_cast<uint>(Feature::STENCIL_WRITE_MASK)] = true;
    _features[static_cast<uint>(Feature::FORMAT_RGB8)] = true;
    _features[static_cast<uint>(Feature::FORMAT_D16)] = true;
    _features[static_cast<uint>(Feature::FORMAT_D24)] = true;
    _features[static_cast<uint>(Feature::FORMAT_D32F)] = true;
    _features[static_cast<uint>(Feature::FORMAT_D24S8)] = true;
    _features[static_cast<uint>(Feature::FORMAT_D32FS8)] = true;

    _renderer = (const char *)glGetString(GL_RENDERER);
    _vendor = (const char *)glGetString(GL_VENDOR);
    _version = (const char *)glGetString(GL_VERSION);

    CC_LOG_INFO("GLES3 device initialized.");
    CC_LOG_INFO("RENDERER: %s", _renderer.c_str());
    CC_LOG_INFO("VENDOR: %s", _vendor.c_str());
    CC_LOG_INFO("VERSION: %s", _version.c_str());
    CC_LOG_INFO("SCREEN_SIZE: %d x %d", _width, _height);
    CC_LOG_INFO("NATIVE_SIZE: %d x %d", _nativeWidth, _nativeHeight);
    CC_LOG_INFO("COMPRESSED_FORMATS: %s", compressedFmts.c_str());

    QueueInfo queueInfo;
    queueInfo.type = QueueType::GRAPHICS;
    _queue = createQueue(queueInfo);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff = createCommandBuffer(cmdBuffInfo);

    glGetIntegerv(GL_MAX_VERTEX_ATTRIBS, (GLint *)&_maxVertexAttributes);
    glGetIntegerv(GL_MAX_VERTEX_UNIFORM_VECTORS, (GLint *)&_maxVertexUniformVectors);
    glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_VECTORS, (GLint *)&_maxFragmentUniformVectors);
    glGetIntegerv(GL_MAX_UNIFORM_BUFFER_BINDINGS, (GLint *)&_maxUniformBufferBindings);
    glGetIntegerv(GL_MAX_UNIFORM_BLOCK_SIZE, (GLint *)&_maxUniformBlockSize);
    glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, (GLint *)&_maxTextureUnits);
    glGetIntegerv(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS, (GLint *)&_maxVertexTextureUnits);
    glGetIntegerv(GL_MAX_TEXTURE_SIZE, (GLint *)&_maxTextureSize);
    glGetIntegerv(GL_MAX_CUBE_MAP_TEXTURE_SIZE, (GLint *)&_maxCubeMapTextureSize);
    glGetIntegerv(GL_UNIFORM_BUFFER_OFFSET_ALIGNMENT, (GLint *)&_uboOffsetAlignment);
    glGetIntegerv(GL_DEPTH_BITS, (GLint *)&_depthBits);
    glGetIntegerv(GL_STENCIL_BITS, (GLint *)&_stencilBits);

    _gpuStateCache->initialize(_maxTextureUnits, _maxUniformBufferBindings, _maxVertexAttributes);

    return true;
}

void GLES3Device::destroy() {
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_cmdBuff);
    CC_SAFE_DELETE(_gpuStagingBufferPool);
    CC_SAFE_DELETE(_gpuStateCache);
    CC_SAFE_DESTROY(_deviceContext);
    CC_SAFE_DESTROY(_renderContext);
}

void GLES3Device::resize(uint width, uint height) {
    _width = width;
    _height = height;
}

void GLES3Device::acquire() {
    _gpuStagingBufferPool->reset();
}

void GLES3Device::present() {
    GLES3Queue *queue = (GLES3Queue *)_queue;
    _numDrawCalls = queue->_numDrawCalls;
    _numInstances = queue->_numInstances;
    _numTriangles = queue->_numTriangles;

    _context->present();

    // Clear queue stats
    queue->_numDrawCalls = 0;
    queue->_numInstances = 0;
    queue->_numTriangles = 0;
}

void GLES3Device::bindRenderContext(bool bound) {
    _renderContext->MakeCurrent(bound);
    _context = bound ? _renderContext : nullptr;

    if (bound) {
        _threadID = std::hash<std::thread::id>()(std::this_thread::get_id());
        _gpuStateCache->reset();
    }
}

void GLES3Device::bindDeviceContext(bool bound) {
    if (!_deviceContext) {
        ContextInfo ctxInfo;
        ctxInfo.windowHandle = _windowHandle;
        ctxInfo.sharedCtx = _renderContext;

        _deviceContext = CC_NEW(GLES3Context(this));
        _deviceContext->initialize(ctxInfo);
    }
    _deviceContext->MakeCurrent(bound);
    _context = bound ? _deviceContext : nullptr;

    if (bound) {
        std::hash<std::thread::id> hasher;
        _threadID = hasher(std::this_thread::get_id());
        _gpuStateCache->reset();
    }
}

CommandBuffer *GLES3Device::doCreateCommandBuffer(const CommandBufferInfo &info, bool hasAgent) {
    if (hasAgent || info.type == CommandBufferType::PRIMARY) return CC_NEW(GLES3PrimaryCommandBuffer(this));
    return CC_NEW(GLES3CommandBuffer(this));
}

Fence *GLES3Device::createFence() {
    return CC_NEW(GLES3Fence(this));
}

Queue *GLES3Device::createQueue() {
    return CC_NEW(GLES3Queue(this));
}

Buffer *GLES3Device::createBuffer() {
    return CC_NEW(GLES3Buffer(this));
}

Texture *GLES3Device::createTexture() {
    return CC_NEW(GLES3Texture(this));
}

Sampler *GLES3Device::createSampler() {
    return CC_NEW(GLES3Sampler(this));
}

Shader *GLES3Device::createShader() {
    return CC_NEW(GLES3Shader(this));
}

InputAssembler *GLES3Device::createInputAssembler() {
    return CC_NEW(GLES3InputAssembler(this));
}

RenderPass *GLES3Device::createRenderPass() {
    return CC_NEW(GLES3RenderPass(this));
}

Framebuffer *GLES3Device::createFramebuffer() {
    return CC_NEW(GLES3Framebuffer(this));
}

DescriptorSet *GLES3Device::createDescriptorSet() {
    return CC_NEW(GLES3DescriptorSet(this));
}

DescriptorSetLayout *GLES3Device::createDescriptorSetLayout() {
    return CC_NEW(GLES3DescriptorSetLayout(this));
}

PipelineLayout *GLES3Device::createPipelineLayout() {
    return CC_NEW(GLES3PipelineLayout(this));
}

PipelineState *GLES3Device::createPipelineState() {
    return CC_NEW(GLES3PipelineState(this));
}

void GLES3Device::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    GLES3CmdFuncCopyBuffersToTexture(this, buffers, ((GLES3Texture *)dst)->gpuTexture(), regions, count);
}

} // namespace gfx
} // namespace cc
