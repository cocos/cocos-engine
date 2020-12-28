#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2CommandBuffer.h"
#include "GLES2PrimaryCommandBuffer.h"
#include "GLES2Context.h"
#include "GLES2DescriptorSet.h"
#include "GLES2DescriptorSetLayout.h"
#include "GLES2Device.h"
#include "GLES2Fence.h"
#include "GLES2Framebuffer.h"
#include "GLES2InputAssembler.h"
#include "GLES2PipelineLayout.h"
#include "GLES2PipelineState.h"
#include "GLES2Queue.h"
#include "GLES2RenderPass.h"
#include "GLES2Sampler.h"
#include "GLES2Shader.h"
#include "GLES2Texture.h"

namespace cc {
namespace gfx {

GLES2Device::GLES2Device() {
}

GLES2Device::~GLES2Device() {
}

bool GLES2Device::initialize(const DeviceInfo &info) {
    _API = API::GLES2;
    _deviceName = "GLES2";
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

    _gpuStateCache = CC_NEW(GLES2GPUStateCache);
    _gpuStagingBufferPool = CC_NEW(GLES2GPUStagingBufferPool);

    ContextInfo ctxInfo;
    ctxInfo.windowHandle = _windowHandle;
    ctxInfo.sharedCtx = info.sharedCtx;

    _renderContext = CC_NEW(GLES2Context(this));
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

    if (checkExtension("color_buffer_float"))
        _features[(int)Feature::COLOR_FLOAT] = true;

    if (checkExtension("color_buffer_half_float"))
        _features[(int)Feature::COLOR_HALF_FLOAT] = true;

    if (checkExtension("texture_float_linear"))
        _features[(int)Feature::TEXTURE_FLOAT_LINEAR] = true;

    if (checkExtension("texture_half_float_linear"))
        _features[(int)Feature::TEXTURE_HALF_FLOAT_LINEAR] = true;

    if (checkExtension("draw_buffers"))
        _features[(int)Feature::MULTIPLE_RENDER_TARGETS] = true;

    if (checkExtension("blend_minmax"))
        _features[(int)Feature::BLEND_MINMAX] = true;

    _useVAO = checkExtension("vertex_array_object");
    _useDrawInstanced = checkExtension("draw_instanced");
    _useInstancedArrays = _features[(int)Feature::INSTANCED_ARRAYS] = checkExtension("instanced_arrays");
    _useDiscardFramebuffer = checkExtension("discard_framebuffer");

    String compressedFmts;

    if (checkExtension("compressed_ETC1")) {
        _features[(int)Feature::FORMAT_ETC1] = true;
        compressedFmts += "etc1 ";
    }

    if (checkForETC2()) {
        _features[(int)Feature::FORMAT_ETC2] = true;
        compressedFmts += "etc2 ";
    }

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

    if (checkExtension("depth_texture")) {
        _features[static_cast<uint>(Feature::FORMAT_D16)] = true;
        _features[static_cast<uint>(Feature::FORMAT_D24)] = true;
        _features[static_cast<uint>(Feature::FORMAT_D24S8)] = checkExtension("packed_depth_stencil");
    }

    _renderer = (const char *)glGetString(GL_RENDERER);
    _vendor = (const char *)glGetString(GL_VENDOR);
    _version = (const char *)glGetString(GL_VERSION);

    CC_LOG_INFO("GLES2 device initialized.");
    CC_LOG_INFO("RENDERER: %s", _renderer.c_str());
    CC_LOG_INFO("VENDOR: %s", _vendor.c_str());
    CC_LOG_INFO("VERSION: %s", _version.c_str());
    CC_LOG_INFO("SCREEN_SIZE: %d x %d", _width, _height);
    CC_LOG_INFO("NATIVE_SIZE: %d x %d", _nativeWidth, _nativeHeight);
    CC_LOG_INFO("USE_VAO: %s", _useVAO ? "true" : "false");
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
    glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, (GLint *)&_maxTextureUnits);
    glGetIntegerv(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS, (GLint *)&_maxVertexTextureUnits);
    glGetIntegerv(GL_MAX_TEXTURE_SIZE, (GLint *)&_maxTextureSize);
    glGetIntegerv(GL_MAX_CUBE_MAP_TEXTURE_SIZE, (GLint *)&_maxCubeMapTextureSize);
    glGetIntegerv(GL_DEPTH_BITS, (GLint *)&_depthBits);
    glGetIntegerv(GL_STENCIL_BITS, (GLint *)&_stencilBits);
    _uboOffsetAlignment = 1u;

