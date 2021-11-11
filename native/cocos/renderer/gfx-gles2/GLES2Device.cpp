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

#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2CommandBuffer.h"
#include "GLES2Commands.h"
#include "GLES2DescriptorSet.h"
#include "GLES2DescriptorSetLayout.h"
#include "GLES2Device.h"
#include "GLES2Framebuffer.h"
#include "GLES2GPUObjects.h"
#include "GLES2InputAssembler.h"
#include "GLES2PipelineLayout.h"
#include "GLES2PipelineState.h"
#include "GLES2PrimaryCommandBuffer.h"
#include "GLES2Queue.h"
#include "GLES2RenderPass.h"
#include "GLES2Shader.h"
#include "GLES2Swapchain.h"
#include "GLES2Texture.h"
#include "states/GLES2Sampler.h"

// when capturing GLES commands (RENDERDOC_HOOK_EGL=1, default value)
// renderdoc doesn't support this extension during replay
#define ALLOW_MULTISAMPLED_RENDER_TO_TEXTURE_ON_DESKTOP 0

namespace cc {
namespace gfx {

GLES2Device *GLES2Device::instance = nullptr;

GLES2Device *GLES2Device::getInstance() {
    return GLES2Device::instance;
}

GLES2Device::GLES2Device() {
    _api        = API::GLES2;
    _deviceName = "GLES2";

    GLES2Device::instance = this;
}

GLES2Device::~GLES2Device() {
    GLES2Device::instance = nullptr;
}

bool GLES2Device::doInit(const DeviceInfo & /*info*/) {
    _gpuContext             = CC_NEW(GLES2GPUContext);
    _gpuStateCache          = CC_NEW(GLES2GPUStateCache);
    _gpuBlitManager         = CC_NEW(GLES2GPUBlitManager);
    _gpuConstantRegistry    = CC_NEW(GLES2GPUConstantRegistry);
    _gpuFramebufferCacheMap = CC_NEW(GLES2GPUFramebufferCacheMap(_gpuStateCache));

    if (!_gpuContext->initialize(_gpuStateCache, _gpuConstantRegistry)) {
        destroy();
        return false;
    };

    QueueInfo queueInfo;
    queueInfo.type = QueueType::GRAPHICS;
    _queue         = createQueue(queueInfo);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type  = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff          = createCommandBuffer(cmdBuffInfo);

    String extStr = reinterpret_cast<const char *>(glGetString(GL_EXTENSIONS));
    _extensions   = StringUtil::split(extStr, " ");

    _multithreadedSubmission = false;

    if (checkExtension("EXT_sRGB")) {
        _features[toNumber(Feature::FORMAT_SRGB)] = true;
    }

    if (checkExtension("GL_OES_texture_float")) {
        _features[toNumber(Feature::TEXTURE_FLOAT)] = true;
    }

    if (checkExtension("GL_OES_texture_half_float")) {
        _features[toNumber(Feature::TEXTURE_HALF_FLOAT)] = true;
    }

    _features[toNumber(Feature::FORMAT_R11G11B10F)] = true;

    if (checkExtension("GL_OES_element_index_uint")) {
        _features[toNumber(Feature::ELEMENT_INDEX_UINT)] = true;
    }

    if (checkExtension("color_buffer_float")) {
        _features[toNumber(Feature::COLOR_FLOAT)] = true;
    }

    if (checkExtension("color_buffer_half_float")) {
        _features[toNumber(Feature::COLOR_HALF_FLOAT)] = true;
    }

    if (checkExtension("texture_float_linear")) {
        _features[toNumber(Feature::TEXTURE_FLOAT_LINEAR)] = true;
    }

    if (checkExtension("texture_half_float_linear")) {
        _features[toNumber(Feature::TEXTURE_HALF_FLOAT_LINEAR)] = true;
    }

    if (checkExtension("draw_buffers")) {
        _features[toNumber(Feature::MULTIPLE_RENDER_TARGETS)] = true;
        glGetIntegerv(GL_MAX_DRAW_BUFFERS_EXT, reinterpret_cast<GLint *>(&_caps.maxColorRenderTargets));
    }

    if (checkExtension("blend_minmax")) {
        _features[toNumber(Feature::BLEND_MINMAX)] = true;
    }

    _gpuConstantRegistry->useVAO                = checkExtension("vertex_array_object");
    _gpuConstantRegistry->useDrawInstanced      = checkExtension("draw_instanced");
    _gpuConstantRegistry->useInstancedArrays    = checkExtension("instanced_arrays");
    _gpuConstantRegistry->useDiscardFramebuffer = checkExtension("discard_framebuffer");

    _features[toNumber(Feature::INSTANCED_ARRAYS)] = _gpuConstantRegistry->useInstancedArrays;

    String fbfLevelStr = "NONE";
    // PVRVFrame has issues on their support
#if CC_PLATFORM != CC_PLATFORM_WINDOWS
    if (checkExtension("framebuffer_fetch")) {
        String nonCoherent = "framebuffer_fetch_non";

        auto it = std::find_if(_extensions.begin(), _extensions.end(), [&nonCoherent](auto &ext) {
            return ext.find(nonCoherent) != String::npos;
        });

        if (it != _extensions.end()) {
            if (*it == CC_TOSTR(GL_EXT_shader_framebuffer_fetch_non_coherent)) {
                _gpuConstantRegistry->mFBF = FBFSupportLevel::NON_COHERENT_EXT;
                fbfLevelStr                = "NON_COHERENT_EXT";
            } else if (*it == CC_TOSTR(GL_QCOM_shader_framebuffer_fetch_noncoherent)) {
                _gpuConstantRegistry->mFBF = FBFSupportLevel::NON_COHERENT_QCOM;
                fbfLevelStr                = "NON_COHERENT_QCOM";
                GL_CHECK(glEnable(GL_FRAMEBUFFER_FETCH_NONCOHERENT_QCOM));
            }
        } else if (checkExtension(CC_TOSTR(GL_EXT_shader_framebuffer_fetch))) {
            // we only care about EXT_shader_framebuffer_fetch, the ARM version does not support MRT
            _gpuConstantRegistry->mFBF = FBFSupportLevel::COHERENT;
            fbfLevelStr                = "COHERENT";
        }
        _features[toNumber(Feature::INPUT_ATTACHMENT_BENEFIT)] = _gpuConstantRegistry->mFBF != FBFSupportLevel::NONE;
    }
#endif

#if CC_PLATFORM != CC_PLATFORM_WINDOWS || ALLOW_MULTISAMPLED_RENDER_TO_TEXTURE_ON_DESKTOP
    if (checkExtension("multisampled_render_to_texture")) {
        if (checkExtension("multisampled_render_to_texture2")) {
            _gpuConstantRegistry->mMSRT = MSRTSupportLevel::LEVEL2;
        } else {
            _gpuConstantRegistry->mMSRT = MSRTSupportLevel::LEVEL1;
        }
    }
#endif

    String compressedFmts;

    if (checkExtension("compressed_ETC1")) {
        _features[toNumber(Feature::FORMAT_ETC1)] = true;
        compressedFmts += "etc1 ";
    }

    if (checkForETC2()) {
        _features[toNumber(Feature::FORMAT_ETC2)] = true;
        compressedFmts += "etc2 ";
    }

    if (checkExtension("texture_compression_pvrtc")) {
        _features[toNumber(Feature::FORMAT_PVRTC)] = true;
        compressedFmts += "pvrtc ";
    }

    if (checkExtension("texture_compression_astc")) {
        _features[toNumber(Feature::FORMAT_ASTC)] = true;
        compressedFmts += "astc ";
    }
    _features[toNumber(Feature::FORMAT_RGB8)] = true;

    _renderer = reinterpret_cast<const char *>(glGetString(GL_RENDERER));
    _vendor   = reinterpret_cast<const char *>(glGetString(GL_VENDOR));
    _version  = reinterpret_cast<const char *>(glGetString(GL_VERSION));

    glGetIntegerv(GL_MAX_VERTEX_ATTRIBS, reinterpret_cast<GLint *>(&_caps.maxVertexAttributes));
    glGetIntegerv(GL_MAX_VERTEX_UNIFORM_VECTORS, reinterpret_cast<GLint *>(&_caps.maxVertexUniformVectors));
    glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_VECTORS, reinterpret_cast<GLint *>(&_caps.maxFragmentUniformVectors));
    glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, reinterpret_cast<GLint *>(&_caps.maxTextureUnits));
    glGetIntegerv(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS, reinterpret_cast<GLint *>(&_caps.maxVertexTextureUnits));
    glGetIntegerv(GL_MAX_TEXTURE_SIZE, reinterpret_cast<GLint *>(&_caps.maxTextureSize));
    glGetIntegerv(GL_MAX_CUBE_MAP_TEXTURE_SIZE, reinterpret_cast<GLint *>(&_caps.maxCubeMapTextureSize));

