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
#include "GLES2PipelineLayout.h"
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

bool GLES2Device::initialize(const GFXDeviceInfo &info) {
    _gfxAPI = GFXAPI::GLES2;
    _deviceName = "GLES2";
    _width = info.width;
    _height = info.height;
    _nativeWidth = info.nativeWidth;
    _nativeHeight = info.nativeHeight;
    _windowHandle = info.windowHandle;

    stateCache = CC_NEW(GLES2StateCache);

    GFXContextInfo ctx_info;
    ctx_info.windowHandle = _windowHandle;
    ctx_info.sharedCtx = info.sharedCtx;

    _context = CC_NEW(GLES2Context(this));
    if (!_context->initialize(ctx_info)) {
        destroy();
        return false;
    }

    String extStr = (const char *)glGetString(GL_EXTENSIONS);
    _extensions = StringUtil::Split(extStr, " ");

    _features[(int)GFXFeature::TEXTURE_FLOAT] = true;
    _features[(int)GFXFeature::TEXTURE_HALF_FLOAT] = true;
    _features[(int)GFXFeature::FORMAT_R11G11B10F] = true;
    _features[(int)GFXFeature::FORMAT_D24S8] = true;
    _features[(int)GFXFeature::MSAA] = true;

    if (checkExtension("color_buffer_float"))
        _features[(int)GFXFeature::COLOR_FLOAT] = true;

    if (checkExtension("color_buffer_half_float"))
        _features[(int)GFXFeature::COLOR_HALF_FLOAT] = true;

    if (checkExtension("texture_float_linear"))
        _features[(int)GFXFeature::TEXTURE_FLOAT_LINEAR] = true;

    if (checkExtension("texture_half_float_linear"))
        _features[(int)GFXFeature::TEXTURE_HALF_FLOAT_LINEAR] = true;

    _useVAO = checkExtension("vertex_array_object");
    _useDrawInstanced = checkExtension("draw_instanced");
    _useInstancedArrays = _features[(int)GFXFeature::INSTANCED_ARRAYS] = checkExtension("instanced_arrays");
    _useDiscardFramebuffer = checkExtension("discard_framebuffer");

    String compressed_fmts;

    if (checkExtension("compressed_ETC1")) {
        _features[(int)GFXFeature::FORMAT_ETC1] = true;
        compressed_fmts += "etc1 ";
    }

    _features[(int)GFXFeature::FORMAT_ETC2] = true;
    compressed_fmts += "etc2 ";

    if (checkExtension("texture_compression_pvrtc")) {
        _features[(int)GFXFeature::FORMAT_PVRTC] = true;
        compressed_fmts += "pvrtc ";
    }

    if (checkExtension("texture_compression_astc")) {
        _features[(int)GFXFeature::FORMAT_ASTC] = true;
        compressed_fmts += "astc ";
    }
    _features[static_cast<uint>(GFXFeature::DEPTH_BOUNDS)] = true;
    _features[static_cast<uint>(GFXFeature::LINE_WIDTH)] = true;
    _features[static_cast<uint>(GFXFeature::STENCIL_COMPARE_MASK)] = true;
    _features[static_cast<uint>(GFXFeature::STENCIL_WRITE_MASK)] = true;
    _features[static_cast<uint>(GFXFeature::FORMAT_RGB8)] = checkExtension("rgb8");
    _features[static_cast<uint>(GFXFeature::FORMAT_D16)] = true;
    _features[static_cast<uint>(GFXFeature::FORMAT_D16S8)] = false;
    _features[static_cast<uint>(GFXFeature::FORMAT_D24)] = checkExtension("depth24");
    _features[static_cast<uint>(GFXFeature::FORMAT_D24S8)] = checkExtension("packed_depth_stencil");
    _features[static_cast<uint>(GFXFeature::FORMAT_D32F)] = checkExtension("depth32");
    _features[static_cast<uint>(GFXFeature::FORMAT_D32FS8)] = checkExtension("depth_buffer_float");

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
    CC_LOG_INFO("COMPRESSED_FORMATS: %s", compressed_fmts.c_str());

    GFXQueueInfo queue_info;
    queue_info.type = GFXQueueType::GRAPHICS;
    _queue = createQueue(queue_info);

    GFXCommandAllocatorInfo cmd_alloc_info;
    _cmdAllocator = createCommandAllocator(cmd_alloc_info);

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
    CC_SAFE_DESTROY(_cmdAllocator);
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_context);
    CC_SAFE_DELETE(stateCache);
}

void GLES2Device::resize(uint width, uint height) {
    _width = width;
    _height = height;
}

