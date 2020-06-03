#include "GLES3Std.h"
#include "GLES3Device.h"
#include "GLES3StateCache.h"
#include "GLES3Context.h"
#include "GLES3Window.h"
#include "GLES3Fence.h"
#include "GLES3Queue.h"
#include "GLES3CommandAllocator.h"
#include "GLES3CommandBuffer.h"
#include "GLES3Buffer.h"
#include "GLES3Texture.h"
#include "GLES3TextureView.h"
#include "GLES3Sampler.h"
#include "GLES3Shader.h"
#include "GLES3InputAssembler.h"
#include "GLES3RenderPass.h"
#include "GLES3Framebuffer.h"
#include "GLES3BindingLayout.h"
#include "GLES3PipelineLayout.h"
#include "GLES3PipelineState.h"

NS_CC_BEGIN

GLES3Device::GLES3Device() {
}

GLES3Device::~GLES3Device() {
}

bool GLES3Device::initialize(const GFXDeviceInfo &info) {
    _gfxAPI = GFXAPI::GLES3;
    _deviceName = "GLES3";
    _width = info.width;
    _height = info.height;
    _nativeWidth = info.nativeWidth;
    _nativeHeight = info.nativeHeight;
    _windowHandle = info.windowHandle;

    stateCache = CC_NEW(GLES3StateCache);

    GFXContextInfo ctx_info;
    ctx_info.windowHandle = _windowHandle;
    ctx_info.sharedCtx = info.sharedCtx;

    _context = CC_NEW(GLES3Context(this));
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
    _features[(int)GFXFeature::INSTANCED_ARRAYS] = true;

    if (checkExtension("color_buffer_float"))
        _features[(int)GFXFeature::COLOR_FLOAT] = true;

    if (checkExtension("color_buffer_half_float"))
        _features[(int)GFXFeature::COLOR_HALF_FLOAT] = true;

    if (checkExtension("texture_float_linear"))
        _features[(int)GFXFeature::TEXTURE_FLOAT_LINEAR] = true;

    if (checkExtension("texture_half_float_linear"))
        _features[(int)GFXFeature::TEXTURE_HALF_FLOAT_LINEAR] = true;

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

    _renderer = (const char *)glGetString(GL_RENDERER);
    _vendor = (const char *)glGetString(GL_VENDOR);
    _version = (const char *)glGetString(GL_VERSION);

    CC_LOG_INFO("GLES3 device initialized.");
    CC_LOG_INFO("RENDERER: %s", _renderer.c_str());
    CC_LOG_INFO("VENDOR: %s", _vendor.c_str());
    CC_LOG_INFO("VERSION: %s", _version.c_str());
    CC_LOG_INFO("SCREEN_SIZE: %d x %d", _width, _height);
    CC_LOG_INFO("NATIVE_SIZE: %d x %d", _nativeWidth, _nativeHeight);
    CC_LOG_INFO("USE_VAO: %s", _useVAO ? "true" : "false");
    CC_LOG_INFO("COMPRESSED_FORMATS: %s", compressed_fmts.c_str());

    GFXWindowInfo window_info;
    window_info.colorFmt = _context->getColorFormat();
    window_info.depthStencilFmt = _context->getDepthStencilFormat();
    window_info.isOffscreen = false;
    _window = createWindow(window_info);

    GFXQueueInfo queue_info;
    queue_info.type = GFXQueueType::GRAPHICS;
    _queue = createQueue(queue_info);

    GFXCommandAllocatorInfo cmd_alloc_info;
    _cmdAllocator = createCommandAllocator(cmd_alloc_info);

    glGetIntegerv(GL_MAX_VERTEX_ATTRIBS, &_maxVertexAttributes);
    glGetIntegerv(GL_MAX_VERTEX_UNIFORM_VECTORS, &_maxVertexUniformVectors);
    glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_VECTORS, &_maxFragmentUniformVectors);
    glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, &_maxTextureUnits);
    glGetIntegerv(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS, &_maxVertexTextureUnits);
    glGetIntegerv(GL_MAX_TEXTURE_SIZE, &_maxTextureSize);
    glGetIntegerv(GL_MAX_CUBE_MAP_TEXTURE_SIZE, &_maxCubeMapTextureSize);
    glGetIntegerv(GL_DEPTH_BITS, &_depthBits);
    glGetIntegerv(GL_STENCIL_BITS, &_stencilBits);

    return true;
}

void GLES3Device::destroy() {
    CC_SAFE_DESTROY(_cmdAllocator);
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_window);
    CC_SAFE_DESTROY(_context);
    CC_SAFE_DELETE(stateCache);
}

void GLES3Device::resize(uint width, uint height) {
    _width = width;
    _height = height;
    _window->resize(width, height);
}