    _gpuStateCache->initialize(_caps.maxTextureUnits, _caps.maxVertexAttributes);
    _gpuBlitManager->initialize();

    CC_LOG_INFO("GLES2 device initialized.");
    CC_LOG_INFO("RENDERER: %s", _renderer.c_str());
    CC_LOG_INFO("VENDOR: %s", _vendor.c_str());
    CC_LOG_INFO("VERSION: %s", _version.c_str());
    CC_LOG_INFO("COMPRESSED_FORMATS: %s", compressedFmts.c_str());
    CC_LOG_INFO("USE_VAO: %s", _gpuConstantRegistry->useVAO ? "true" : "false");
    CC_LOG_INFO("FRAMEBUFFER_FETCH: %s", fbfLevelStr.c_str());

    return true;
}

void GLES2Device::doDestroy() {
    _gpuBlitManager->destroy();

    CC_SAFE_DELETE(_gpuFramebufferCacheMap)
    CC_SAFE_DELETE(_gpuConstantRegistry)
    CC_SAFE_DELETE(_gpuBlitManager)
    CC_SAFE_DELETE(_gpuStateCache)

    CCASSERT(!_memoryStatus.bufferSize, "Buffer memory leaked");
    CCASSERT(!_memoryStatus.textureSize, "Texture memory leaked");

    CC_SAFE_DESTROY(_cmdBuff)
    CC_SAFE_DESTROY(_queue)
    CC_SAFE_DESTROY(_gpuContext)
}