void GLES2Device::present() {
    ((GLES2CommandAllocator *)_cmdAllocator)->releaseCmds();
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

GFXFence *GLES2Device::createFence(const GFXFenceInfo &info) {
    GFXFence *fence = CC_NEW(GLES2Fence(this));
    if (fence->initialize(info))
        return fence;

    CC_SAFE_DESTROY(fence);
    return nullptr;
}

GFXQueue *GLES2Device::createQueue(const GFXQueueInfo &info) {
    GFXQueue *queue = CC_NEW(GLES2Queue(this));
    if (queue->initialize(info))
        return queue;

    CC_SAFE_DESTROY(queue);
    return nullptr;
}

GFXCommandAllocator *GLES2Device::createCommandAllocator(const GFXCommandAllocatorInfo &info) {
    GFXCommandAllocator *cmdAllocator = CC_NEW(GLES2CommandAllocator(this));
    if (cmdAllocator->initialize(info))
        return cmdAllocator;

    CC_SAFE_DESTROY(cmdAllocator);

    return nullptr;
}

GFXCommandBuffer *GLES2Device::createCommandBuffer(const GFXCommandBufferInfo &info) {
    GFXCommandBuffer *cmdBuff = CC_NEW(GLES2CommandBuffer(this));
    if (cmdBuff->initialize(info))
        return cmdBuff;

    CC_SAFE_DESTROY(cmdBuff);
    return nullptr;
}

GFXBuffer *GLES2Device::createBuffer(const GFXBufferInfo &info) {
    GFXBuffer *buffer = CC_NEW(GLES2Buffer(this));
    if (buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

GFXTexture *GLES2Device::createTexture(const GFXTextureInfo &info) {
    GFXTexture *texture = CC_NEW(GLES2Texture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

GFXTexture *GLES2Device::createTexture(const GFXTextureViewInfo &info) {
    GFXTexture *texture = CC_NEW(GLES2Texture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

GFXSampler *GLES2Device::createSampler(const GFXSamplerInfo &info) {
    GFXSampler *sampler = CC_NEW(GLES2Sampler(this));
    if (sampler->initialize(info))
        return sampler;

    CC_SAFE_DESTROY(sampler);
    return nullptr;
}

GFXShader *GLES2Device::createShader(const GFXShaderInfo &info) {
    GFXShader *shader = CC_NEW(GLES2Shader(this));
    if (shader->initialize(info))
        return shader;

    CC_SAFE_DESTROY(shader);
    return nullptr;
}

GFXInputAssembler *GLES2Device::createInputAssembler(const GFXInputAssemblerInfo &info) {
    GFXInputAssembler *inputAssembler = CC_NEW(GLES2InputAssembler(this));
    if (inputAssembler->initialize(info))
        return inputAssembler;

    CC_SAFE_DESTROY(inputAssembler);
    return nullptr;
}

GFXRenderPass *GLES2Device::createRenderPass(const GFXRenderPassInfo &info) {
    GFXRenderPass *renderPass = CC_NEW(GLES2RenderPass(this));
    if (renderPass->initialize(info))
        return renderPass;

    CC_SAFE_DESTROY(renderPass);
    return nullptr;
}

GFXFramebuffer *GLES2Device::createFramebuffer(const GFXFramebufferInfo &info) {
    GFXFramebuffer *framebuffer = CC_NEW(GLES2Framebuffer(this));
    if (framebuffer->initialize(info))
        return framebuffer;

    CC_SAFE_DESTROY(framebuffer);
    return nullptr;
}

GFXBindingLayout *GLES2Device::createBindingLayout(const GFXBindingLayoutInfo &info) {
    GFXBindingLayout *bindingLayout = CC_NEW(GLES2BindingLayout(this));
    if (bindingLayout->initialize(info))
        return bindingLayout;

    CC_SAFE_DESTROY(bindingLayout);
    return nullptr;
}

GFXPipelineState *GLES2Device::createPipelineState(const GFXPipelineStateInfo &info) {
    GFXPipelineState *pipelineState = CC_NEW(GLES2PipelineState(this));
    if (pipelineState->initialize(info))
        return pipelineState;

    CC_SAFE_DESTROY(pipelineState);
    return nullptr;
}

GFXPipelineLayout *GLES2Device::createPipelineLayout(const GFXPipelineLayoutInfo &info) {
    GFXPipelineLayout *layout = CC_NEW(GLES2PipelineLayout(this));
    if (layout->initialize(info))
        return layout;

    CC_SAFE_DESTROY(layout);
    return nullptr;
}

void GLES2Device::copyBuffersToTexture(const GFXDataArray &buffers, GFXTexture *dst, const GFXBufferTextureCopyList &regions) {
    GLES2CmdFuncCopyBuffersToTexture(this, buffers.datas.data(), ((GLES2Texture *)dst)->gpuTexture(), regions);
}

} // namespace gfx
} // namespace cc
