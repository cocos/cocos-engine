#include "GLES2Std.h"

#include "GLES2BindingLayout.h"
#include "GLES2Buffer.h"
#include "GLES2CommandAllocator.h"
#include "GLES2CommandBuffer.h"
#include "GLES2Context.h"
#include "GLES2Device.h"
#include "GLES2Fence.h"
#include "GLES2Framebuffer.h"
#include "GLES2InputAssembler.h"
#include "GLES2PipelineState.h"
#include "GLES2Queue.h"
#include "GLES2RenderPass.h"
#include "GLES2Sampler.h"
#include "GLES2Shader.h"
#include "GLES2StateCache.h"
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

    _cmdAllocator = CC_NEW(GLES2CommandAllocator);
    stateCache = CC_NEW(GLES2StateCache);

    ContextInfo ctxInfo;
    ctxInfo.windowHandle = _windowHandle;
    ctxInfo.sharedCtx = info.sharedCtx;

    _context = CC_NEW(GLES2Context(this));
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

    if (checkExtension("color_buffer_float"))
        _features[(int)Feature::COLOR_FLOAT] = true;

    if (checkExtension("color_buffer_half_float"))
        _features[(int)Feature::COLOR_HALF_FLOAT] = true;

    if (checkExtension("texture_float_linear"))
        _features[(int)Feature::TEXTURE_FLOAT_LINEAR] = true;

    if (checkExtension("texture_half_float_linear"))
        _features[(int)Feature::TEXTURE_HALF_FLOAT_LINEAR] = true;

    _useVAO = checkExtension("vertex_array_object");
    _useDrawInstanced = checkExtension("draw_instanced");
    _useInstancedArrays = _features[(int)Feature::INSTANCED_ARRAYS] = checkExtension("instanced_arrays");
    _useDiscardFramebuffer = checkExtension("discard_framebuffer");

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

    glGetIntegerv(GL_MAX_VERTEX_ATTRIBS, (GLint *)&_maxVertexAttributes);
    glGetIntegerv(GL_MAX_VERTEX_UNIFORM_VECTORS, (GLint *)&_maxVertexUniformVectors);
    glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_VECTORS, (GLint *)&_maxFragmentUniformVectors);
    glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, (GLint *)&_maxTextureUnits);
    glGetIntegerv(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS, (GLint *)&_maxVertexTextureUnits);
    glGetIntegerv(GL_MAX_TEXTURE_SIZE, (GLint *)&_maxTextureSize);
    glGetIntegerv(GL_MAX_CUBE_MAP_TEXTURE_SIZE, (GLint *)&_maxCubeMapTextureSize);
    glGetIntegerv(GL_DEPTH_BITS, (GLint *)&_depthBits);
    glGetIntegerv(GL_STENCIL_BITS, (GLint *)&_stencilBits);

    return true;
}

void GLES2Device::destroy() {
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_context);
    CC_SAFE_DELETE(_cmdAllocator);
    CC_SAFE_DELETE(stateCache);
}

void GLES2Device::resize(uint width, uint height) {
    _width = width;
    _height = height;
}

void GLES2Device::acquire() {
    _cmdAllocator->releaseCmds();
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

CommandBuffer *GLES2Device::createCommandBuffer(const CommandBufferInfo &info) {
    CommandBuffer *cmdBuff = CC_NEW(GLES2CommandBuffer(this));
    if (cmdBuff->initialize(info))
        return cmdBuff;

    CC_SAFE_DESTROY(cmdBuff);
    return nullptr;
}

Fence *GLES2Device::createFence(const FenceInfo &info) {
    Fence *fence = CC_NEW(GLES2Fence(this));
    if (fence->initialize(info))
        return fence;

    CC_SAFE_DESTROY(fence);
    return nullptr;
}

Queue *GLES2Device::createQueue(const QueueInfo &info) {
    Queue *queue = CC_NEW(GLES2Queue(this));
    if (queue->initialize(info))
        return queue;

    CC_SAFE_DESTROY(queue);
    return nullptr;
}

Buffer *GLES2Device::createBuffer(const BufferInfo &info) {
    Buffer *buffer = CC_NEW(GLES2Buffer(this));
    if (buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

Texture *GLES2Device::createTexture(const TextureInfo &info) {
    Texture *texture = CC_NEW(GLES2Texture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

Texture *GLES2Device::createTexture(const TextureViewInfo &info) {
    Texture *texture = CC_NEW(GLES2Texture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

Sampler *GLES2Device::createSampler(const SamplerInfo &info) {
    Sampler *sampler = CC_NEW(GLES2Sampler(this));
    if (sampler->initialize(info))
        return sampler;

    CC_SAFE_DESTROY(sampler);
    return nullptr;
}

Shader *GLES2Device::createShader(const ShaderInfo &info) {
    Shader *shader = CC_NEW(GLES2Shader(this));
    if (shader->initialize(info))
        return shader;

    CC_SAFE_DESTROY(shader);
    return nullptr;
}

InputAssembler *GLES2Device::createInputAssembler(const InputAssemblerInfo &info) {
    InputAssembler *inputAssembler = CC_NEW(GLES2InputAssembler(this));
    if (inputAssembler->initialize(info))
        return inputAssembler;

    CC_SAFE_DESTROY(inputAssembler);
    return nullptr;
}

RenderPass *GLES2Device::createRenderPass(const RenderPassInfo &info) {
    RenderPass *renderPass = CC_NEW(GLES2RenderPass(this));
    if (renderPass->initialize(info))
        return renderPass;

    CC_SAFE_DESTROY(renderPass);
    return nullptr;
}

Framebuffer *GLES2Device::createFramebuffer(const FramebufferInfo &info) {
    Framebuffer *framebuffer = CC_NEW(GLES2Framebuffer(this));
    if (framebuffer->initialize(info))
        return framebuffer;

    CC_SAFE_DESTROY(framebuffer);
    return nullptr;
}

BindingLayout *GLES2Device::createBindingLayout(const BindingLayoutInfo &info) {
    BindingLayout *bindingLayout = CC_NEW(GLES2BindingLayout(this));
    if (bindingLayout->initialize(info))
        return bindingLayout;

    CC_SAFE_DESTROY(bindingLayout);
    return nullptr;
}

PipelineState *GLES2Device::createPipelineState(const PipelineStateInfo &info) {
    PipelineState *pipelineState = CC_NEW(GLES2PipelineState(this));
    if (pipelineState->initialize(info))
        return pipelineState;

    CC_SAFE_DESTROY(pipelineState);
    return nullptr;
}

void GLES2Device::copyBuffersToTexture(const BufferDataList &buffers, Texture *dst, const BufferTextureCopyList &regions) {
    GLES2CmdFuncCopyBuffersToTexture(this, buffers, ((GLES2Texture *)dst)->gpuTexture(), regions);
}

} // namespace gfx
} // namespace cc
