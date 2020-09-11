#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3CommandAllocator.h"
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
#include "GLES3Queue.h"
#include "GLES3RenderPass.h"
#include "GLES3Sampler.h"
#include "GLES3Shader.h"
#include "GLES3StateCache.h"
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

    _cmdAllocator = CC_NEW(GLES3CommandAllocator);
    stateCache = CC_NEW(GLES3StateCache);

    ContextInfo ctxInfo;
    ctxInfo.windowHandle = _windowHandle;
    ctxInfo.sharedCtx = info.sharedCtx;

    _context = CC_NEW(GLES3Context(this));
    if (!_context->initialize(ctxInfo)) {
        destroy();
        return false;
    }

    String extStr = (const char *)glGetString(GL_EXTENSIONS);
    _extensions = StringUtil::Split(extStr, " ");

    _features[(int)Feature::TEXTURE_FLOAT] = true;
    _features[(int)Feature::TEXTURE_HALF_FLOAT] = true;
    _features[(int)Feature::FORMAT_R11G11B10F] = true;
    _features[(int)Feature::FORMAT_D24S8] = true;
    _features[(int)Feature::MSAA] = true;
    _features[(int)Feature::INSTANCED_ARRAYS] = true;

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

    stateCache->initialize(_maxTextureUnits, _maxUniformBufferBindings, _maxVertexAttributes);

    return true;
}

void GLES3Device::destroy() {
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_context);
    CC_SAFE_DELETE(_cmdAllocator);
    CC_SAFE_DELETE(stateCache);
}

void GLES3Device::resize(uint width, uint height) {
    _width = width;
    _height = height;
}

void GLES3Device::acquire() {
    _cmdAllocator->releaseCmds();
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

CommandBuffer *GLES3Device::createCommandBuffer(const CommandBufferInfo &info) {
    CommandBuffer *cmd_buff = CC_NEW(GLES3CommandBuffer(this));
    if (cmd_buff->initialize(info))
        return cmd_buff;

    CC_SAFE_DESTROY(cmd_buff)
    return nullptr;
}

Fence *GLES3Device::createFence(const FenceInfo &info) {
    Fence *fence = CC_NEW(GLES3Fence(this));
    if (fence->initialize(info))
        return fence;

    CC_SAFE_DESTROY(fence);
    return nullptr;
}

Queue *GLES3Device::createQueue(const QueueInfo &info) {
    Queue *queue = CC_NEW(GLES3Queue(this));
    if (queue->initialize(info))
        return queue;

    CC_SAFE_DESTROY(queue);
    return nullptr;
}

Buffer *GLES3Device::createBuffer(const BufferInfo &info) {
    Buffer *buffer = CC_NEW(GLES3Buffer(this));
    if (buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

Buffer *GLES3Device::createBuffer(const BufferViewInfo &info) {
    Buffer *buffer = CC_NEW(GLES3Buffer(this));
    if (buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

Texture *GLES3Device::createTexture(const TextureInfo &info) {
    Texture *texture = CC_NEW(GLES3Texture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

Texture *GLES3Device::createTexture(const TextureViewInfo &info) {
    Texture *texture = CC_NEW(GLES3Texture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

Sampler *GLES3Device::createSampler(const SamplerInfo &info) {
    Sampler *sampler = CC_NEW(GLES3Sampler(this));
    if (sampler->initialize(info))
        return sampler;

    CC_SAFE_DESTROY(sampler);
    return nullptr;
}

Shader *GLES3Device::createShader(const ShaderInfo &info) {
    Shader *shader = CC_NEW(GLES3Shader(this));
    if (shader->initialize(info))
        return shader;

    CC_SAFE_DESTROY(shader);
    return nullptr;
}

InputAssembler *GLES3Device::createInputAssembler(const InputAssemblerInfo &info) {
    InputAssembler *inputAssembler = CC_NEW(GLES3InputAssembler(this));
    if (inputAssembler->initialize(info))
        return inputAssembler;

    CC_SAFE_DESTROY(inputAssembler);
    return nullptr;
}

RenderPass *GLES3Device::createRenderPass(const RenderPassInfo &info) {
    RenderPass *renderPass = CC_NEW(GLES3RenderPass(this));
    if (renderPass->initialize(info))
        return renderPass;

    CC_SAFE_DESTROY(renderPass);
    return nullptr;
}

Framebuffer *GLES3Device::createFramebuffer(const FramebufferInfo &info) {
    Framebuffer *framebuffer = CC_NEW(GLES3Framebuffer(this));
    if (framebuffer->initialize(info))
        return framebuffer;

    CC_SAFE_DESTROY(framebuffer);
    return nullptr;
}

DescriptorSet *GLES3Device::createDescriptorSet(const DescriptorSetInfo &info) {
    DescriptorSet *descriptorSet = CC_NEW(GLES3DescriptorSet(this));
    if (descriptorSet->initialize(info))
        return descriptorSet;

    CC_SAFE_DESTROY(descriptorSet);
    return nullptr;
}

DescriptorSetLayout *GLES3Device::createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) {
    DescriptorSetLayout *descriptorSetLayout = CC_NEW(GLES3DescriptorSetLayout(this));
    if (descriptorSetLayout->initialize(info))
        return descriptorSetLayout;

    CC_SAFE_DESTROY(descriptorSetLayout);
    return nullptr;
}

PipelineLayout *GLES3Device::createPipelineLayout(const PipelineLayoutInfo &info) {
    PipelineLayout *pipelineLayout = CC_NEW(GLES3PipelineLayout(this));
    if (pipelineLayout->initialize(info))
        return pipelineLayout;

    CC_SAFE_DESTROY(pipelineLayout);
    return nullptr;
}

PipelineState *GLES3Device::createPipelineState(const PipelineStateInfo &info) {
    PipelineState *pipelineState = CC_NEW(GLES3PipelineState(this));
    if (pipelineState->initialize(info))
        return pipelineState;

    CC_SAFE_DESTROY(pipelineState);
    return nullptr;
}

void GLES3Device::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    GLES3CmdFuncCopyBuffersToTexture(this, buffers, ((GLES3Texture *)dst)->gpuTexture(), regions, count);
}

} // namespace gfx
} // namespace cc