void GLES2Device::acquire(Swapchain *const *swapchains, uint32_t count) {
    if (_onAcquire) _onAcquire->execute();

    _swapchains.clear();
    for (uint32_t i = 0; i < count; ++i) {
        _swapchains.push_back(static_cast<GLES2Swapchain *>(swapchains[i])->gpuSwapchain());
    }
}

void GLES2Device::present() {
    auto *queue   = static_cast<GLES2Queue *>(_queue);
    _numDrawCalls = queue->_numDrawCalls;
    _numInstances = queue->_numInstances;
    _numTriangles = queue->_numTriangles;

    for (auto *swapchain : _swapchains) {
        _gpuContext->present(swapchain);
    }

    // Clear queue stats
    queue->_numDrawCalls = 0;
    queue->_numInstances = 0;
    queue->_numTriangles = 0;
}

void GLES2Device::bindContext(bool bound) {
    _gpuContext->bindContext(bound);
}

CommandBuffer *GLES2Device::createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) {
    if (hasAgent || info.type == CommandBufferType::PRIMARY) return CC_NEW(GLES2PrimaryCommandBuffer);
    return CC_NEW(GLES2CommandBuffer);
}

Queue *GLES2Device::createQueue() {
    return CC_NEW(GLES2Queue);
}

Swapchain *GLES2Device::createSwapchain() {
    return CC_NEW(GLES2Swapchain);
}

Buffer *GLES2Device::createBuffer() {
    return CC_NEW(GLES2Buffer);
}

Texture *GLES2Device::createTexture() {
    return CC_NEW(GLES2Texture);
}

Shader *GLES2Device::createShader() {
    return CC_NEW(GLES2Shader);
}

InputAssembler *GLES2Device::createInputAssembler() {
    return CC_NEW(GLES2InputAssembler);
}

RenderPass *GLES2Device::createRenderPass() {
    return CC_NEW(GLES2RenderPass);
}

Framebuffer *GLES2Device::createFramebuffer() {
    return CC_NEW(GLES2Framebuffer);
}

DescriptorSet *GLES2Device::createDescriptorSet() {
    return CC_NEW(GLES2DescriptorSet);
}

DescriptorSetLayout *GLES2Device::createDescriptorSetLayout() {
    return CC_NEW(GLES2DescriptorSetLayout);
}

PipelineLayout *GLES2Device::createPipelineLayout() {
    return CC_NEW(GLES2PipelineLayout);
}

PipelineState *GLES2Device::createPipelineState() {
    return CC_NEW(GLES2PipelineState);
}

Sampler *GLES2Device::createSampler(const SamplerInfo &info, uint32_t hash) {
    return CC_NEW(GLES2Sampler(info, hash));
}

GlobalBarrier *GLES2Device::createGlobalBarrier(const GlobalBarrierInfo &info, uint32_t hash) {
    return CC_NEW(GlobalBarrier(info, hash));
}

TextureBarrier *GLES2Device::createTextureBarrier(const TextureBarrierInfo &info, uint32_t hash) {
    return CC_NEW(TextureBarrier(info, hash));
}

void GLES2Device::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint32_t count) {
    cmdFuncGLES2CopyBuffersToTexture(this, buffers, static_cast<GLES2Texture *>(dst)->gpuTexture(), regions, count);
}

void GLES2Device::copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count) {
    cmdFuncGLES2CopyTextureToBuffers(this, static_cast<GLES2Texture *>(src)->gpuTexture(), buffers, region, count);
}

bool GLES2Device::checkForETC2() {
    GLint numFormats = 0;
    glGetIntegerv(GL_NUM_COMPRESSED_TEXTURE_FORMATS, &numFormats);
    vector<GLint> formats(numFormats);
    glGetIntegerv(GL_COMPRESSED_TEXTURE_FORMATS, formats.data());

    int supportNum = 0;
    for (GLint i = 0; i < numFormats; ++i) {
        if (formats[i] == GL_COMPRESSED_RGB8_ETC2 || formats[i] == GL_COMPRESSED_RGBA8_ETC2_EAC) {
            supportNum++;
        }
    }
    return supportNum >= 2;
}

} // namespace gfx
} // namespace cc