    _gpuStateCache->initialize(_maxTextureUnits, _maxVertexAttributes);

    return true;
}

void GLES2Device::destroy() {
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_cmdBuff);
    CC_SAFE_DELETE(_gpuStagingBufferPool);
    CC_SAFE_DELETE(_gpuStateCache);
    CC_SAFE_DESTROY(_deviceContext);
    CC_SAFE_DESTROY(_renderContext);
}

void GLES2Device::resize(uint width, uint height) {
    _width = width;
    _height = height;
}

void GLES2Device::acquire() {
    _gpuStagingBufferPool->reset();
}

void GLES2Device::present() {
    GLES2Queue *queue = (GLES2Queue *)_queue;
    _numDrawCalls = queue->_numDrawCalls;
    _numInstances = queue->_numInstances;
    _numTriangles = queue->_numTriangles;

    _context->present();

    // Clear queue stats
    queue->_numDrawCalls = 0;
    queue->_numInstances = 0;
    queue->_numTriangles = 0;
}

void GLES2Device::bindRenderContext(bool bound) {
    _renderContext->MakeCurrent(bound);
    _context = bound ? _renderContext : nullptr;

    if (bound) {
        _threadID = std::hash<std::thread::id>()(std::this_thread::get_id());
        _gpuStateCache->reset();
    }
}

void GLES2Device::bindDeviceContext(bool bound) {
    if (!_deviceContext) {
        ContextInfo ctxInfo;
        ctxInfo.windowHandle = _windowHandle;
        ctxInfo.sharedCtx = _renderContext;

        _deviceContext = CC_NEW(GLES2Context(this));
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

CommandBuffer *GLES2Device::doCreateCommandBuffer(const CommandBufferInfo &info, bool hasAgent) {
    if (hasAgent || info.type == CommandBufferType::PRIMARY) return CC_NEW(GLES2PrimaryCommandBuffer(this));
    return CC_NEW(GLES2CommandBuffer(this));
}

Fence *GLES2Device::createFence() {
    return CC_NEW(GLES2Fence(this));
}

Queue *GLES2Device::createQueue() {
    return CC_NEW(GLES2Queue(this));
}

Buffer *GLES2Device::createBuffer() {
    return CC_NEW(GLES2Buffer(this));
}

Texture *GLES2Device::createTexture() {
    return CC_NEW(GLES2Texture(this));
}

Sampler *GLES2Device::createSampler() {
    return CC_NEW(GLES2Sampler(this));
}

Shader *GLES2Device::createShader() {
    return CC_NEW(GLES2Shader(this));
}

InputAssembler *GLES2Device::createInputAssembler() {
    return CC_NEW(GLES2InputAssembler(this));
}

RenderPass *GLES2Device::createRenderPass() {
    return CC_NEW(GLES2RenderPass(this));
}

Framebuffer *GLES2Device::createFramebuffer() {
    return CC_NEW(GLES2Framebuffer(this));
}

DescriptorSet *GLES2Device::createDescriptorSet() {
    return CC_NEW(GLES2DescriptorSet(this));
}

DescriptorSetLayout *GLES2Device::createDescriptorSetLayout() {
    return CC_NEW(GLES2DescriptorSetLayout(this));
}

PipelineLayout *GLES2Device::createPipelineLayout() {
    return CC_NEW(GLES2PipelineLayout(this));
}

PipelineState *GLES2Device::createPipelineState() {
    return CC_NEW(GLES2PipelineState(this));
}

void GLES2Device::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    GLES2CmdFuncCopyBuffersToTexture(this, buffers, ((GLES2Texture *)dst)->gpuTexture(), regions, count);
}

bool GLES2Device::checkForETC2() const {
    GLint numFormats = 0;
    glGetIntegerv(GL_NUM_COMPRESSED_TEXTURE_FORMATS, &numFormats);
    GLint* formats = new GLint[numFormats];
    glGetIntegerv(GL_COMPRESSED_TEXTURE_FORMATS, formats);

    int supportNum = 0;
    for (GLint i = 0; i < numFormats; ++i) {
        if (formats[i] == GL_COMPRESSED_RGB8_ETC2 || formats[i] == GL_COMPRESSED_RGBA8_ETC2_EAC)
            supportNum++;
    }
    delete [] formats;

    return supportNum >= 2;
}

} // namespace gfx
} // namespace cc