void GLES3Device::present() {
    ((GLES3CommandAllocator *)_cmdAllocator)->releaseCmds();
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

GFXWindow *GLES3Device::createWindow(const GFXWindowInfo &info) {
    GFXWindow *window = CC_NEW(GLES3Window(this));
    if (window->initialize(info))
        return window;

    CC_SAFE_DESTROY(window);
    return nullptr;
}

GFXFence *GLES3Device::createFence(const GFXFenceInfo &info) {
    GFXFence *fence = CC_NEW(GLES3Fence(this));
    if (fence->initialize(info))
        return fence;

    CC_SAFE_DESTROY(fence);
    return nullptr;
}

GFXQueue *GLES3Device::createQueue(const GFXQueueInfo &info) {
    GFXQueue *queue = CC_NEW(GLES3Queue(this));
    if (queue->initialize(info))
        return queue;

    CC_SAFE_DESTROY(queue);
    return nullptr;
}

GFXCommandAllocator *GLES3Device::createCommandAllocator(const GFXCommandAllocatorInfo &info) {
    GFXCommandAllocator *cmdAllocator = CC_NEW(GLES3CommandAllocator(this));
    if (cmdAllocator->initialize(info))
        return cmdAllocator;

    CC_SAFE_DESTROY(cmdAllocator);
    return nullptr;
}

GFXCommandBuffer *GLES3Device::createCommandBuffer(const GFXCommandBufferInfo &info) {
    GFXCommandBuffer *cmd_buff = CC_NEW(GLES3CommandBuffer(this));
    if (cmd_buff->initialize(info))
        return cmd_buff;

    CC_SAFE_DESTROY(cmd_buff)
    return nullptr;
}

GFXBuffer *GLES3Device::createBuffer(const GFXBufferInfo &info) {
    GFXBuffer *buffer = CC_NEW(GLES3Buffer(this));
    if (buffer->initialize(info))
        return buffer;

    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

GFXTexture *GLES3Device::createTexture(const GFXTextureInfo &info) {
    GFXTexture *texture = CC_NEW(GLES3Texture(this));
    if (texture->initialize(info))
        return texture;

    CC_SAFE_DESTROY(texture);
    return nullptr;
}

GFXTextureView *GLES3Device::createTextureView(const GFXTextureViewInfo &info) {
    GFXTextureView *texView = CC_NEW(GLES3TextureView(this));
    if (texView->initialize(info))
        return texView;

    CC_SAFE_DESTROY(texView);
    return nullptr;
}

GFXSampler *GLES3Device::createSampler(const GFXSamplerInfo &info) {
    GFXSampler *sampler = CC_NEW(GLES3Sampler(this));
    if (sampler->initialize(info))
        return sampler;

    CC_SAFE_DESTROY(sampler);
    return nullptr;
}

GFXShader *GLES3Device::createShader(const GFXShaderInfo &info) {
    GFXShader *shader = CC_NEW(GLES3Shader(this));
    if (shader->initialize(info))
        return shader;

    CC_SAFE_DESTROY(shader);
    return nullptr;
}

GFXInputAssembler *GLES3Device::createInputAssembler(const GFXInputAssemblerInfo &info) {
    GFXInputAssembler *inputAssembler = CC_NEW(GLES3InputAssembler(this));
    if (inputAssembler->initialize(info))
        return inputAssembler;

    CC_SAFE_DESTROY(inputAssembler);
    return nullptr;
}

GFXRenderPass *GLES3Device::createRenderPass(const GFXRenderPassInfo &info) {
    GFXRenderPass *renderPass = CC_NEW(GLES3RenderPass(this));
    if (renderPass->initialize(info))
        return renderPass;

    CC_SAFE_DESTROY(renderPass);
    return nullptr;
}

GFXFramebuffer *GLES3Device::createFramebuffer(const GFXFramebufferInfo &info) {
    GFXFramebuffer *framebuffer = CC_NEW(GLES3Framebuffer(this));
    if (framebuffer->initialize(info))
        return framebuffer;

    CC_SAFE_DESTROY(framebuffer);
    return nullptr;
}

GFXBindingLayout *GLES3Device::createBindingLayout(const GFXBindingLayoutInfo &info) {
    GFXBindingLayout *bindingLayout = CC_NEW(GLES3BindingLayout(this));
    if (bindingLayout->initialize(info))
        return bindingLayout;

    CC_SAFE_DESTROY(bindingLayout);
    return nullptr;
}

GFXPipelineState *GLES3Device::createPipelineState(const GFXPipelineStateInfo &info) {
    GFXPipelineState *pipelineState = CC_NEW(GLES3PipelineState(this));
    if (pipelineState->initialize(info))
        return pipelineState;

    CC_SAFE_DESTROY(pipelineState);
    return nullptr;
}

GFXPipelineLayout *GLES3Device::createPipelineLayout(const GFXPipelineLayoutInfo &info) {
    GFXPipelineLayout *layout = CC_NEW(GLES3PipelineLayout(this));
    if (layout->initialize(info))
        return layout;

    CC_SAFE_DESTROY(layout);
    return nullptr;
}

void GLES3Device::copyBuffersToTexture(const GFXDataArray &buffers, GFXTexture *dst, const GFXBufferTextureCopyList &regions) {

    GLES3CmdFuncCopyBuffersToTexture(this, buffers.datas.data(), ((GLES3Texture *)dst)->gpuTexture(), regions);
}

NS_CC_END
